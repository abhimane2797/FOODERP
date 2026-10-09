// ─── Core Enums / Unions ───────────────────────────────────────────
export type FoodType = 'veg' | 'non-veg' | 'egg'
export type OrderType = 'dine-in' | 'takeaway' | 'delivery' | 'qr' | 'online'
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'online'
export type PaymentStatus = 'paid' | 'pending' | 'partial' | 'refunded'
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'billing'
export type KOTStatus = 'new' | 'preparing' | 'ready' | 'served'
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'
export type CustomerStatus = 'active' | 'inactive' | 'vip'
export type EmployeeStatus = 'active' | 'inactive' | 'on-leave'
export type SupplierStatus = 'active' | 'inactive'
export type Priority = 'low' | 'normal' | 'high' | 'urgent'
export type ReportType =
  | 'sales' | 'order' | 'item' | 'category'
  | 'payment' | 'tax' | 'inventory' | 'expense' | 'employee'
export type SettingsSection =
  | 'restaurant' | 'branch' | 'tax' | 'invoice' | 'printer'
  | 'payment' | 'users' | 'notifications' | 'qr'

// ─── Restaurant / Branch ───────────────────────────────────────────
export interface Restaurant {
  id: string
  name: string
  logo: string
  tagline: string
  currency: string
  timezone: string
}

export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  isActive: boolean
}

// ─── Menu ──────────────────────────────────────────────────────────
export interface MenuCategory {
  id: string
  name: string
  description?: string
  isActive: boolean
  sortOrder: number
}

export interface MenuAddon {
  id: string
  name: string
  price: number
  isAvailable: boolean
}

export interface MenuVariant {
  id: string
  name: string
  priceModifier: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  categoryId: string
  price: number
  taxPercent: number
  sku: string
  foodType: FoodType
  prepTimeMinutes: number
  imageUrl: string
  isAvailable: boolean
  isBestSeller?: boolean
  rating: number
  variants: MenuVariant[]
  addons: MenuAddon[]
}

// ─── Tables ────────────────────────────────────────────────────────
export interface RestaurantTable {
  id: string
  name: string
  seats: number
  floor: string
  status: TableStatus
  currentOrderId?: string
  currentBill?: number
  reservedFor?: string
  reservedAt?: string
  qrActive: boolean
}

// ─── Orders ────────────────────────────────────────────────────────
export interface OrderLineItem {
  menuItemId: string
  name: string
  quantity: number
  unitPrice: number
  selectedVariant?: string
  selectedAddons: { name: string; price: number }[]
  specialInstructions?: string
  foodType: FoodType
}

export interface Order {
  id: string
  orderNumber: string
  type: OrderType
  tableId?: string
  tableName?: string
  customerName: string
  customerPhone?: string
  items: OrderLineItem[]
  subtotal: number
  discount: number
  tax: number
  serviceCharge: number
  grandTotal: number
  paymentMethod?: PaymentMethod
  paymentStatus: PaymentStatus
  status: OrderStatus
  priority: Priority
  specialInstructions?: string
  createdAt: string
  updatedAt: string
  estimatedReadyAt?: string
  branchId: string
  employeeId?: string
}

export interface KOTTicket {
  id: string
  orderId: string
  orderNumber: string
  tableName: string
  items: { name: string; quantity: number; specialInstructions?: string; foodType: FoodType }[]
  status: KOTStatus
  priority: Priority
  createdAt: string
  elapsedMinutes: number
}

// ─── Customers ─────────────────────────────────────────────────────
export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string
  status: CustomerStatus
  favoriteItems: string[]
  orderHistory: { orderId: string; date: string; amount: number; items: string }[]
  loyaltyPoints: number
}

// ─── Employees ─────────────────────────────────────────────────────
export interface Employee {
  id: string
  name: string
  role: string
  phone: string
  email: string
  branchId: string
  branchName: string
  shift: string
  attendanceToday: 'present' | 'absent' | 'late' | 'leave'
  status: EmployeeStatus
  joiningDate: string
  salary: number
  performanceRating: number
  leavesTaken: number
  leavesRemaining: number
}

// ─── Inventory ─────────────────────────────────────────────────────
export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  unit: string
  minStock: number
  costPerUnit: number
  status: StockStatus
  lastRestocked: string
  supplier?: string
}

export interface StockAdjustment {
  id: string
  itemId: string
  itemName: string
  adjustment: number
  type: 'add' | 'remove' | 'set'
  reason: string
  performedBy: string
  date: string
}

// ─── Purchases ─────────────────────────────────────────────────────
export interface Supplier {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  itemsSupplied: string[]
  outstandingAmount: number
  totalOrders: number
  status: SupplierStatus
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  supplierName: string
  date: string
  expectedDate: string
  items: { name: string; quantity: number; unit: string; rate: number; taxPercent: number }[]
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'received' | 'cancelled'
}

export interface PurchaseInvoice {
  id: string
  invoiceNumber: string
  poNumber: string
  supplierName: string
  date: string
  dueDate: string
  amount: number
  paidAmount: number
  status: 'paid' | 'partial' | 'unpaid'
}

// ─── Expenses ──────────────────────────────────────────────────────
export interface Expense {
  id: string
  date: string
  category: string
  description: string
  amount: number
  paymentMethod: PaymentMethod
  addedBy: string
  status: 'approved' | 'pending' | 'rejected'
}

// ─── Notifications ─────────────────────────────────────────────────
export interface AppNotification {
  id: string
  type: 'order' | 'stock' | 'payment' | 'request' | 'system'
  title: string
  message: string
  time: string
  isRead: boolean
}

// ─── Dashboard ─────────────────────────────────────────────────────
export interface DashboardStats {
  todaySales: number
  orders: number
  averageOrderValue: number
  pendingOrders: number
  salesChange: number
  ordersChange: number
  aovChange: number
  pendingChange: number
}

export interface SalesDataPoint {
  label: string
  sales: number
  orders: number
}

export interface OrderOverview {
  dineIn: number
  takeaway: number
  delivery: number
  qr: number
}

export interface PaymentSummary {
  cash: number
  upi: number
  card: number
  online: number
}

export interface BestSellerItem {
  id: string
  name: string
  orders: number
  revenue: number
  imageUrl: string
}

// ─── Reports ───────────────────────────────────────────────────────
export interface ReportSummary {
  label: string
  value: string
  change?: number
}

// ─── Service Request (QR customer) ─────────────────────────────────
export interface ServiceRequest {
  id: string
  tableId: string
  type: 'call-waiter' | 'request-water' | 'request-bill' | 'request-service'
  message: string
  createdAt: string
}

// ─── Feedback ──────────────────────────────────────────────────────
export interface Feedback {
  orderId: string
  foodRating: number
  serviceRating: number
  comment: string
}

// ─── Settings ──────────────────────────────────────────────────────
export interface TaxSetting {
  id: string
  name: string
  rate: number
  isActive: boolean
}

export interface UserRole {
  id: string
  name: string
  permissions: string[]
}
