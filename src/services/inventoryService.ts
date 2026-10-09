import { mockInventory, mockStockAdjustments } from '../mock/mockOperations'
import type { InventoryItem, StockAdjustment } from '../types'
import { sleep } from '../utils'

export const inventoryService = {
  async getItems(): Promise<InventoryItem[]> {
    await sleep(300)
    return mockInventory
  },
  async getAdjustments(): Promise<StockAdjustment[]> {
    await sleep(200)
    return mockStockAdjustments
  },
  async getLowStockItems(): Promise<InventoryItem[]> {
    await sleep(200)
    return mockInventory.filter(i => i.status === 'low-stock' || i.status === 'out-of-stock')
  },
}
