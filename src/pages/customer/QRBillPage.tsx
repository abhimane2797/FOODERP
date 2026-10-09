import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Bell, Phone, Loader2 } from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import { useQRContext } from '../../hooks/useQRContext'
import { getActiveQROrder, ensureDemoQROrder, type QROrderSession } from '../../services/qrOrderService'
import { formatCurrency } from '../../utils'

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export function QRBillPage() {
  const navigate = useNavigate()
  const { restaurantId, tableId, restaurant, table, paths, go } = useQRContext()
  const { addToast } = useToast()
  const [order, setOrder] = useState<QROrderSession | null>(null)
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

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => go.order(order.displayNumber)} className="p-2 -ml-2 rounded-lg hover:bg-surface-100">
            <ArrowLeft className="w-5 h-5 text-surface-700" />
          </button>
          <h1 className="text-lg font-bold text-surface-900">Your Bill</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        {/* Bill Card */}
        <Card className="mb-4">
          {/* Restaurant header */}
          <div className="text-center pb-4 border-b border-dashed border-surface-300">
            <h2 className="text-lg font-bold text-surface-900">{restaurant.name}</h2>
            <p className="text-xs text-surface-500">12 MG Road, Pune · +91 98765 43210</p>
            <p className="text-xs text-surface-400 mt-0.5">GSTIN: 27AABCS1234F1Z5</p>
          </div>

          {/* Order info */}
          <div className="flex justify-between py-3 border-b border-dashed border-surface-300 text-sm">
            <div>
              <p className="text-surface-500">Table</p>
              <p className="font-semibold text-surface-900">{table.label}</p>
            </div>
            <div className="text-center">
              <p className="text-surface-500">Order</p>
              <p className="font-semibold text-surface-900">#{order.displayNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-surface-500">Date</p>
              <p className="font-semibold text-surface-900">{fmtDate(order.placedAt)}</p>
            </div>
          </div>

          {/* Items */}
          <div className="py-3 space-y-2.5 border-b border-dashed border-surface-300">
            <div className="grid grid-cols-12 text-xs font-semibold text-surface-500 uppercase">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Rate</span>
              <span className="col-span-2 text-right">Amount</span>
            </div>
            {order.items.map((item, i) => {
              const addon = item.selectedAddons.reduce((s, a) => s + a.price, 0)
              const unit = item.unitPrice + addon
              return (
                <div key={i} className="grid grid-cols-12 text-sm">
                  <span className="col-span-6 text-surface-900 font-medium">{item.name}</span>
                  <span className="col-span-2 text-center text-surface-600">{item.quantity}</span>
                  <span className="col-span-2 text-right text-surface-600">{formatCurrency(unit)}</span>
                  <span className="col-span-2 text-right font-medium text-surface-900">{formatCurrency(unit * item.quantity)}</span>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div className="py-3 space-y-2 text-sm border-b border-dashed border-surface-300">
            <div className="flex justify-between text-surface-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-surface-600">
              <span>GST (5%)</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-surface-600">
              <span>Service Charge (10%)</span>
              <span>{formatCurrency(order.serviceCharge)}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg text-surface-900 py-4">
            <span>Grand Total</span>
            <span className="text-primary-700">{formatCurrency(order.grandTotal)}</span>
          </div>

          <p className="text-center text-xs text-surface-400 pt-2 border-t border-dashed border-surface-300">
            Thank you for dining with us! 🙏
          </p>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button fullWidth size="lg" onClick={() => navigate(paths.payment)}>
            Pay Bill · {formatCurrency(order.grandTotal)}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              icon={<Bell className="w-4 h-4" />}
              onClick={() => addToast({ type: 'success', title: 'Bill Requested', message: 'Your bill request has been sent' })}
            >
              Request Bill
            </Button>
            <Button
              variant="outline"
              icon={<Phone className="w-4 h-4" />}
              onClick={() => addToast({ type: 'success', title: 'Waiter Notified', message: 'A waiter will be with you shortly' })}
            >
              Call Waiter
            </Button>
          </div>
          <Button
            variant="ghost"
            fullWidth
            icon={<Printer className="w-4 h-4" />}
            onClick={() => addToast({ type: 'info', title: 'Printed', message: 'Bill sent to printer' })}
          >
            Print Bill
          </Button>
        </div>
      </div>
    </div>
  )
}
