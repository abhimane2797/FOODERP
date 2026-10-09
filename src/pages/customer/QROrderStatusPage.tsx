import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, Utensils, Loader2 } from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { useQRContext } from '../../hooks/useQRContext'
import {
  getQROrder,
  advanceQROrderStatus,
  type QROrderSession,
} from '../../services/qrOrderService'
import { formatCurrency, clsx } from '../../utils'

const statusSteps = [
  { id: 'received', label: 'Order Received', icon: CheckCircle2 },
  { id: 'preparing', label: 'Preparing', icon: Clock },
  { id: 'ready', label: 'Ready', icon: Utensils },
  { id: 'served', label: 'Served', icon: CheckCircle2 },
] as const

const stepIndex: Record<QROrderSession['status'], number> = {
  received: 0,
  preparing: 1,
  ready: 2,
  served: 3,
}

export function QROrderStatusPage() {
  const navigate = useNavigate()
  const { orderId, restaurant, table, paths } = useQRContext()
  const [order, setOrder] = useState<QROrderSession | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!orderId) return
    const found = await getQROrder(orderId)
    setOrder(found)
    setLoading(false)
  }, [orderId])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Simulate the kitchen advancing the ticket (would be a websocket/API poll).
  useEffect(() => {
    if (!order || order.status === 'served') return
    const timer = setInterval(async () => {
      const updated = await advanceQROrderStatus(order.id)
      if (updated) setOrder(updated)
    }, 9000)
    return () => clearInterval(timer)
  }, [order])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-lg font-bold text-surface-900">Order not found</h2>
        <p className="text-sm text-surface-500 mt-1">It may have been cleared from this session.</p>
        <Button className="mt-6" onClick={() => navigate(paths.menu)}>Back to Menu</Button>
      </div>
    )
  }

  const currentStep = stepIndex[order.status]
  const estimatedTime = Math.max(3, 25 - currentStep * 7)

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white px-4 pt-6 pb-12">
        <div className="flex items-center gap-2 text-sm text-primary-200 mb-1">
          <Utensils className="w-4 h-4" />
          <span>{restaurant.name}</span>
        </div>
        <h1 className="text-2xl font-bold">Order #{order.displayNumber}</h1>
        <p className="text-sm text-primary-200 mt-1">{table.label}</p>
      </div>

      <div className="px-4 -mt-6 flex-1">
        {/* Status Progress */}
        <Card className="mb-4">
          <h2 className="text-sm font-semibold text-surface-900 mb-6">Order Status</h2>
          <div className="space-y-0">
            {statusSteps.map((step, i) => {
              const isCompleted = i < currentStep
              const isCurrent = i === currentStep
              const isUpcoming = i > currentStep

              return (
                <div key={step.id} className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div
                      className={clsx(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500',
                        isCompleted && 'bg-success-500 text-white',
                        isCurrent && 'bg-primary-600 text-white ring-4 ring-primary-100 animate-pulse-soft',
                        isUpcoming && 'bg-surface-100 text-surface-400',
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <step.icon className={clsx('w-5 h-5', isCurrent && 'animate-pulse-soft')} />
                      )}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={clsx(
                        'w-0.5 h-10 transition-colors duration-500',
                        isCompleted ? 'bg-success-500' : 'bg-surface-200',
                      )} />
                    )}
                  </div>

                  {/* Label */}
                  <div className="pb-8">
                    <p className={clsx(
                      'text-sm font-semibold',
                      isCompleted ? 'text-success-700' : isCurrent ? 'text-primary-700' : 'text-surface-400',
                    )}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-surface-500 mt-0.5">
                        {step.id === 'preparing' && 'Our chef is preparing your food...'}
                        {step.id === 'received' && 'We have received your order'}
                        {step.id === 'ready' && 'Your food is ready!'}
                        {step.id === 'served' && 'Enjoy your meal!'}
                      </p>
                    )}
                    {isCompleted && <p className="text-xs text-success-600 mt-0.5">✓ Completed</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Estimated Time */}
        {order.status !== 'served' && (
          <Card className="mb-4 text-center bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-200">
            <p className="text-sm text-primary-700 font-medium">Estimated preparation time</p>
            <p className="text-3xl font-bold text-primary-900 mt-1">{estimatedTime} min</p>
            <p className="text-xs text-primary-600 mt-1">We'll notify you when your order is ready</p>
          </Card>
        )}

        {/* Ordered Items */}
        <Card className="mb-4">
          <h2 className="text-sm font-semibold text-surface-900 mb-3">Ordered Items</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => {
              const addon = item.selectedAddons.reduce((s, a) => s + a.price, 0)
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center text-xs font-bold">
                      {item.quantity}×
                    </span>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{item.name}</p>
                      {item.selectedVariant && (
                        <p className="text-xs text-surface-500">{item.selectedVariant}</p>
                      )}
                      {item.selectedAddons.length > 0 && (
                        <p className="text-xs text-surface-500">
                          + {item.selectedAddons.map(a => a.name).join(', ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-warning-600 italic">"{item.specialInstructions}"</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-surface-700">
                    {formatCurrency((item.unitPrice + addon) * item.quantity)}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between font-bold text-surface-900 pt-3 mt-1 border-t border-surface-200">
            <span>Total</span>
            <span className="text-primary-700">{formatCurrency(order.grandTotal)}</span>
          </div>
        </Card>

        {/* Action buttons */}
        <div className="space-y-3 pb-6">
          <Button fullWidth variant="outline" onClick={() => navigate(paths.bill)}>
            View Bill
          </Button>
          <Button fullWidth onClick={() => navigate(paths.menu)}>
            Order More Food
          </Button>
        </div>
      </div>
    </div>
  )
}
