import { sleep } from '../utils'

export interface PaymentResult {
  success: boolean
  transactionId: string
  amount: number
  method: string
  timestamp: string
}

export const paymentService = {
  async processPayment(amount: number, method: string): Promise<PaymentResult> {
    await sleep(1500)
    return {
      success: true,
      transactionId: `TXN${Date.now().toString(36).toUpperCase()}`,
      amount,
      method,
      timestamp: new Date().toISOString(),
    }
  },
}
