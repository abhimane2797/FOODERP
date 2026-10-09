import { menuItems, menuCategories, commonAddons, commonVariants } from '../mock/mockMenu'
import type { MenuItem, MenuCategory, MenuAddon, MenuVariant } from '../types'
import { sleep } from '../utils'

export const menuService = {
  async getItems(): Promise<MenuItem[]> {
    await sleep(300)
    return menuItems
  },
  async getCategories(): Promise<MenuCategory[]> {
    await sleep(200)
    return menuCategories
  },
  async getAddons(): Promise<MenuAddon[]> {
    await sleep(150)
    return commonAddons
  },
  async getVariants(): Promise<MenuVariant[]> {
    await sleep(150)
    return commonVariants
  },
  async getItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    await sleep(200)
    if (categoryId === 'all') return menuItems
    return menuItems.filter(i => i.categoryId === categoryId)
  },
  async searchItems(query: string): Promise<MenuItem[]> {
    await sleep(150)
    const q = query.toLowerCase()
    return menuItems.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  },
}
