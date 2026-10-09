import { useState, useMemo } from 'react'
import { ChefHat, Clock, AlertTriangle, CheckCircle2, Flame, ArrowRight } from 'lucide-react'
import { Badge, Button, Card, Tabs } from '../../components/ui'
import { useApi } from '../../hooks'
import { useToast } from '../../hooks/useToast'
import { orderService } from '../../services/orderService'
import type { Order, KOTStatus } from '../../types'
import { clsx, getPriorityColor } from '../../utils'

const columns: { id: KOTStatus; label: string; accent: string; headerBg: string }[] = [
  { id: 'new', label: 'NEW', accent: 'border-t-info-500', headerBg: 'bg-info-50 text-info-700' },
  { id: 'preparing', label: 'PREPARING', accent: 'border-t-warning-500', headerBg: 'bg-warning-50 text-warning-700' },
  { id: 'ready', label: 'READY', accent: 'border-t-success-500', headerBg: 'bg-success-50 text-success-700' },
  { id: 'served', label: 'SERVED', accent: 'border-t-surface-400', headerBg: 'bg-surface-100 text-surface-600' },
]

const actionLabels: Record<KOTStatus, { label: string; next: KOTStatus | null }> = {
  'new': { label: 'Accept', next: 'preparing' },
  'preparing': { label: 'Mark Ready', next: 'ready' },
  'ready': { label: 'Serve', next: 'served' },
  'served': { label: 'Completed', next: null },
}

export function KitchenPage() {
  const { data: orders } = useApi<Order[]>(() => orderService.getOrders())
  const [filter, setFilter] = useState<'all' | 'high'>('all')
  const { addToast } = useToast()
  const [localStatus, setLocalStatus] = useState<Record<string, KOTStatus>>({})

  const kitchenOrders = useMemo(() => {
    let result = (orders || []).filter(o =>
      ['new', 'preparing', 'ready', 'served'].includes(localStatus[o.id] || o.status)
    )
    if (filter === 'high') result = result.filter(o => o.priority === 'high' || o.priority === 'urgent')
    return result
  }, [orders, localStatus, filter])

  const getElapsed = (createdAt: string) => {
    const min = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
    return min
  }

  const getElapsedColor = (min: number) => {
    if (min > 30) return 'text-danger-600 bg-danger-50'
    if (min > 15) return 'text-warning-600 bg-warning-50'
    return 'text-success-600 bg-success-50'
  }

  const advanceOrder = (order: Order) => {
    const current = localStatus[order.id] || (order.status as KOTStatus)
    const action = actionLabels[current]
    if (!action.next) return
    setLocalStatus(prev => ({ ...prev, [order.id]: action.next! }))
    addToast({ type: 'success', title: `Order ${order.orderNumber}`, message: `Moved to ${actionLabels[action.next!].label === 'Accept' ? 'Preparing' : action.next}` })
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-primary-600" />
            Kitchen Display
          </h1>
          <p className="text-sm text-surface-500 mt-0.5">Real-time order preparation tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            tabs={[{ id: 'all', label: 'All Orders' }, { id: 'high', label: '🔥 Priority' }]}
            active={filter}
            onChange={v => setFilter(v as 'all' | 'high')}
            className="border-0"
          />
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map(col => {
          const colOrders = kitchenOrders.filter(o => (localStatus[o.id] || o.status) === col.id)
          return (
            <div key={col.id} className="flex flex-col">
              {/* Column header */}
              <div className={clsx('flex items-center justify-between px-4 py-3 rounded-t-xl', col.headerBg)}>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-wide">{col.label}</h3>
                  <span className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center text-xs font-bold">
                    {colOrders.length}
                  </span>
                </div>
                {col.id === 'preparing' && <Flame className="w-4 h-4 text-warning-500" />}
                {col.id === 'ready' && <CheckCircle2 className="w-4 h-4 text-success-500" />}
              </div>

              {/* Cards */}
              <div className={clsx('flex-1 space-y-3 p-3 bg-surface-50 rounded-b-xl min-h-[200px] border-2 border-t-0', col.accent.replace('border-t-', 'border-t-transparent '))}>
                {colOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <ChefHat className="w-8 h-8 text-surface-300 mb-2" />
                    <p className="text-xs text-surface-400">No orders</p>
                  </div>
                ) : (
                  colOrders.map(order => {
                    const elapsed = getElapsed(order.createdAt)
                    const current = localStatus[order.id] || (order.status as KOTStatus)
                    const action = actionLabels[current]
                    return (
                      <Card key={order.id} padding={false} className={clsx(
                        'border-t-4 overflow-hidden',
                        order.priority === 'urgent' ? 'border-t-danger-500' :
                        order.priority === 'high' ? 'border-t-warning-500' : 'border-t-primary-500',
                      )}>
                        <div className="p-4">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-surface-900">Order {order.orderNumber}</span>
                              {order.priority !== 'normal' && order.priority !== 'low' && (
                                <span className={clsx('w-2 h-2 rounded-full', getPriorityColor(order.priority))} />
                              )}
                            </div>
                            <span className={clsx('px-2 py-0.5 rounded-md text-[11px] font-semibold', getElapsedColor(elapsed))}>
                              <Clock className="w-3 h-3 inline mr-0.5" />
                              {elapsed}m
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-surface-500 mb-3">
                            <span className="font-medium text-surface-700">{order.tableName || order.type}</span>
                            {order.items.some(i => i.specialInstructions) && (
                              <span className="flex items-center gap-0.5 text-warning-600">
                                <AlertTriangle className="w-3 h-3" /> Note
                              </span>
                            )}
                          </div>

                          {/* Items */}
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="w-6 h-6 rounded-md bg-surface-100 text-surface-700 flex items-center justify-center text-xs font-bold shrink-0">
                                  {item.quantity}×
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-surface-900 leading-tight">{item.name}</p>
                                  {item.specialInstructions && (
                                    <p className="text-xs text-warning-600 mt-0.5 italic">"{item.specialInstructions}"</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Action */}
                          {action.next && (
                            <Button
                              fullWidth
                              size="sm"
                              variant={current === 'new' ? 'primary' : current === 'preparing' ? 'warning' : 'success'}
                              onClick={() => advanceOrder(order)}
                              iconRight={<ArrowRight className="w-3.5 h-3.5" />}
                            >
                              {action.label}
                            </Button>
                          )}
                          {!action.next && (
                            <div className="text-center py-2">
                              <Badge variant="status" size="sm">served</Badge>
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
