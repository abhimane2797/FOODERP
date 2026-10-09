import { useState } from 'react'
import {
  Download, TrendingUp, DollarSign, ShoppingCart,
  PieChart, CreditCard, Package, Receipt, UserCog, FileText,
} from 'lucide-react'
import { Badge, Button, Card, StatCard, SectionHeader, Select } from '../../components/ui'
import { clsx, formatCurrency, formatNumber } from '../../utils'
import { mockSales7Days } from '../../mock/mockOrders'
import { menuItems } from '../../mock/mockMenu'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart as RePieChart, Pie, Cell,
} from 'recharts'

const reportTypes = [
  { id: 'sales', label: 'Sales Report', icon: TrendingUp },
  { id: 'order', label: 'Order Report', icon: ShoppingCart },
  { id: 'item', label: 'Item Report', icon: Package },
  { id: 'category', label: 'Category Report', icon: PieChart },
  { id: 'payment', label: 'Payment Report', icon: CreditCard },
  { id: 'tax', label: 'Tax Report', icon: FileText },
  { id: 'inventory', label: 'Inventory Report', icon: Package },
  { id: 'expense', label: 'Expense Report', icon: Receipt },
  { id: 'employee', label: 'Employee Report', icon: UserCog },
]

const pieColors = ['#0d9488', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#22c55e']

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-white rounded-lg border border-surface-200 shadow-lg px-3.5 py-2.5 text-sm">
      <p className="font-medium text-surface-900 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-surface-600">
          {p.name}: <span className="font-semibold text-surface-900">{formatNumber(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState('sales')
  const [dateRange, setDateRange] = useState('7d')

  const categoryData = [
    { name: 'Main Course', value: 48200 },
    { name: 'Starters', value: 24800 },
    { name: 'Pizza', value: 18600 },
    { name: 'Beverages', value: 14200 },
    { name: 'Burgers', value: 12800 },
    { name: 'Desserts', value: 6250 },
  ]

  const paymentData = [
    { name: 'UPI', value: 58200 },
    { name: 'Cash', value: 32400 },
    { name: 'Card', value: 24800 },
    { name: 'Online', value: 9450 },
  ]

  const taxData = [
    { name: 'CGST (2.5%)', value: 3121 },
    { name: 'SGST (2.5%)', value: 3121 },
    { name: 'Service Tax', value: 1248 },
  ]

  const itemSales = menuItems.slice(0, 10).map(item => ({
    ...item,
    quantitySold: Math.floor(Math.random() * 120) + 20,
    revenue: Math.floor(Math.random() * 30000) + 5000,
  }))

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Reports</h1>
          <p className="text-sm text-surface-500 mt-0.5">Analytics and business insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            options={[
              { value: 'today', label: 'Today' },
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' },
            ]}
            className="w-40"
          />
          <Select
            options={[{ value: 'all', label: 'All Branches' }, { value: 'br-001', label: 'Main Branch' }, { value: 'br-002', label: 'Koregaon Park' }]}
            className="w-44"
            placeholder="Branch"
          />
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>Export</Button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="hidden lg:block w-52 shrink-0">
          <div className="bg-white rounded-xl border border-surface-200 p-2 space-y-0.5 sticky top-4">
            {reportTypes.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveReport(r.id)}
                className={clsx(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeReport === r.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-50',
                )}
              >
                <r.icon className="w-4 h-4 shrink-0" />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile select */}
        <div className="lg:hidden w-full">
          <Select
            value={activeReport}
            onChange={e => setActiveReport(e.target.value)}
            options={reportTypes.map(r => ({ value: r.id, label: r.label }))}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Revenue" value={formatCurrency(842500)} change={12.5} icon={<DollarSign className="w-5 h-5" />} iconBg="bg-primary-50 text-primary-600" />
            <StatCard title="Total Orders" value="2,342" change={8.3} icon={<ShoppingCart className="w-5 h-5" />} iconBg="bg-blue-50 text-blue-600" />
            <StatCard title="Avg Order Value" value={formatCurrency(360)} change={-1.2} icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-purple-50 text-purple-600" />
            <StatCard title="Items Sold" value="8,420" change={15.7} icon={<Package className="w-5 h-5" />} iconBg="bg-amber-50 text-amber-600" />
          </div>

          {/* Main Chart */}
          <Card>
            <SectionHeader
              title={`${reportTypes.find(r => r.id === activeReport)?.label}`}
              subtitle="Revenue trend over selected period"
              className="mb-6"
            />
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSales7Days} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => formatNumber(v)} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="sales" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category + Payment side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <SectionHeader title="Category Revenue" subtitle="Revenue by menu category" className="mb-4" />
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                      labelLine={false}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <SectionHeader title="Payment Methods" subtitle="Revenue by payment type" className="mb-4" />
              <div className="space-y-4 mt-4">
                {paymentData.map((p, i) => {
                  const total = paymentData.reduce((s, x) => s + x.value, 0)
                  return (
                    <div key={p.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-surface-700">{p.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-surface-900">{formatCurrency(p.value)}</span>
                          <span className="text-xs text-surface-400">{((p.value / total) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(p.value / total) * 100}%`, backgroundColor: pieColors[i] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Tax Report */}
          {activeReport === 'tax' && (
            <Card>
              <SectionHeader title="Tax Collection" subtitle="GST breakdown for the period" className="mb-4" />
              <div className="grid grid-cols-3 gap-4">
                {taxData.map(t => (
                  <div key={t.name} className="text-center p-4 rounded-xl bg-surface-50">
                    <p className="text-lg font-bold text-surface-900">{formatCurrency(t.value)}</p>
                    <p className="text-xs text-surface-500 mt-1">{t.name}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Item Sales Table */}
          <Card padding={false}>
            <div className="px-5 pt-5 pb-3">
              <SectionHeader title="Item Performance" subtitle="Top selling items by revenue" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50/80">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase">Item</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase">Category</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-surface-500 uppercase">Price</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-surface-500 uppercase">Qty Sold</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-surface-500 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {itemSales.map(item => (
                    <tr key={item.id} className="hover:bg-surface-50">
                      <td className="px-5 py-3 font-medium text-surface-900">{item.name}</td>
                      <td className="px-5 py-3"><Badge variant="outline" size="sm">{item.categoryId.replace('cat-', '')}</Badge></td>
                      <td className="px-5 py-3 text-right text-surface-600">{formatCurrency(item.price)}</td>
                      <td className="px-5 py-3 text-right font-medium">{item.quantitySold}</td>
                      <td className="px-5 py-3 text-right font-semibold text-surface-900">{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
