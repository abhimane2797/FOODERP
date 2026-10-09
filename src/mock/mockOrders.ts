import type { Order } from '../types'

export const mockOrders: Order[] = [
  {
    id: 'ord-1056', orderNumber: '#1056', type: 'qr', tableId: 'tbl-12', tableName: 'Table 12',
    customerName: 'Walk-in', customerPhone: '', items: [
      { menuItemId: 'mi-001', name: 'Paneer Tikka', quantity: 2, unitPrice: 220, selectedAddons: [{ name: 'Extra Cheese', price: 30 }], foodType: 'veg' },
      { menuItemId: 'mi-013', name: 'Butter Naan', quantity: 1, unitPrice: 60, selectedAddons: [], foodType: 'veg' },
      { menuItemId: 'mi-042', name: 'Coke', quantity: 1, unitPrice: 80, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 610, discount: 0, tax: 30.5, serviceCharge: 0, grandTotal: 640.5,
    paymentMethod: 'upi', paymentStatus: 'pending', status: 'preparing', priority: 'normal',
    specialInstructions: 'Less spicy', createdAt: '2026-10-08T19:20:00', updatedAt: '2026-10-08T19:25:00',
    branchId: 'br-001',
  },
  {
    id: 'ord-1055', orderNumber: '#1055', type: 'dine-in', tableId: 'tbl-06', tableName: 'Table 06',
    customerName: 'Anita Deshpande', customerPhone: '+91 98220 11223', items: [
      { menuItemId: 'mi-011', name: 'Chicken Biryani', quantity: 3, unitPrice: 300, selectedAddons: [], foodType: 'non-veg' },
      { menuItemId: 'mi-010', name: 'Paneer Butter Masala', quantity: 1, unitPrice: 280, selectedAddons: [], foodType: 'veg' },
      { menuItemId: 'mi-040', name: 'Mango Lassi', quantity: 3, unitPrice: 120, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 1540, discount: 154, tax: 69.3, serviceCharge: 154, grandTotal: 1609.3,
    paymentMethod: 'card', paymentStatus: 'paid', status: 'served', priority: 'normal',
    createdAt: '2026-10-08T19:00:00', updatedAt: '2026-10-08T19:15:00', branchId: 'br-001', employeeId: 'emp-002',
  },
  {
    id: 'ord-1054', orderNumber: '#1054', type: 'dine-in', tableId: 'tbl-08', tableName: 'Table 08',
    customerName: 'Rahul Verma', customerPhone: '+91 99870 22334', items: [
      { menuItemId: 'mi-012', name: 'Butter Chicken', quantity: 1, unitPrice: 320, selectedAddons: [], foodType: 'non-veg' },
      { menuItemId: 'mi-013', name: 'Dal Makhani', quantity: 1, unitPrice: 220, selectedAddons: [], foodType: 'veg' },
      { menuItemId: 'mi-043', name: 'Cold Coffee', quantity: 2, unitPrice: 150, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 840, discount: 0, tax: 42, serviceCharge: 84, grandTotal: 966,
    paymentMethod: 'cash', paymentStatus: 'pending', status: 'preparing', priority: 'high',
    createdAt: '2026-10-08T19:10:00', updatedAt: '2026-10-08T19:12:00', branchId: 'br-001',
  },
  {
    id: 'ord-1053', orderNumber: '#1053', type: 'dine-in', tableId: 'tbl-06', tableName: 'Table 06',
    customerName: 'Priya Kulkarni', customerPhone: '+91 97654 33445', items: [
      { menuItemId: 'mi-020', name: 'Margherita Pizza', quantity: 2, unitPrice: 299, selectedAddons: [{ name: 'Extra Cheese', price: 30 }], foodType: 'veg' },
      { menuItemId: 'mi-030', name: 'Classic Cheese Burger', quantity: 2, unitPrice: 249, selectedAddons: [], foodType: 'non-veg' },
      { menuItemId: 'mi-051', name: 'Chocolate Brownie', quantity: 4, unitPrice: 180, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 2056, discount: 0, tax: 102.8, serviceCharge: 205.6, grandTotal: 2364.4,
    paymentMethod: 'upi', paymentStatus: 'paid', status: 'completed', priority: 'normal',
    createdAt: '2026-10-08T18:30:00', updatedAt: '2026-10-08T19:00:00', branchId: 'br-001', employeeId: 'emp-001',
  },
  {
    id: 'ord-1052', orderNumber: '#1052', type: 'takeaway', tableId: undefined, tableName: undefined,
    customerName: 'Sameer Joshi', customerPhone: '+91 98900 44556', items: [
      { menuItemId: 'mi-011', name: 'Chicken Biryani', quantity: 2, unitPrice: 300, selectedAddons: [], foodType: 'non-veg' },
      { menuItemId: 'mi-041', name: 'Masala Chai', quantity: 2, unitPrice: 60, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 720, discount: 0, tax: 36, serviceCharge: 0, grandTotal: 756,
    paymentMethod: 'cash', paymentStatus: 'paid', status: 'ready', priority: 'normal',
    createdAt: '2026-10-08T19:05:00', updatedAt: '2026-10-08T19:18:00', branchId: 'br-001',
  },
  {
    id: 'ord-1051', orderNumber: '#1051', type: 'dine-in', tableId: 'tbl-05', tableName: 'Table 05',
    customerName: 'Kavita Patil', customerPhone: '+91 91234 55667', items: [
      { menuItemId: 'mi-001', name: 'Paneer Tikka', quantity: 1, unitPrice: 220, selectedAddons: [], foodType: 'veg' },
      { menuItemId: 'mi-015', name: 'Palak Paneer', quantity: 1, unitPrice: 260, selectedAddons: [], foodType: 'veg' },
      { menuItemId: 'mi-050', name: 'Gulab Jamun', quantity: 2, unitPrice: 120, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 720, discount: 72, tax: 32.4, serviceCharge: 72, grandTotal: 752.4,
    paymentMethod: 'upi', paymentStatus: 'pending', status: 'served', priority: 'normal' as never,
    createdAt: '2026-10-08T18:00:00', updatedAt: '2026-10-08T19:20:00', branchId: 'br-001',
  },
  {
    id: 'ord-1050', orderNumber: '#1050', type: 'delivery', tableId: undefined, tableName: undefined,
    customerName: 'Amit Singh', customerPhone: '+91 90123 66778', items: [
      { menuItemId: 'mi-021', name: 'Pepperoni Pizza', quantity: 1, unitPrice: 399, selectedAddons: [], foodType: 'non-veg' },
      { menuItemId: 'mi-032', name: 'Crispy Chicken Burger', quantity: 1, unitPrice: 229, selectedAddons: [], foodType: 'non-veg' },
    ],
    subtotal: 628, discount: 0, tax: 31.4, serviceCharge: 0, grandTotal: 659.4,
    paymentMethod: 'online', paymentStatus: 'paid', status: 'completed', priority: 'normal',
    createdAt: '2026-10-08T17:45:00', updatedAt: '2026-10-08T18:15:00', branchId: 'br-001',
  },
  {
    id: 'ord-1049', orderNumber: '#1049', type: 'online', tableId: undefined, tableName: undefined,
    customerName: 'Neha Agarwal', customerPhone: '+91 93456 77889', items: [
      { menuItemId: 'mi-012', name: 'Butter Chicken', quantity: 2, unitPrice: 320, selectedAddons: [], foodType: 'non-veg' },
      { menuItemId: 'mi-013', name: 'Dal Makhani', quantity: 1, unitPrice: 220, selectedAddons: [], foodType: 'veg' },
      { menuItemId: 'mi-051', name: 'Chocolate Brownie', quantity: 2, unitPrice: 180, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 1400, discount: 140, tax: 63, serviceCharge: 0, grandTotal: 1323,
    paymentMethod: 'online', paymentStatus: 'paid', status: 'completed', priority: 'normal',
    createdAt: '2026-10-08T17:30:00', updatedAt: '2026-10-08T18:00:00', branchId: 'br-001',
  },
  {
    id: 'ord-1048', orderNumber: '#1048', type: 'qr', tableId: 'tbl-02', tableName: 'Table 02',
    customerName: 'Walk-in', items: [
      { menuItemId: 'mi-003', name: 'Veg Spring Rolls', quantity: 2, unitPrice: 160, selectedAddons: [], foodType: 'veg' },
      { menuItemId: 'mi-020', name: 'Margherita Pizza', quantity: 1, unitPrice: 299, selectedAddons: [], foodType: 'veg' },
      { menuItemId: 'mi-042', name: 'Fresh Lime Soda', quantity: 2, unitPrice: 90, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 828, discount: 0, tax: 41.4, serviceCharge: 82.8, grandTotal: 952.2,
    paymentMethod: 'upi', paymentStatus: 'paid', status: 'completed', priority: 'normal',
    createdAt: '2026-10-08T17:00:00', updatedAt: '2026-10-08T17:30:00', branchId: 'br-001',
  },
  {
    id: 'ord-1047', orderNumber: '#1047', type: 'dine-in', tableId: 'tbl-03', tableName: 'Table 03',
    customerName: 'Vikram Rao', customerPhone: '+91 95678 88990', items: [
      { menuItemId: 'mi-014', name: 'Fish Curry', quantity: 2, unitPrice: 340, selectedAddons: [], foodType: 'non-veg' },
      { menuItemId: 'mi-013', name: 'Dal Makhani', quantity: 1, unitPrice: 220, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 900, discount: 0, tax: 45, serviceCharge: 90, grandTotal: 1035,
    paymentMethod: 'cash', paymentStatus: 'refunded', status: 'cancelled', priority: 'normal',
    createdAt: '2026-10-08T16:45:00', updatedAt: '2026-10-08T17:00:00', branchId: 'br-001',
  },
  {
    id: 'ord-1046', orderNumber: '#1046', type: 'takeaway', tableId: undefined, tableName: undefined,
    customerName: 'Deepa Nair', customerPhone: '+91 97890 99001', items: [
      { menuItemId: 'mi-010', name: 'Paneer Butter Masala', quantity: 1, unitPrice: 280, selectedAddons: [], foodType: 'veg' },
      { menuItemId: 'mi-041', name: 'Masala Chai', quantity: 2, unitPrice: 60, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 400, discount: 0, tax: 20, serviceCharge: 0, grandTotal: 420,
    paymentMethod: 'upi', paymentStatus: 'paid', status: 'completed', priority: 'normal',
    createdAt: '2026-10-08T16:30:00', updatedAt: '2026-10-08T16:45:00', branchId: 'br-001',
  },
  {
    id: 'ord-1045', orderNumber: '#1045', type: 'qr', tableId: 'tbl-11', tableName: 'Table 11',
    customerName: 'Walk-in', items: [
      { menuItemId: 'mi-031', name: 'Veggie Burger', quantity: 2, unitPrice: 199, selectedAddons: [{ name: 'Extra Cheese', price: 30 }], foodType: 'veg' },
      { menuItemId: 'mi-043', name: 'Cold Coffee', quantity: 2, unitPrice: 150, selectedAddons: [], foodType: 'veg' },
    ],
    subtotal: 728, discount: 0, tax: 36.4, serviceCharge: 72.8, grandTotal: 837.2,
    paymentMethod: 'upi', paymentStatus: 'paid', status: 'completed', priority: 'normal',
    createdAt: '2026-10-08T16:00:00', updatedAt: '2026-10-08T16:25:00', branchId: 'br-001',
  },
]

// Dashboard sales data
export const mockSalesToday = [
  { label: '9 AM', sales: 4200, orders: 12 },
  { label: '10 AM', sales: 6800, orders: 18 },
  { label: '11 AM', sales: 9200, orders: 26 },
  { label: '12 PM', sales: 15400, orders: 42 },
  { label: '1 PM', sales: 22100, orders: 58 },
  { label: '2 PM', sales: 18600, orders: 48 },
  { label: '3 PM', sales: 8200, orders: 22 },
  { label: '4 PM', sales: 5400, orders: 14 },
  { label: '5 PM', sales: 7800, orders: 20 },
  { label: '6 PM', sales: 12400, orders: 32 },
  { label: '7 PM', sales: 19800, orders: 52 },
  { label: '8 PM', sales: 24900, orders: 64 },
]

export const mockSales7Days = [
  { label: 'Thu', sales: 98400, orders: 280 },
  { label: 'Fri', sales: 124500, orders: 342 },
  { label: 'Sat', sales: 156800, orders: 428 },
  { label: 'Sun', sales: 168200, orders: 460 },
  { label: 'Mon', sales: 89600, orders: 248 },
  { label: 'Tue', sales: 95200, orders: 262 },
  { label: 'Wed', sales: 124850, orders: 342 },
]

export const mockSales30Days = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  sales: Math.floor(80000 + Math.random() * 90000),
  orders: Math.floor(220 + Math.random() * 240),
}))

export const mockOrderOverview = { dineIn: 186, takeaway: 72, delivery: 54, qr: 30 }
export const mockPaymentSummary = { cash: 32400, upi: 58200, card: 24800, online: 9450 }
