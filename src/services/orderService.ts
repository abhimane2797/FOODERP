import { mockOrders, mockSalesToday, mockSales7Days, mockSales30Days, mockOrderOverview, mockPaymentSummary } from '../mock/mockOrders'
import type { Order, SalesDataPoint, OrderOverview, PaymentSummary, DashboardStats } from '../types'
import { sleep } from '../utils'

export const orderService = {
  async getOrders(): Promise<Order[]> {
    await sleep(300)
    return mockOrders
  },
  async getOrderById(id: string): Promise<Order | undefined> {
    await sleep(150)
    return mockOrders.find(o => o.id === id)
  },
  async getOrdersByType(type: string): Promise<Order[]> {
    await sleep(200)
    if (type === 'all') return mockOrders
    return mockOrders.filter(o => o.type === type)
  },
  async getOrdersByStatus(status: string): Promise<Order[]> {
    await sleep(200)
    if (status === 'all') return mockOrders
    return mockOrders.filter(o => o.status === status)
  },
  async getDashboardStats(): Promise<DashboardStats> {
    await sleep(400)
    return {
      todaySales: 124850,
      orders: 342,
      averageOrderValue: 365,
      pendingOrders: 18,
      salesChange: 12.5,
      ordersChange: 8.2,
      aovChange: -2.1,
      pendingChange: -5.0,
    }
  },
  async getSalesData(period: 'today' | '7d' | '30d'): Promise<SalesDataPoint[]> {
    await sleep(300)
    switch (period) {
      case 'today': return mockSalesToday
      case '7d': return mockSales7Days
      case '30d': return mockSales30Days
      default: return mockSalesToday
    }
  },
  async getOrderOverview(): Promise<OrderOverview> {
    await sleep(200)
    return mockOrderOverview
  },
  async getPaymentSummary(): Promise<PaymentSummary> {
    await sleep(200)
    return mockPaymentSummary
  },
}
