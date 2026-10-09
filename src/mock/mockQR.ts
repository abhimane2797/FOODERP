/**
 * Mock registry backing the QR flow.
 *
 * In a real deployment these would come from the API; the shape is kept
 * deliberately flat so a service can replace `getQRRestaurant()` /
 * `getQRTable()` without touching any customer-facing UI.
 */

export interface QRRestaurant {
  id: string
  name: string
  tagline: string
  logoText: string
  currency: string
}

export interface QRTable {
  id: string
  /** Human label, e.g. "Table 12" */
  label: string
  seats: number
  floor: string
  restaurantId: string
  /** Whether QR ordering is enabled for this table. */
  qrActive: boolean
}

const restaurants: Record<string, QRRestaurant> = {
  'demo-restaurant': {
    id: 'demo-restaurant',
    name: 'Demo Restaurant',
    tagline: 'Fresh food, served fast',
    logoText: 'DR',
    currency: '₹',
  },
  'rest-001': {
    id: 'rest-001',
    name: 'Spice Garden',
    tagline: 'Fine Dining & Multi-Cuisine',
    logoText: 'SG',
    currency: '₹',
  },
}

const tables: Record<string, QRTable> = {}
for (const rid of Object.keys(restaurants)) {
  for (let n = 1; n <= 20; n++) {
    const id = `table-${n}`
    tables[`${rid}/${id}`] = {
      id,
      label: `Table ${n}`,
      seats: n % 3 === 0 ? 6 : n % 2 === 0 ? 4 : 4,
      floor: n <= 8 ? 'Floor 1' : n <= 14 ? 'Floor 2' : 'Outdoor',
      restaurantId: rid,
      qrActive: n !== 14,
    }
  }
  // Also accept the admin-side `tbl-XX` style ids so links keep working.
  for (let n = 1; n <= 14; n++) {
    const id = `tbl-${String(n).padStart(2, '0')}`
    tables[`${rid}/${id}`] = {
      id,
      label: `Table ${n}`,
      seats: 4,
      floor: n <= 6 ? 'Floor 1' : n <= 10 ? 'Floor 2' : 'Outdoor',
      restaurantId: rid,
      qrActive: n !== 9 && n !== 14,
    }
  }
}

export function getQRRestaurant(restaurantId: string): QRRestaurant {
  return (
    restaurants[restaurantId] ?? {
      id: restaurantId,
      name: 'Demo Restaurant',
      tagline: 'Fresh food, served fast',
      logoText: 'DR',
      currency: '₹',
    }
  )
}

export function getQRTable(restaurantId: string, tableId: string): QRTable {
  const key = `${restaurantId}/${tableId}`
  const found = tables[key]
  if (found) return found
  return {
    id: tableId,
    label: tableId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    seats: 4,
    floor: 'Floor 1',
    restaurantId,
    qrActive: true,
  }
}

/** All tables (for the admin QR management page). */
export function getAllQRTables(): QRTable[] {
  return Object.values(tables).filter(t => t.restaurantId === 'demo-restaurant')
}

/** Just the restaurants (for admin selectors). */
export function getAllQRRestaurants(): QRRestaurant[] {
  return Object.values(restaurants)
}
