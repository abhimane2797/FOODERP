import { useState, useMemo } from 'react'
import { Plus, Receipt, TrendingUp, Clock, DollarSign, Download } from 'lucide-react'
import { Badge, Button, Card, StatCard, Modal, Input, Select, SearchInput, SectionHeader } from '../../components/ui'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { useApi } from '../../hooks'
import { useToast } from '../../hooks/useToast'
import { mockExpenses } from '../../mock/mockOperations'
import type { Expense } from '../../types'
import { formatCurrency, formatDate, clsx } from '../../utils'

const categories = ['Rent', 'Electricity', 'Gas', 'Salary', 'Maintenance', 'Transport', 'Other']

const categoryColors: Record<string, string> = {
  Rent: 'bg-blue-50 text-blue-700',
  Electricity: 'bg-amber-50 text-amber-700',
  Gas: 'bg-orange-50 text-orange-700',
  Salary: 'bg-purple-50 text-purple-700',
  Maintenance: 'bg-cyan-50 text-cyan-700',
  Transport: 'bg-green-50 text-green-700',
  Other: 'bg-surface-100 text-surface-600',
}

export function ExpensesPage() {
  const { data: expenses } = useApi<Expense[]>(() => Promise.resolve(mockExpenses))
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const { addToast } = useToast()

  const filtered = useMemo(() => {
    let result = expenses || []
    if (catFilter !== 'all') result = result.filter(e => e.category === catFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(e => e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
    }
    return result
  }, [expenses, catFilter, search])

  const stats = useMemo(() => {
    const all = expenses || []
    return {
      today: all.filter(e => e.date === '2026-10-08').reduce((s, e) => s + e.amount, 0),
      thisMonth: all.filter(e => e.date.startsWith('2026-10')).reduce((s, e) => s + e.amount, 0),
      pending: all.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
      total: all.reduce((s, e) => s + e.amount, 0),
    }
  }, [expenses])

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of expenses || []) {
      map.set(e.category, (map.get(e.category) || 0) + e.amount)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [expenses])

  const maxCatAmount = Math.max(...categoryBreakdown.map(([, v]) => v), 1)

  const columns: Column<Expense>[] = [
    { key: 'date', header: 'Date', render: e => <span className="text-surface-600">{formatDate(e.date)}</span> },
    { key: 'category', header: 'Category', render: e => (
      <span className={clsx('inline-flex px-2 py-1 text-xs font-medium rounded-md', categoryColors[e.category] || categoryColors.Other)}>
        {e.category}
      </span>
    )},
    { key: 'description', header: 'Description', render: e => <span className="text-surface-700">{e.description}</span> },
    { key: 'amount', header: 'Amount', align: 'right', render: e => <span className="font-semibold text-surface-900">{formatCurrency(e.amount)}</span> },
    { key: 'paymentMethod', header: 'Payment', render: e => <Badge variant="outline" size="sm" className="uppercase">{e.paymentMethod}</Badge> },
    { key: 'addedBy', header: 'Added By', render: e => <span className="text-surface-600">{e.addedBy}</span> },
    { key: 'status', header: 'Status', render: e => <Badge variant="status" size="sm">{e.status}</Badge> },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Expenses</h1>
          <p className="text-sm text-surface-500 mt-0.5">Track and manage business expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>Add Expense</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Expenses" value={formatCurrency(stats.today)} icon={<Receipt className="w-5 h-5" />} iconBg="bg-primary-50 text-primary-600" />
        <StatCard title="This Month" value={formatCurrency(stats.thisMonth)} icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard title="Pending Approval" value={formatCurrency(stats.pending)} icon={<Clock className="w-5 h-5" />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard title="Total Expenses" value={formatCurrency(stats.total)} icon={<DollarSign className="w-5 h-5" />} iconBg="bg-danger-50 text-danger-600" />
      </div>

      {/* Category breakdown */}
      <Card>
        <SectionHeader title="Category Breakdown" subtitle="This month" className="mb-4" />
        <div className="space-y-3">
          {categoryBreakdown.map(([cat, amount]) => (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-surface-700">{cat}</span>
                <span className="text-sm font-semibold text-surface-900">{formatCurrency(amount)}</span>
              </div>
              <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${(amount / maxCatAmount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search expenses..." className="flex-1" />
        <Select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          options={[{ value: 'all', label: 'All Categories' }, ...categories.map(c => ({ value: c, label: c }))]}
          className="w-48"
        />
      </div>

      <DataTable columns={columns} data={filtered} rowKey={e => e.id} emptyMessage="No expenses found" />

      {/* Add Expense Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Expense" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={() => { setShowAdd(false); addToast({ type: 'success', title: 'Expense Added', message: 'Expense has been recorded' }) }}>Save Expense</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Category" options={categories.map(c => ({ value: c, label: c }))} placeholder="Select category" />
          <Input label="Description" placeholder="Brief description" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount (₹)" type="number" placeholder="0" />
            <Input label="Date" type="date" />
          </div>
          <Select label="Payment Method" options={[{ value: 'cash', label: 'Cash' }, { value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }, { value: 'online', label: 'Online' }]} placeholder="Method" />
        </div>
      </Modal>
    </div>
  )
}
