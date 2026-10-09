/**
 * QR customer-flow order service.
 *
 * Frontend-only today: keeps a per-session store (sessionStorage) so a mock
 * order survives navigation between cart → status → bill → payment → feedback.
 *
 * Every function is async and lives behind this module so the body can be
 * swapped for `fetch('/api/...')` calls without touching a single component.
 */

export interface QROrderLine {
  menuItemId: string
  name: string
  quantity: number
  unitPrice: number
  selectedVariant?: string
  selectedAddons: { name: string; price: number }[]
  specialInstructions?: string
}

export interface QROrderTotals {
  subtotal: number
  discount: number
  tax: number
  serviceCharge: number
  grandTotal: number
}

export interface QROrderSession extends QROrderTotals {
  id: string
  displayNumber: string
  restaurantId: string
  tableId: string
  items: QROrderLine[]
  placedAt: string
  status: 'received' | 'preparing' | 'ready' | 'served'
  paymentMethod: string | null
  txnId: string | null
  paidAt: string | null
  feedback: { food: number; service: number; comment: string } | null
}

export interface PlaceOrderInput {
  restaurantId: string
  tableId: string
  items: QROrderLine[]
  discount: number
}

const STORAGE_KEY = 'qr-demo-orders'
let inMemory: QROrderSession[] | null = null

function load(): QROrderSession[] {
  if (inMemory) return inMemory
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    inMemory = raw ? (JSON.parse(raw) as QROrderSession[]) : []
  } catch {
    inMemory = []
  }
  return inMemory
}

function save(list: QROrderSession[]) {
  inMemory = list
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* private mode — fall back to memory-only */
  }
}

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

/** Compute the standard billing breakdown for a QR order. */
export function computeTotals(
  items: QROrderLine[],
  discount = 0,
  taxRate = 0.05,
  serviceRate = 0.1,
): QROrderTotals {
  const subtotal = items.reduce((sum, i) => {
    const addon = i.selectedAddons.reduce((s, a) => s + a.price, 0)
    return sum + (i.unitPrice + addon) * i.quantity
  }, 0)
  const taxable = Math.max(0, subtotal - discount)
  const tax = taxable * taxRate
  const serviceCharge = taxable * serviceRate
  return {
    subtotal,
    discount,
    tax,
    serviceCharge,
    grandTotal: taxable + tax + serviceCharge,
  }
}

/** Place a mock order; returns the created session. */
export async function placeQROrder(input: PlaceOrderInput): Promise<QROrderSession> {
  const list = load()
  const seq = 1061 + list.length
  const totals = computeTotals(input.items, input.discount)
  const order: QROrderSession = {
    ...totals,
    id: `qr-${seq}`,
    displayNumber: String(seq),
    restaurantId: input.restaurantId,
    tableId: input.tableId,
    items: input.items,
    placedAt: new Date().toISOString(),
    status: 'received',
    paymentMethod: null,
    txnId: null,
    paidAt: null,
    feedback: null,
  }
  save([...list, order])
  return delay(order, 1200)
}

/** Fetch one order by internal id or display number. */
export async function getQROrder(orderId: string): Promise<QROrderSession | null> {
  const list = load()
  const found = list.find(o => o.id === orderId || o.displayNumber === orderId)
  return delay(found ?? null, 150)
}

/** Most recent order for a table (falls back to latest overall). */
export async function getActiveQROrder(
  restaurantId: string,
  tableId: string,
): Promise<QROrderSession | null> {
  const list = load()
  const forTable = list.filter(o => o.restaurantId === restaurantId && o.tableId === tableId)
  const found = forTable[forTable.length - 1] ?? list[list.length - 1] ?? null
  return delay(found, 150)
}

/**
 * Advance the mock kitchen status. Called on a timer by the status page to
 * simulate a live KOT pipeline; would be replaced by a websocket/polling API.
 */
export async function advanceQROrderStatus(orderId: string): Promise<QROrderSession | null> {
  const list = load()
  const idx = list.findIndex(o => o.id === orderId || o.displayNumber === orderId)
  if (idx === -1) return delay(null, 100)
  const order = list[idx]
  const next =
    order.status === 'received'
      ? 'preparing'
      : order.status === 'preparing'
        ? 'ready'
        : order.status === 'ready'
          ? 'served'
          : 'served'
  const updated = { ...order, status: next as QROrderSession['status'] }
  const copy = [...list]
  copy[idx] = updated
  save(copy)
  return delay(updated, 100)
}

/** Record a mock payment against an order. */
export async function recordQROrderPayment(
  orderId: string,
  method: string,
): Promise<QROrderSession | null> {
  const list = load()
  const idx = list.findIndex(o => o.id === orderId || o.displayNumber === orderId)
  if (idx === -1) return delay(null, 100)
  const updated: QROrderSession = {
    ...list[idx],
    paymentMethod: method,
    txnId: `TXN${Date.now().toString(36).toUpperCase()}`,
    paidAt: new Date().toISOString(),
    status: list[idx].status === 'served' ? 'served' : list[idx].status,
  }
  const copy = [...list]
  copy[idx] = updated
  save(copy)
  return delay(updated, 900)
}

/** Submit mock feedback for an order. */
export async function submitQROrderFeedback(
  orderId: string,
  food: number,
  service: number,
  comment: string,
): Promise<QROrderSession | null> {
  const list = load()
  const idx = list.findIndex(o => o.id === orderId || o.displayNumber === orderId)
  if (idx === -1) return delay(null, 100)
  const updated: QROrderSession = {
    ...list[idx],
    feedback: { food, service, comment },
  }
  const copy = [...list]
  copy[idx] = updated
  save(copy)
  return delay(updated, 800)
}

/** Seed a demo order so bill/payment work even before placing one. */
export function ensureDemoQROrder(
  restaurantId: string,
  tableId: string,
): QROrderSession {
  const list = load()
  const existing = list.find(o => o.restaurantId === restaurantId && o.tableId === tableId)
  if (existing) return existing
  const items: QROrderLine[] = [
    {
      menuItemId: 'mi-001',
      name: 'Paneer Butter Masala',
      quantity: 1,
      unitPrice: 320,
      selectedVariant: 'Full',
      selectedAddons: [{ name: 'Extra Butter', price: 30 }],
      specialInstructions: 'Less spicy',
    },
    {
      menuItemId: 'mi-010',
      name: 'Butter Naan',
      quantity: 4,
      unitPrice: 60,
      selectedAddons: [],
    },
    {
      menuItemId: 'mi-020',
      name: 'Masala Chai',
      quantity: 2,
      unitPrice: 40,
      selectedAddons: [],
    },
  ]
  const totals = computeTotals(items, 44)
  const order: QROrderSession = {
    ...totals,
    id: 'qr-1056',
    displayNumber: '1056',
    restaurantId,
    tableId,
    items,
    placedAt: new Date().toISOString(),
    status: 'served',
    paymentMethod: null,
    txnId: null,
    paidAt: null,
    feedback: null,
  }
  save([...list, order])
  return order
}
