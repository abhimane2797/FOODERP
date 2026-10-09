import { mockCustomers } from '../mock/mockCustomers'
import type { Customer } from '../types'
import { sleep } from '../utils'

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    await sleep(300)
    return mockCustomers
  },
  async getCustomerById(id: string): Promise<Customer | undefined> {
    await sleep(150)
    return mockCustomers.find(c => c.id === id)
  },
  async searchCustomers(query: string): Promise<Customer[]> {
    await sleep(150)
    const q = query.toLowerCase()
    return mockCustomers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q))
  },
}
