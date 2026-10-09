import { useState, useMemo } from 'react'
import { Eye, Download, Calendar, ClipboardList, RefreshCw } from 'lucide-react'
import { Badge, Tabs, SearchInput, Button, Drawer, Select, EmptyState, Card } from '../../components/ui'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { useApi } from '../../hooks'
import { orderService } from '../../services/orderService'
import type { Order } from '../../types'
import { formatCurrency, getOrderTypeColor, formatDateTime, formatTime } from '../../utils'

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'served', label: 'Served' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function OrdersPage() {
  const { data: orders, loading } = useApi<Order[]>(() => orderService.getOrders())
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const tabs = [
    { id: 'all', label: 'All', count: orders?.length || 0 },
    { id: 'dine-in', label: 'Dine-In', count: orders?.filter(o => o.type === 'dine-in').length || 0 },
    { id: 'takeaway', label: 'Takeaway', count: orders?.filter(o => o.type === 'takeaway').length || 0 },
    { id: 'delivery', label: 'Delivery', count: orders?.filter(o => o.type === 'delivery').length || 0 },
    { id: 'qr', label: 'QR Orders', count: orders?.filter(o => o.type === 'qr').length || 0 },
    { id: 'online', label: 'Online', count: orders?.filter(o => o.type === 'online').length || 0 },
  ]

  const filtered = useMemo(() => {
    let result = orders || []
    if (activeTab !== 'all') result = result.filter(o => o.type === activeTab)
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.tableName || '').toLowerCase().includes(q)
      )
    }
    return result
  }, [orders, activeTab, statusFilter, search])

  const columns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Order ID', render: o => <span className="font-semibold text-surface-900">{o.orderNumber}</span> },
    { key: 'type', header: 'Type', render: o => <Badge variant="type" color={getOrderTypeColor(o.type)} size="sm">{o.type}</Badge> },
    { key: 'table', header: 'Table', render: o => o.tableName || '—' },
    { key: 'customer', header: 'Customer', render: o => (
      <div>
        <p className="font-medium text-surface-900">{o.customerName}</p>
        {o.customerPhone && <p className="text-xs text-surface-400">{o.customerPhone}</p>}
      </div>
    )},
    { key: 'items', header: 'Items', align: 'center', render: o => (
      <span className="text-surface-600">{o.items.reduce((s, i) => s + i.quantity, 0)}</span>
    )},
    { key: 'amount', header: 'Amount', align: 'right', render: o => <span className="font-semibold text-surface-900">{formatCurrency(o.grandTotal)}</span> },
    { key: 'payment', header: 'Payment', render: o => (
      <div className="flex items-center gap-1.5">
        <Badge variant="status" size="sm">{o.paymentStatus}</Badge>
        {o.paymentMethod && <span className="text-xs text-surface-400 uppercase">{o.paymentMethod}</span>}
      </div>
    )},
    { key: 'status', header: 'Status', render: o => <Badge variant="status" size="sm" dot>{o.status}</Badge> },
    { key: 'createdAt', header: 'Created', render: o => <span className="text-surface-500">{formatTime(o.createdAt)}</span> },
    { key: 'actions', header: '', align: 'right', render: o => (
      <button
        onClick={e => { e.stopPropagation(); setSelectedOrder(o) }}
        className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>
    )},
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Orders</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage and track all orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by order ID, customer, table..." className="flex-1" />
        <div className="flex gap-2">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-40"
          />
          <Button variant="outline" size="md" icon={<Calendar className="w-4 h-4" />}>Date Range</Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-surface-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-8 h-8" />}
          title="No orders found"
          message="Try adjusting your filters or search terms."
        />
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={o => o.id} onRowClick={setSelectedOrder} />
      )}

      {/* Order Detail Drawer */}
      <Drawer open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.orderNumber || ''}`} size="lg">
        {selectedOrder && (
          <div className="p-6 space-y-6">
            {/* Status header */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="type" color={getOrderTypeColor(selectedOrder.type)}>{selectedOrder.type}</Badge>
              <Badge variant="status" dot>{selectedOrder.status}</Badge>
              <Badge variant="status">{selectedOrder.paymentStatus}</Badge>
              <span className="text-sm text-surface-500 ml-auto">{formatDateTime(selectedOrder.createdAt)}</span>
            </div>

            {/* Customer & Table info */}
            <div className="grid grid-cols-2 gap-4">
              <Card padding className="bg-surface-50">
                <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">Customer</p>
                <p className="text-sm font-semibold text-surface-900 mt-1">{selectedOrder.customerName}</p>
                {selectedOrder.customerPhone && <p className="text-sm text-surface-500">{selectedOrder.customerPhone}</p>}
              </Card>
              <Card padding className="bg-surface-50">
                <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">Table</p>
                <p className="text-sm font-semibold text-surface-900 mt-1">{selectedOrder.tableName || 'Takeaway / Delivery'}</p>
              </Card>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs text-surface-400 font-medium uppercase tracking-wider mb-3">Order Items</p>
              <div className="border border-surface-200 rounded-xl divide-y divide-surface-100">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {item.quantity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900">{item.name}</p>
                      {item.selectedAddons.length > 0 && (
                        <p className="text-xs text-surface-500 mt-0.5">+ {item.selectedAddons.map(a => a.name).join(', ')}</p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-warning-600 mt-0.5 italic">Note: {item.specialInstructions}</p>
                      )}
                    </div>
                    <span className="text-sm text-surface-500">{formatCurrency(item.unitPrice)} each</span>
                    <span className="text-sm font-semibold text-surface-900 w-20 text-right">{formatCurrency(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-surface-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-surface-600">
                <span>Subtotal</span><span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-success-600">
                  <span>Discount</span><span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-surface-600">
                <span>Tax</span><span>{formatCurrency(selectedOrder.tax)}</span>
              </div>
              {selectedOrder.serviceCharge > 0 && (
                <div className="flex justify-between text-sm text-surface-600">
                  <span>Service Charge</span><span>{formatCurrency(selectedOrder.serviceCharge)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-surface-900 pt-2 border-t border-surface-200">
                <span>Grand Total</span><span className="text-primary-700">{formatCurrency(selectedOrder.grandTotal)}</span>
              </div>
            </div>

            {selectedOrder.specialInstructions && (
              <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                <p className="text-xs text-warning-700 font-medium uppercase tracking-wider">Special Instructions</p>
                <p className="text-sm text-warning-800 mt-1">{selectedOrder.specialInstructions}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" fullWidth icon={<Download className="w-4 h-4" />}>Print Bill</Button>
              <Button variant="primary" fullWidth>Update Status</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
