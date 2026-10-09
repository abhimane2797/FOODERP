import { mockTables } from '../mock/mockTables'
import type { RestaurantTable } from '../types'
import { sleep } from '../utils'

export const tableService = {
  async getTables(): Promise<RestaurantTable[]> {
    await sleep(300)
    return mockTables
  },
  async getTablesByFloor(floor: string): Promise<RestaurantTable[]> {
    await sleep(200)
    return mockTables.filter(t => t.floor === floor)
  },
  async getTableById(id: string): Promise<RestaurantTable | undefined> {
    await sleep(150)
    return mockTables.find(t => t.id === id)
  },
}
