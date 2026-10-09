import { useState, useEffect } from 'react'
import {
  DollarSign, ShoppingCart, TrendingUp, Clock,
  MoreHorizontal, Wallet, CreditCard, Smartphone, Banknote,
  UtensilsCrossed, Package, Bike, QrCode,
} from 'lucide-react'
import {
  Card, StatCard, SectionHeader, Badge, LoadingState,
} from '../../components/ui'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { useApi } from '../../hooks'
import { orderService } from '../../services/orderService'
import { menuItems } from '../../mock/mockMenu'
import type { Order, DashboardStats, SalesDataPoint, OrderOverview, PaymentSummary } from '../../types'
import { formatCurrency, formatNumber, getOrderTypeColor } from '../../utils'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-white rounded-lg border border-surface-200 shadow-lg px-3.5 py-2.5 text-sm">
      <p className="font-medium text-surface-900 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-surface-600">
          {p.name === 'sales' ? 'Sales: ' : 'Orders: '}
          <span className="font-semibold text-surface-900">
            {p.name === 'sales' ? formatCurrency(p.value) : formatNumber(p.value)}
          </span>
        </p>
      ))}
    </div>
  )
}

export function DashboardPage() {
  const [period, setPeriod] = useState<'today' | '7d' | '30d'>('today')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([])
  const [orderOverview, setOrderOverview] = useState<OrderOverview | null>(null)
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const { data: orders } = useApi<Order[]>(() => orderService.getOrders())

  useEffect(() => {
    Promise.all([
      orderService.getDashboardStats(),
      orderService.getSalesData(period),
      orderService.getOrderOverview(),
      orderService.getPaymentSummary(),
    ]).then(([s, sales, oo, ps]) => {
      setStats(s)
      setSalesData(sales)
      setOrderOverview(oo)
      setPaymentSummary(ps)
      setLoading(false)
    })
  }, [period])

  if (loading || !stats || !orderOverview || !paymentSummary) return <LoadingState />

  const bestSellers = [
    { id: 'mi-010', name: 'Paneer Butter Masala', orders: 124, revenue: 31000, imageUrl: menuItems.find(i => i.id === 'mi-010')?.imageUrl },
    { id: 'mi-011', name: 'Chicken Biryani', orders: 98, revenue: 29400, imageUrl: menuItems.find(i => i.id === 'mi-011')?.imageUrl },
    { id: 'mi-012', name: 'Butter Chicken', orders: 86, revenue: 27520, imageUrl: menuItems.find(i => i.id === 'mi-012')?.imageUrl },
    { id: 'mi-020', name: 'Margherita Pizza', orders: 74, revenue: 22126, imageUrl: menuItems.find(i => i.id === 'mi-020')?.imageUrl },
    { id: 'mi-030', name: 'Classic Cheese Burger', orders: 68, revenue: 16932, imageUrl: menuItems.find(i => i.id === 'mi-030')?.imageUrl },
  ]

  const orderTypeData = [
    { name: 'Dine-In', value: orderOverview.dineIn, icon: UtensilsCrossed, color: '#3b82f6', bg: 'bg-blue-50 text-blue-600' },
    { name: 'Takeaway', value: orderOverview.takeaway, icon: Package, color: '#f59e0b', bg: 'bg-amber-50 text-amber-600' },
    { name: 'Delivery', value: orderOverview.delivery, icon: Bike, color: '#a855f7', bg: 'bg-purple-50 text-purple-600' },
    { name: 'QR Orders', value: orderOverview.qr, icon: QrCode, color: '#14b8a6', bg: 'bg-teal-50 text-teal-600' },
  ]

  const totalOrderTypes = orderTypeData.reduce((s, i) => s + i.value, 0)
  const pieColors = ['#3b82f6', '#f59e0b', '#a855f7', '#14b8a6']

  const paymentData = [
    { name: 'Cash', value: paymentSummary.cash, icon: Banknote, bg: 'bg-success-50 text-success-600' },
    { name: 'UPI', value: paymentSummary.upi, icon: Smartphone, bg: 'bg-primary-50 text-primary-600' },
    { name: 'Card', value: paymentSummary.card, icon: CreditCard, bg: 'bg-blue-50 text-blue-600' },
    { name: 'Online', value: paymentSummary.online, icon: Wallet, bg: 'bg-purple-50 text-purple-600' },
  ]
  const totalPayments = paymentData.reduce((s, i) => s + i.value, 0)

  const recentOrders = (orders || []).slice(0, 8)
  const orderColumns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Order ID', render: o => <span className="font-semibold text-surface-900">{o.orderNumber}</span> },
    { key: 'table', header: 'Table', render: o => o.tableName || '—' },
    { key: 'customer', header: 'Customer', render: o => <span className="text-surface-600">{o.customerName}</span> },
    { key: 'type', header: 'Type', render: o => <Badge variant="type" color={getOrderTypeColor(o.type)} size="sm">{o.type}</Badge> },
    { key: 'amount', header: 'Amount', align: 'right', render: o => <span className="font-semibold text-surface-900">{formatCurrency(o.grandTotal)}</span> },
    { key: 'payment', header: 'Payment', render: o => <Badge variant="status" size="sm">{o.paymentStatus}</Badge> },
    { key: 'status', header: 'Status', render: o => <Badge variant="status" size="sm" dot>{o.status}</Badge> },
    { key: 'time', header: 'Time', render: o => {
      const d = new Date(o.createdAt)
      return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    } },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-surface-500 mt-0.5">Wednesday, 8 October 2026 · Main Branch</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-surface-200 bg-white text-sm font-medium text-surface-600 hover:bg-surface-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Today
          </button>
          <button className="p-2 rounded-lg border border-surface-200 bg-white text-surface-500 hover:bg-surface-50 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales" value={formatCurrency(stats.todaySales)}
          change={stats.salesChange}
          icon={<DollarSign className="w-5 h-5" />} iconBg="bg-primary-50 text-primary-600"
        />
        <StatCard
          title="Orders" value={formatNumber(stats.orders)}
          change={stats.ordersChange}
          icon={<ShoppingCart className="w-5 h-5" />} iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Avg Order Value" value={formatCurrency(stats.averageOrderValue)}
          change={stats.aovChange}
          icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Pending Orders" value={String(stats.pendingOrders)}
          change={stats.pendingChange}
          icon={<Clock className="w-5 h-5" />} iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales Overview */}
        <Card className="xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-semibold text-surface-900">Sales Overview</h3>
              <p className="text-sm text-surface-500 mt-0.5">Revenue and orders over time</p>
            </div>
            <div className="flex items-center gap-1 bg-surface-100 rounded-lg p-0.5">
              {([['today', 'Today'], ['7d', '7 Days'], ['30d', '30 Days']] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPeriod(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    period === key ? 'bg-white text-surface-900 shadow-xs' : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => formatNumber(v)} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#0d9488" strokeWidth={2.5} fill="url(#salesGrad)" name="sales" />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" name="orders" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Overview */}
        <Card>
          <h3 className="text-base font-semibold text-surface-900 mb-1">Order Overview</h3>
          <p className="text-sm text-surface-500 mb-4">By order type today</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {orderTypeData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip formatter={(v, name) => [String(v), String(name)]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {orderTypeData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                  <span className="text-sm text-surface-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-900">{item.value}</span>
                  <span className="text-xs text-surface-400">{((item.value / totalOrderTypes) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Payment Summary */}
        <Card>
          <h3 className="text-base font-semibold text-surface-900 mb-1">Payment Summary</h3>
          <p className="text-sm text-surface-500 mb-5">Today's collection by method</p>
          <div className="space-y-3">
            {paymentData.map(p => {
              const pct = (p.value / totalPayments) * 100
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.bg}`}>
                        <p.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-surface-700">{p.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-surface-900">{formatCurrency(p.value)}</span>
                  </div>
                  <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-surface-100 flex items-center justify-between">
            <span className="text-sm font-medium text-surface-600">Total</span>
            <span className="text-lg font-bold text-surface-900">{formatCurrency(totalPayments)}</span>
          </div>
        </Card>

        {/* Best Selling Items */}
        <Card className="xl:col-span-2">
          <SectionHeader title="Best Selling Items" subtitle="Top items by revenue today" />
          <div className="mt-4 space-y-1">
            {bestSellers.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-50 transition-colors">
                <span className="w-6 text-center text-sm font-bold text-surface-400">{i + 1}</span>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-11 h-11 rounded-lg object-cover bg-surface-100"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">{item.name}</p>
                  <p className="text-xs text-surface-500">{item.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-surface-900">{formatCurrency(item.revenue)}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="text-xs text-surface-500">{(4 + Math.random()).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div>
        <SectionHeader
          title="Recent Orders"
          subtitle="Latest transactions"
          action={<a href="/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all →</a>}
          className="mb-3"
        />
        <DataTable
          columns={orderColumns}
          data={recentOrders}
          rowKey={o => o.id}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}
