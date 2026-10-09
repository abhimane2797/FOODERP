import type { Customer } from '../types'

export const mockCustomers: Customer[] = [
  {
    id: 'cus-001', name: 'Anita Deshpande', phone: '+91 98220 11223', email: 'anita@email.com',
    totalOrders: 48, totalSpent: 42500, averageOrderValue: 885, lastOrderDate: '2026-10-08',
    status: 'vip', favoriteItems: ['Chicken Biryani', 'Paneer Butter Masala', 'Mango Lassi'],
    orderHistory: [
      { orderId: 'ord-1055', date: '2026-10-08', amount: 1609, items: 'Chicken Biryani ×3, Paneer Butter Masala, Mango Lassi ×3' },
      { orderId: 'ord-1040', date: '2026-10-01', amount: 920, items: 'Butter Chicken, Dal Makhani, Cold Coffee ×2' },
      { orderId: 'ord-1020', date: '2026-09-22', amount: 1340, items: 'Chicken Biryani ×2, Gulab Jamun ×2' },
    ],
    loyaltyPoints: 425,
  },
  {
    id: 'cus-002', name: 'Rahul Verma', phone: '+91 99870 22334', email: 'rahul.v@email.com',
    totalOrders: 32, totalSpent: 28400, averageOrderValue: 888, lastOrderDate: '2026-10-08',
    status: 'active', favoriteItems: ['Butter Chicken', 'Cold Coffee'],
    orderHistory: [
      { orderId: 'ord-1054', date: '2026-10-08', amount: 966, items: 'Butter Chicken, Dal Makhani, Cold Coffee ×2' },
      { orderId: 'ord-1030', date: '2026-09-28', amount: 780, items: 'Chicken Tikka, Masala Chai ×2' },
    ],
    loyaltyPoints: 284,
  },
  {
    id: 'cus-003', name: 'Priya Kulkarni', phone: '+91 97654 33445', email: 'priya.k@email.com',
    totalOrders: 26, totalSpent: 22100, averageOrderValue: 850, lastOrderDate: '2026-10-08',
    status: 'active', favoriteItems: ['Margherita Pizza', 'Chocolate Brownie'],
    orderHistory: [
      { orderId: 'ord-1053', date: '2026-10-08', amount: 2364, items: 'Margherita Pizza ×2, Classic Cheese Burger ×2, Chocolate Brownie ×4' },
    ],
    loyaltyPoints: 221,
  },
  {
    id: 'cus-004', name: 'Sameer Joshi', phone: '+91 98900 44556',
    totalOrders: 18, totalSpent: 14600, averageOrderValue: 811, lastOrderDate: '2026-10-08',
    status: 'active', favoriteItems: ['Chicken Biryani', 'Masala Chai'],
    orderHistory: [
      { orderId: 'ord-1052', date: '2026-10-08', amount: 756, items: 'Chicken Biryani ×2, Masala Chai ×2' },
    ],
    loyaltyPoints: 146,
  },
  {
    id: 'cus-005', name: 'Kavita Patil', phone: '+91 91234 55667', email: 'kavita.p@email.com',
    totalOrders: 15, totalSpent: 12800, averageOrderValue: 853, lastOrderDate: '2026-10-08',
    status: 'active', favoriteItems: ['Palak Paneer', 'Gulab Jamun'],
    orderHistory: [
      { orderId: 'ord-1051', date: '2026-10-08', amount: 752, items: 'Paneer Tikka, Palak Paneer, Gulab Jamun ×2' },
    ],
    loyaltyPoints: 128,
  },
  {
    id: 'cus-006', name: 'Amit Singh', phone: '+91 90123 66778',
    totalOrders: 12, totalSpent: 9400, averageOrderValue: 783, lastOrderDate: '2026-10-08',
    status: 'active', favoriteItems: ['Pepperoni Pizza', 'Crispy Chicken Burger'],
    orderHistory: [
      { orderId: 'ord-1050', date: '2026-10-08', amount: 659, items: 'Pepperoni Pizza, Crispy Chicken Burger' },
    ],
    loyaltyPoints: 94,
  },
  {
    id: 'cus-007', name: 'Neha Agarwal', phone: '+91 93456 77889', email: 'neha.a@email.com',
    totalOrders: 8, totalSpent: 7200, averageOrderValue: 900, lastOrderDate: '2026-10-08',
    status: 'active', favoriteItems: ['Butter Chicken', 'Chocolate Brownie'],
    orderHistory: [
      { orderId: 'ord-1049', date: '2026-10-08', amount: 1323, items: 'Butter Chicken ×2, Dal Makhani, Chocolate Brownie ×2' },
    ],
    loyaltyPoints: 72,
  },
  {
    id: 'cus-008', name: 'Vikram Rao', phone: '+91 95678 88990',
    totalOrders: 5, totalSpent: 4800, averageOrderValue: 960, lastOrderDate: '2026-10-08',
    status: 'inactive', favoriteItems: ['Fish Curry'],
    orderHistory: [
      { orderId: 'ord-1047', date: '2026-10-08', amount: 1035, items: 'Fish Curry ×2, Dal Makhani' },
    ],
    loyaltyPoints: 48,
  },
  {
    id: 'cus-009', name: 'Deepa Nair', phone: '+91 97890 99001', email: 'deepa.n@email.com',
    totalOrders: 22, totalSpent: 18900, averageOrderValue: 859, lastOrderDate: '2026-10-08',
    status: 'vip', favoriteItems: ['Paneer Butter Masala', 'Rasmalai'],
    orderHistory: [
      { orderId: 'ord-1046', date: '2026-10-08', amount: 420, items: 'Paneer Butter Masala, Masala Chai ×2' },
    ],
    loyaltyPoints: 189,
  },
  {
    id: 'cus-010', name: 'Arjun Mehta', phone: '+91 94567 00112',
    totalOrders: 3, totalSpent: 2400, averageOrderValue: 800, lastOrderDate: '2026-09-15',
    status: 'inactive', favoriteItems: ['Veggie Burger'],
    orderHistory: [
      { orderId: 'ord-1010', date: '2026-09-15', amount: 800, items: 'Veggie Burger ×2, Fresh Lime Soda ×2' },
    ],
    loyaltyPoints: 24,
  },
]
