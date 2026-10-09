import { restaurant, branches } from '../mock/mockRestaurant'
import type { Restaurant, Branch } from '../types'
import { sleep } from '../utils'

export const restaurantService = {
  async getRestaurant(): Promise<Restaurant> {
    await sleep(200)
    return restaurant
  },
  async getBranches(): Promise<Branch[]> {
    await sleep(200)
    return branches
  },
}
