import { useState, useMemo } from 'react'
import { Users, UserPlus, Repeat, Crown, Eye, Phone, Mail, Star } from 'lucide-react'
import { Badge, Button, Card, StatCard, Drawer, Tabs, SearchInput, Avatar } from '../../components/ui'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { useApi } from '../../hooks'
import { customerService } from '../../services/customerService'
import type { Customer } from '../../types'
import { formatCurrency, formatDate } from '../../utils'

export function CustomersPage() {
  const { data: customers } = useApi<Customer[]>(() => customerService.getCustomers())
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Customer | null>(null)

  const filtered = useMemo(() => {
    let result = customers || []
    if (tab !== 'all') result = result.filter(c => c.status === tab)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q))
    }
    return result
  }, [customers, tab, search])

  const stats = useMemo(() => {
    const all = customers || []
    return {
      total: all.length,
      newThisMonth: all.filter(c => c.lastOrderDate >= '2026-10-01').length,
      returning: all.filter(c => c.totalOrders > 5).length,
      vip: all.filter(c => c.status === 'vip').length,
    }
  }, [customers])

  const topCustomers = useMemo(() =>
    [...(customers || [])].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5),
  [customers])

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Customer', render: c => (
      <div className="flex items-center gap-3">
        <Avatar name={c.name} size="sm" />
        <div>
          <p className="font-medium text-surface-900">{c.name}</p>
          <p className="text-xs text-surface-400">{c.phone}</p>
        </div>
      </div>
    )},
    { key: 'totalOrders', header: 'Orders', align: 'center', render: c => <span className="font-medium">{c.totalOrders}</span> },
    { key: 'totalSpent', header: 'Total Spent', align: 'right', render: c => <span className="font-semibold text-surface-900">{formatCurrency(c.totalSpent)}</span> },
    { key: 'averageOrderValue', header: 'Avg Order', align: 'right', render: c => <span className="text-surface-600">{formatCurrency(c.averageOrderValue)}</span> },
    { key: 'lastOrderDate', header: 'Last Order', render: c => <span className="text-surface-500">{formatDate(c.lastOrderDate)}</span> },
    { key: 'status', header: 'Status', render: c => <Badge variant="status" size="sm">{c.status}</Badge> },
    {
      key: 'actions', header: '', align: 'right',
      render: c => (
        <button onClick={e => { e.stopPropagation(); setSelected(c) }} className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50">
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Customers</h1>
          <p className="text-sm text-surface-500 mt-0.5">Customer relationship management</p>
        </div>
        <Button icon={<UserPlus className="w-4 h-4" />}>Add Customer</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={String(stats.total)} icon={<Users className="w-5 h-5" />} iconBg="bg-primary-50 text-primary-600" />
        <StatCard title="New This Month" value={String(stats.newThisMonth)} icon={<UserPlus className="w-5 h-5" />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard title="Returning" value={String(stats.returning)} icon={<Repeat className="w-5 h-5" />} iconBg="bg-success-50 text-success-600" />
        <StatCard title="VIP Customers" value={String(stats.vip)} icon={<Crown className="w-5 h-5" />} iconBg="bg-amber-50 text-amber-600" />
      </div>

      {/* Top Customers */}
      <Card>
        <h3 className="text-base font-semibold text-surface-900 mb-4">Top Customers by Spending</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topCustomers.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-left"
            >
              <span className="w-6 text-center text-sm font-bold text-surface-400">#{i + 1}</span>
              <Avatar name={c.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate">{c.name}</p>
                <p className="text-xs text-surface-500">{formatCurrency(c.totalSpent)}</p>
              </div>
              {c.status === 'vip' && <Star className="w-4 h-4 text-amber-500 shrink-0" />}
            </button>
          ))}
        </div>
      </Card>

      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: customers?.length },
          { id: 'active', label: 'Active', count: customers?.filter(c => c.status === 'active').length },
          { id: 'vip', label: 'VIP', count: customers?.filter(c => c.status === 'vip').length },
          { id: 'inactive', label: 'Inactive', count: customers?.filter(c => c.status === 'inactive').length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search by name or phone..." className="max-w-md" />

      <DataTable columns={columns} data={filtered} rowKey={c => c.id} onRowClick={setSelected} emptyMessage="No customers found" />

      {/* Customer Profile Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} size="lg">
        {selected && (
          <div className="p-6 space-y-6">
            {/* Profile header */}
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-surface-900">{selected.name}</h3>
                  <Badge variant="status" size="sm">{selected.status}</Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-surface-500">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selected.phone}</span>
                  {selected.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selected.email}</span>}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Orders', value: String(selected.totalOrders) },
                { label: 'Total Spent', value: formatCurrency(selected.totalSpent) },
                { label: 'Avg Order', value: formatCurrency(selected.averageOrderValue) },
              ].map(s => (
                <Card key={s.label} padding className="text-center bg-surface-50">
                  <p className="text-lg font-bold text-surface-900">{s.value}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Loyalty */}
            <Card padding className="bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-800">Loyalty Points</p>
                  <p className="text-2xl font-bold text-primary-900">{selected.loyaltyPoints}</p>
                </div>
                <Star className="w-8 h-8 text-primary-400" />
              </div>
            </Card>

            {/* Favorite Items */}
            <div>
              <p className="text-xs text-surface-400 font-medium uppercase tracking-wider mb-3">Favorite Items</p>
              <div className="flex flex-wrap gap-2">
                {selected.favoriteItems.map(item => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>

            {/* Order History */}
            <div>
              <p className="text-xs text-surface-400 font-medium uppercase tracking-wider mb-3">Order History</p>
              <div className="space-y-2">
                {selected.orderHistory.map(oh => (
                  <div key={oh.orderId} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-900">{oh.orderId}</p>
                      <p className="text-xs text-surface-500 truncate mt-0.5">{oh.items}</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">{formatDate(oh.date)}</p>
                    </div>
                    <span className="text-sm font-semibold text-surface-900 shrink-0 ml-3">{formatCurrency(oh.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
