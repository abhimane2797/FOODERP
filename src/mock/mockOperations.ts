import type { Employee, InventoryItem, StockAdjustment, Expense, Supplier, PurchaseOrder, PurchaseInvoice, AppNotification } from '../types'

export const mockEmployees: Employee[] = [
  { id: 'emp-001', name: 'Rajesh Kumar', role: 'Manager', phone: '+91 90000 11111', email: 'rajesh@spicegarden.in', branchId: 'br-001', branchName: 'Main Branch', shift: 'Morning (9 AM – 5 PM)', attendanceToday: 'present', status: 'active', joiningDate: '2023-01-15', salary: 45000, performanceRating: 4.8, leavesTaken: 8, leavesRemaining: 14 },
  { id: 'emp-002', name: 'Sunita Devi', role: 'Cashier', phone: '+91 90000 22222', email: 'sunita@spicegarden.in', branchId: 'br-001', branchName: 'Main Branch', shift: 'Evening (2 PM – 10 PM)', attendanceToday: 'present', status: 'active', joiningDate: '2023-06-20', salary: 28000, performanceRating: 4.5, leavesTaken: 5, leavesRemaining: 17 },
  { id: 'emp-003', name: 'Mohammed Irfan', role: 'Head Chef', phone: '+91 90000 33333', email: 'irfan@spicegarden.in', branchId: 'br-001', branchName: 'Main Branch', shift: 'Morning (10 AM – 6 PM)', attendanceToday: 'present', status: 'active', joiningDate: '2022-03-10', salary: 65000, performanceRating: 4.9, leavesTaken: 10, leavesRemaining: 12 },
  { id: 'emp-004', name: 'Priya Sharma', role: 'Waiter', phone: '+91 90000 44444', email: 'priya.s@spicegarden.in', branchId: 'br-001', branchName: 'Main Branch', shift: 'Evening (4 PM – 12 AM)', attendanceToday: 'late', status: 'active', joiningDate: '2024-02-01', salary: 22000, performanceRating: 4.2, leavesTaken: 12, leavesRemaining: 10 },
  { id: 'emp-005', name: 'Amit Patel', role: 'Waiter', phone: '+91 90000 55555', email: 'amit.p@spicegarden.in', branchId: 'br-002', branchName: 'Koregaon Park', shift: 'Morning (9 AM – 5 PM)', attendanceToday: 'present', status: 'active', joiningDate: '2024-05-15', salary: 22000, performanceRating: 4.0, leavesTaken: 6, leavesRemaining: 16 },
  { id: 'emp-006', name: 'Sneha Gupta', role: 'Cashier', phone: '+91 90000 66666', email: 'sneha@spicegarden.in', branchId: 'br-002', branchName: 'Koregaon Park', shift: 'Morning (9 AM – 5 PM)', attendanceToday: 'leave', status: 'on-leave', joiningDate: '2023-11-01', salary: 28000, performanceRating: 4.6, leavesTaken: 14, leavesRemaining: 8 },
  { id: 'emp-007', name: 'Vijay Singh', role: 'Kitchen Staff', phone: '+91 90000 77777', email: 'vijay@spicegarden.in', branchId: 'br-001', branchName: 'Main Branch', shift: 'Morning (10 AM – 6 PM)', attendanceToday: 'present', status: 'active', joiningDate: '2024-08-10', salary: 25000, performanceRating: 4.3, leavesTaken: 4, leavesRemaining: 18 },
  { id: 'emp-008', name: 'Ravi Kumar', role: 'Delivery', phone: '+91 90000 88888', email: 'ravi@spicegarden.in', branchId: 'br-001', branchName: 'Main Branch', shift: 'Evening (2 PM – 10 PM)', attendanceToday: 'absent', status: 'active', joiningDate: '2024-10-05', salary: 20000, performanceRating: 3.9, leavesTaken: 9, leavesRemaining: 13 },
]

export const mockInventory: InventoryItem[] = [
  { id: 'inv-001', name: 'Paneer', sku: 'ING-001', category: 'Dairy', currentStock: 12, unit: 'kg', minStock: 15, costPerUnit: 320, status: 'low-stock', lastRestocked: '2026-10-05', supplier: 'Dairy Fresh' },
  { id: 'inv-002', name: 'Chicken (Boneless)', sku: 'ING-002', category: 'Meat', currentStock: 25, unit: 'kg', minStock: 10, costPerUnit: 280, status: 'in-stock', lastRestocked: '2026-10-07', supplier: 'Meat King' },
  { id: 'inv-003', name: 'Basmati Rice', sku: 'ING-003', category: 'Grains', currentStock: 50, unit: 'kg', minStock: 20, costPerUnit: 120, status: 'in-stock', lastRestocked: '2026-10-01', supplier: 'Grain Mart' },
  { id: 'inv-004', name: 'Tomatoes', sku: 'ING-004', category: 'Vegetables', currentStock: 0, unit: 'kg', minStock: 10, costPerUnit: 40, status: 'out-of-stock', lastRestocked: '2026-10-03', supplier: 'Fresh Greens' },
  { id: 'inv-005', name: 'Onions', sku: 'ING-005', category: 'Vegetables', currentStock: 30, unit: 'kg', minStock: 15, costPerUnit: 35, status: 'in-stock', lastRestocked: '2026-10-06', supplier: 'Fresh Greens' },
  { id: 'inv-006', name: 'Cooking Oil', sku: 'ING-006', category: 'Oil & Ghee', currentStock: 8, unit: 'L', minStock: 10, costPerUnit: 150, status: 'low-stock', lastRestocked: '2026-10-02', supplier: 'Oil Express' },
  { id: 'inv-007', name: 'Butter', sku: 'ING-007', category: 'Dairy', currentStock: 15, unit: 'kg', minStock: 5, costPerUnit: 500, status: 'in-stock', lastRestocked: '2026-10-07', supplier: 'Dairy Fresh' },
  { id: 'inv-008', name: 'Mozzarella Cheese', sku: 'ING-008', category: 'Dairy', currentStock: 3, unit: 'kg', minStock: 5, costPerUnit: 600, status: 'low-stock', lastRestocked: '2026-10-04', supplier: 'Dairy Fresh' },
  { id: 'inv-009', name: 'Capsicum', sku: 'ING-009', category: 'Vegetables', currentStock: 18, unit: 'kg', minStock: 5, costPerUnit: 60, status: 'in-stock', lastRestocked: '2026-10-07', supplier: 'Fresh Greens' },
  { id: 'inv-010', name: 'Garam Masala', sku: 'ING-010', category: 'Spices', currentStock: 2, unit: 'kg', minStock: 3, costPerUnit: 800, status: 'low-stock', lastRestocked: '2026-09-28', supplier: 'Spice World' },
  { id: 'inv-011', name: 'Wheat Flour', sku: 'ING-011', category: 'Grains', currentStock: 40, unit: 'kg', minStock: 20, costPerUnit: 45, status: 'in-stock', lastRestocked: '2026-10-05', supplier: 'Grain Mart' },
  { id: 'inv-012', name: 'Soft Drink Cans', sku: 'ING-012', category: 'Beverages', currentStock: 0, unit: 'pcs', minStock: 24, costPerUnit: 40, status: 'out-of-stock', lastRestocked: '2026-09-30', supplier: 'Beverage Co' },
]

export const mockStockAdjustments: StockAdjustment[] = [
  { id: 'adj-001', itemId: 'inv-001', itemName: 'Paneer', adjustment: -5, type: 'remove', reason: 'Daily usage', performedBy: 'Mohammed Irfan', date: '2026-10-08' },
  { id: 'adj-002', itemId: 'inv-002', itemName: 'Chicken (Boneless)', adjustment: 20, type: 'add', reason: 'New delivery', performedBy: 'Rajesh Kumar', date: '2026-10-07' },
  { id: 'adj-003', itemId: 'inv-004', itemName: 'Tomatoes', adjustment: 0, type: 'set', reason: 'Stock count correction', performedBy: 'Vijay Singh', date: '2026-10-06' },
]

export const mockExpenses: Expense[] = [
  { id: 'exp-001', date: '2026-10-08', category: 'Electricity', description: 'October electricity bill', amount: 12500, paymentMethod: 'upi', addedBy: 'Rajesh Kumar', status: 'approved' },
  { id: 'exp-002', date: '2026-10-08', category: 'Transport', description: 'Delivery fuel reimbursement', amount: 2400, paymentMethod: 'cash', addedBy: 'Rajesh Kumar', status: 'approved' },
  { id: 'exp-003', date: '2026-10-07', category: 'Maintenance', description: 'AC repair - Floor 2', amount: 8500, paymentMethod: 'upi', addedBy: 'Sunita Devi', status: 'pending' },
  { id: 'exp-004', date: '2026-10-07', category: 'Gas', description: 'LPG cylinder refill ×3', amount: 5400, paymentMethod: 'cash', addedBy: 'Mohammed Irfan', status: 'approved' },
  { id: 'exp-005', date: '2026-10-06', category: 'Rent', description: 'Monthly rent - Main Branch', amount: 85000, paymentMethod: 'online', addedBy: 'Rajesh Kumar', status: 'approved' },
  { id: 'exp-006', date: '2026-10-05', category: 'Salary', description: 'Weekly advance - Staff', amount: 15000, paymentMethod: 'cash', addedBy: 'Rajesh Kumar', status: 'approved' },
  { id: 'exp-007', date: '2026-10-05', category: 'Other', description: 'Marketing - Social media ads', amount: 6000, paymentMethod: 'card', addedBy: 'Sunita Devi', status: 'pending' },
  { id: 'exp-008', date: '2026-10-04', category: 'Maintenance', description: 'Kitchen equipment servicing', amount: 4500, paymentMethod: 'upi', addedBy: 'Rajesh Kumar', status: 'approved' },
  { id: 'exp-009', date: '2026-10-03', category: 'Transport', description: 'Supply van rental', amount: 3500, paymentMethod: 'cash', addedBy: 'Rajesh Kumar', status: 'approved' },
  { id: 'exp-010', date: '2026-10-01', category: 'Electricity', description: 'Koregaon Park branch bill', amount: 9800, paymentMethod: 'upi', addedBy: 'Rajesh Kumar', status: 'rejected' },
]

export const mockSuppliers: Supplier[] = [
  { id: 'sup-001', name: 'Dairy Fresh Co.', contactPerson: 'Mahesh Patil', phone: '+91 98230 11111', email: 'orders@dairyfresh.in', address: 'Hadapsar, Pune', itemsSupplied: ['Paneer', 'Butter', 'Mozzarella Cheese', 'Milk'], outstandingAmount: 12400, totalOrders: 48, status: 'active' },
  { id: 'sup-002', name: 'Meat King Supplies', contactPerson: 'Imran Sheikh', phone: '+91 98230 22222', email: 'sales@meatking.in', address: 'Katraj, Pune', itemsSupplied: ['Chicken (Boneless)', 'Chicken (Bone-in)', 'Mutton'], outstandingAmount: 8200, totalOrders: 36, status: 'active' },
  { id: 'sup-003', name: 'Fresh Greens Vendor', contactPerson: 'Suresh Gaikwad', phone: '+91 98230 33333', email: 'fresh@greens.co.in', address: 'Market Yard, Pune', itemsSupplied: ['Tomatoes', 'Onions', 'Capsicum', 'Spinach'], outstandingAmount: 0, totalOrders: 120, status: 'active' },
  { id: 'sup-004', name: 'Grain Mart', contactPerson: 'Anjali Desai', phone: '+91 98230 44444', email: 'bulk@grainmart.in', address: 'Shivaji Nagar, Pune', itemsSupplied: ['Basmati Rice', 'Wheat Flour', 'Lentils'], outstandingAmount: 4500, totalOrders: 24, status: 'active' },
  { id: 'sup-005', name: 'Spice World', contactPerson: 'Ramesh Chavan', phone: '+91 98230 55555', email: 'spices@world.in', address: 'Laxmi Road, Pune', itemsSupplied: ['Garam Masala', 'Turmeric', 'Red Chili Powder'], outstandingAmount: 2100, totalOrders: 18, status: 'active' },
  { id: 'sup-006', name: 'Beverage Hub', contactPerson: 'Kiran More', phone: '+91 98230 66666', email: 'orders@beveragehub.in', address: 'Chinchwad, Pune', itemsSupplied: ['Soft Drink Cans', 'Juices', 'Mineral Water'], outstandingAmount: 0, totalOrders: 30, status: 'inactive' },
]

export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: 'po-001', poNumber: 'PO-2026-045', supplierId: 'sup-001', supplierName: 'Dairy Fresh Co.', date: '2026-10-07', expectedDate: '2026-10-09', items: [{ name: 'Paneer', quantity: 20, unit: 'kg', rate: 320, taxPercent: 5 }, { name: 'Butter', quantity: 10, unit: 'kg', rate: 500, taxPercent: 5 }], subtotal: 11400, tax: 570, total: 11970, status: 'sent' },
  { id: 'po-002', poNumber: 'PO-2026-044', supplierId: 'sup-002', supplierName: 'Meat King Supplies', date: '2026-10-06', expectedDate: '2026-10-08', items: [{ name: 'Chicken (Boneless)', quantity: 30, unit: 'kg', rate: 280, taxPercent: 5 }], subtotal: 8400, tax: 420, total: 8820, status: 'received' },
  { id: 'po-003', poNumber: 'PO-2026-043', supplierId: 'sup-003', supplierName: 'Fresh Greens Vendor', date: '2026-10-05', expectedDate: '2026-10-06', items: [{ name: 'Tomatoes', quantity: 25, unit: 'kg', rate: 40, taxPercent: 0 }, { name: 'Onions', quantity: 30, unit: 'kg', rate: 35, taxPercent: 0 }], subtotal: 2050, tax: 0, total: 2050, status: 'received' },
  { id: 'po-004', poNumber: 'PO-2026-042', supplierId: 'sup-004', supplierName: 'Grain Mart', date: '2026-10-03', expectedDate: '2026-10-10', items: [{ name: 'Basmati Rice', quantity: 50, unit: 'kg', rate: 120, taxPercent: 5 }, { name: 'Wheat Flour', quantity: 40, unit: 'kg', rate: 45, taxPercent: 5 }], subtotal: 7800, tax: 390, total: 8190, status: 'draft' },
  { id: 'po-005', poNumber: 'PO-2026-041', supplierId: 'sup-005', supplierName: 'Spice World', date: '2026-10-01', expectedDate: '2026-10-04', items: [{ name: 'Garam Masala', quantity: 5, unit: 'kg', rate: 800, taxPercent: 5 }], subtotal: 4000, tax: 200, total: 4200, status: 'cancelled' },
]

export const mockPurchaseInvoices: PurchaseInvoice[] = [
  { id: 'pin-001', invoiceNumber: 'INV-DF-892', poNumber: 'PO-2026-044', supplierName: 'Meat King Supplies', date: '2026-10-06', dueDate: '2026-10-16', amount: 8820, paidAmount: 8820, status: 'paid' },
  { id: 'pin-002', invoiceNumber: 'INV-FG-441', poNumber: 'PO-2026-043', supplierName: 'Fresh Greens Vendor', date: '2026-10-05', dueDate: '2026-10-15', amount: 2050, paidAmount: 0, status: 'unpaid' },
  { id: 'pin-003', invoiceNumber: 'INV-DF-891', poNumber: 'PO-2026-040', supplierName: 'Dairy Fresh Co.', date: '2026-10-02', dueDate: '2026-10-12', amount: 12400, paidAmount: 6000, status: 'partial' },
  { id: 'pin-004', invoiceNumber: 'INV-GM-228', poNumber: 'PO-2026-039', supplierName: 'Grain Mart', date: '2026-09-28', dueDate: '2026-10-08', amount: 4500, paidAmount: 0, status: 'unpaid' },
  { id: 'pin-005', invoiceNumber: 'INV-SW-105', poNumber: 'PO-2026-038', supplierName: 'Spice World', date: '2026-09-25', dueDate: '2026-10-05', amount: 2100, paidAmount: 2100, status: 'paid' },
]

export const mockNotifications: AppNotification[] = [
  { id: 'n-001', type: 'order', title: 'New QR Order', message: 'Table 12 placed an order (#1056)', time: '2 min ago', isRead: false },
  { id: 'n-002', type: 'stock', title: 'Low Stock Alert', message: 'Paneer is below minimum stock level', time: '15 min ago', isRead: false },
  { id: 'n-003', type: 'payment', title: 'Payment Received', message: '₹1,609.30 received for Order #1055', time: '25 min ago', isRead: false },
  { id: 'n-004', type: 'request', title: 'Customer Request', message: 'Table 8 requested a waiter', time: '32 min ago', isRead: true },
  { id: 'n-005', type: 'stock', title: 'Out of Stock', message: 'Tomatoes are out of stock', time: '1 hr ago', isRead: true },
  { id: 'n-006', type: 'system', title: 'Shift Change', message: 'Evening shift starts at 2:00 PM', time: '2 hr ago', isRead: true },
]
