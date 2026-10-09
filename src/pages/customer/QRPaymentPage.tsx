import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Smartphone, CreditCard, Landmark, Banknote,
  CheckCircle2, Download, Home, QrCode, Loader2,
} from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { useQRContext } from '../../hooks/useQRContext'
import {
  getActiveQROrder,
  ensureDemoQROrder,
  recordQROrderPayment,
  type QROrderSession,
} from '../../services/qrOrderService'
import { formatCurrency, clsx } from '../../utils'

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Credit / Debit Card' },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark, desc: 'All major banks' },
  { id: 'cash', label: 'Cash', icon: Banknote, desc: 'Pay at the table' },
]

function UPIPaymentScreen({ amount, upiId }: { amount: number; upiId: string }) {
  return (
    <div className="text-center py-4">
      <div className="w-48 h-48 mx-auto bg-white border-2 border-surface-200 rounded-2xl flex items-center justify-center relative overflow-hidden mb-4">
        <div className="absolute inset-3 grid grid-cols-10 grid-rows-10 gap-0.5 opacity-15">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className={clsx('rounded-sm', (i * 13 + amount) % 3 === 0 ? 'bg-surface-900' : 'bg-transparent')} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <QrCode className="w-12 h-12 text-surface-700" />
          <span className="text-[10px] text-surface-500 mt-1">Scan with any UPI app</span>
        </div>
        <div className="absolute top-2 left-2 w-5 h-5 border-2 border-surface-800 rounded-sm" />
        <div className="absolute top-2 right-2 w-5 h-5 border-2 border-surface-800 rounded-sm" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-2 border-surface-800 rounded-sm" />
      </div>
      <p className="text-sm text-surface-600 mb-1">Scan the QR code with any UPI app</p>
      <p className="text-xs text-surface-400">{upiId}</p>
    </div>
  )
}

function CardPaymentScreen() {
  return (
    <div className="space-y-4 py-2">
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className="w-full h-12 px-4 rounded-xl border border-surface-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Cardholder Name</label>
        <input
          type="text"
          placeholder="Name on card"
          className="w-full h-12 px-4 rounded-xl border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Expiry</label>
          <input
            type="text"
            placeholder="MM/YY"
            maxLength={5}
            className="w-full h-12 px-4 rounded-xl border border-surface-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">CVV</label>
          <input
            type="password"
            placeholder="•••"
            maxLength={4}
            className="w-full h-12 px-4 rounded-xl border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      </div>
      <p className="text-xs text-surface-400 text-center">🔒 This is a demo. No real payment is processed.</p>
    </div>
  )
}

export function QRPaymentPage() {
  const navigate = useNavigate()
  const { restaurantId, tableId, restaurant, table, paths } = useQRContext()
  const [order, setOrder] = useState<QROrderSession | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const existing = await getActiveQROrder(restaurantId, tableId)
      const result = existing ?? ensureDemoQROrder(restaurantId, tableId)
      if (!cancelled) {
        setOrder(result)
        setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [restaurantId, tableId])

  const total = order?.grandTotal ?? 0
  const paid = !!order?.paidAt

  const handlePay = useCallback(async (method: string) => {
    if (!order) return
    setProcessing(true)
    const updated = await recordQROrderPayment(order.id, method)
    setProcessing(false)
    if (updated) setOrder(updated)
  }, [order])

  const handleDownloadReceipt = useCallback(() => {
    if (!order) return
    const lines = [
      restaurant.name,
      '12 MG Road, Pune · GSTIN: 27AABCS1234F1Z5',
      '',
      `Receipt for Order #${order.displayNumber}`,
      `Table: ${table.label}`,
      `Date: ${new Date(order.placedAt).toLocaleString('en-IN')}`,
      `Transaction: ${order.txnId ?? 'N/A'} (${order.paymentMethod ?? 'N/A'})`,
      '',
      'Items:',
      ...order.items.map(i =>
        `  ${i.quantity} x ${i.name} @ ${formatCurrency(i.unitPrice)} = ${formatCurrency(i.unitPrice * i.quantity)}`,
      ),
      '',
      `Subtotal:      ${formatCurrency(order.subtotal)}`,
      `Discount:     -${formatCurrency(order.discount)}`,
      `GST (5%):      ${formatCurrency(order.tax)}`,
      `Service (10%): ${formatCurrency(order.serviceCharge)}`,
      `TOTAL PAID:    ${formatCurrency(order.grandTotal)}`,
      '',
      'Thank you for dining with us!',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${order.displayNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [order, restaurant, table])

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-success-100 flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 className="w-14 h-14 text-success-600" />
        </div>

        <h1 className="text-2xl font-bold text-surface-900">Payment Successful!</h1>
        <p className="text-4xl font-bold text-primary-700 mt-3">{formatCurrency(order.grandTotal)}</p>

        <div className="mt-6 w-full max-w-sm space-y-3">
          <Card className="bg-surface-50">
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Transaction ID</span>
              <span className="font-mono font-semibold text-surface-900">{order.txnId}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-surface-500">Paid via</span>
              <span className="text-surface-700 capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-surface-500">Date & Time</span>
              <span className="text-surface-700">
                {new Date(order.paidAt ?? order.placedAt).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-surface-500">Order / Table</span>
              <span className="text-surface-700">#{order.displayNumber} · {table.label}</span>
            </div>
          </Card>

          <div className="space-y-3 pt-4">
            <Button variant="outline" fullWidth icon={<Download className="w-4 h-4" />} onClick={handleDownloadReceipt}>
              Download Receipt
            </Button>
            <Button fullWidth icon={<Home className="w-4 h-4" />} onClick={() => navigate(paths.feedback)}>
              Back to Restaurant
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(paths.bill)} className="p-2 -ml-2 rounded-lg hover:bg-surface-100">
            <ArrowLeft className="w-5 h-5 text-surface-700" />
          </button>
          <h1 className="text-lg font-bold text-surface-900">Payment</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        {/* Total */}
        <Card className="text-center mb-6 bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-200">
          <p className="text-sm text-primary-700">Total Payable</p>
          <p className="text-3xl font-bold text-primary-900 mt-1">{formatCurrency(total)}</p>
          <p className="text-xs text-primary-600 mt-1">{restaurant.name} · {table.label} · Order #{order.displayNumber}</p>
        </Card>

        {/* Payment Methods */}
        {!selectedMethod && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-surface-900">Select Payment Method</p>
            {paymentMethods.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-surface-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-left active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <m.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-surface-900">{m.label}</p>
                  <p className="text-xs text-surface-500">{m.desc}</p>
                </div>
                <span className="text-surface-300">→</span>
              </button>
            ))}
          </div>
        )}

        {/* Selected Method */}
        {selectedMethod && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedMethod(null)} className="text-sm text-primary-600 font-medium">
                ← Change method
              </button>
              <span className="text-sm font-semibold text-surface-900">
                {paymentMethods.find(m => m.id === selectedMethod)?.label}
              </span>
            </div>

            {selectedMethod === 'upi' && <UPIPaymentScreen amount={total} upiId="spicegarden@upi" />}
            {selectedMethod === 'card' && <CardPaymentScreen />}
            {selectedMethod === 'netbanking' && (
              <div className="space-y-3">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank'].map(bank => (
                  <button
                    key={bank}
                    onClick={() => handlePay(`netbanking · ${bank}`)}
                    disabled={processing}
                    className="w-full p-4 bg-white rounded-2xl border border-surface-200 text-left font-medium text-surface-900 hover:border-primary-300 hover:bg-primary-50/50 transition-all disabled:opacity-60"
                  >
                    {bank}
                  </button>
                ))}
              </div>
            )}
            {selectedMethod === 'cash' && (
              <div className="text-center py-8">
                <Banknote className="w-16 h-16 text-success-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-surface-900">Pay {formatCurrency(total)} in cash</p>
                <p className="text-sm text-surface-500 mt-1">Please hand the cash to your waiter</p>
                <div className="mt-6">
                  <Button fullWidth size="lg" loading={processing} onClick={() => handlePay('cash')}>
                    {processing ? 'Confirming...' : 'Mark as Paid'}
                  </Button>
                </div>
              </div>
            )}

            {/* Pay Button */}
            {selectedMethod !== 'cash' && selectedMethod !== 'netbanking' && (
              <div className="mt-6">
                <Button fullWidth size="lg" loading={processing} onClick={() => handlePay(selectedMethod)}>
                  {processing ? 'Processing Payment...' : `Pay ${formatCurrency(total)}`}
                </Button>
                <p className="text-xs text-surface-400 text-center mt-3">
                  🔒 Secured by {restaurant.name} · Demo mode only
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
