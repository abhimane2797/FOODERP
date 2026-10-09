/**
 * Menu service for the QR customer flow.
 *
 * Resolves the menu belonging to `restaurantId`. Today every restaurant
 * shares the same mock catalogue — swap the body for
 * `fetch('/api/restaurants/${restaurantId}/menu')` and the customer UI
 * does not change.
 */
import { menuItems, menuCategories } from '../mock/mockMenu'
import type { MenuItem, MenuCategory } from '../types'

export interface QRMenu {
  restaurantId: string
  categories: MenuCategory[]
  items: MenuItem[]
}

export async function getQRMenu(restaurantId: string): Promise<QRMenu> {
  // Mock: one shared catalogue; keyed by restaurantId for future split.
  return {
    restaurantId,
    categories: menuCategories.filter(c => c.isActive),
    items: menuItems.filter(i => i.isAvailable),
  }
}
