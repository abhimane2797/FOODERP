import { useState, useMemo } from 'react'
import { Plus, Package, AlertTriangle, XCircle, DollarSign, ArrowDownUp, History } from 'lucide-react'
import { Badge, Button, StatCard, Modal, Input, Select, Tabs, SearchInput } from '../../components/ui'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { useApi } from '../../hooks'
import { useToast } from '../../hooks/useToast'
import { inventoryService } from '../../services/inventoryService'
import type { InventoryItem, StockAdjustment } from '../../types'
import { formatCurrency, formatDate, clsx } from '../../utils'

export function InventoryPage() {
  const { data: items } = useApi<InventoryItem[]>(() => inventoryService.getItems())
  const { data: adjustments } = useApi<StockAdjustment[]>(() => inventoryService.getAdjustments())
  const [tab, setTab] = useState('inventory')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [showAdjust, setShowAdjust] = useState(false)
  const { addToast } = useToast()

  const filtered = useMemo(() => {
    let result = items || []
    if (statusFilter !== 'all') result = result.filter(i => i.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
    }
    return result
  }, [items, statusFilter, search])

  const stats = useMemo(() => {
    const all = items || []
    return {
      total: all.length,
      lowStock: all.filter(i => i.status === 'low-stock').length,
      outOfStock: all.filter(i => i.status === 'out-of-stock').length,
      value: all.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0),
    }
  }, [items])

  const columns: Column<InventoryItem>[] = [
    { key: 'name', header: 'Ingredient', render: i => (
      <div>
        <p className="font-medium text-surface-900">{i.name}</p>
        {i.supplier && <p className="text-xs text-surface-400">{i.supplier}</p>}
      </div>
    )},
    { key: 'sku', header: 'SKU', render: i => <span className="font-mono text-xs text-surface-500">{i.sku}</span> },
    { key: 'category', header: 'Category', render: i => <Badge variant="outline" size="sm">{i.category}</Badge> },
    { key: 'currentStock', header: 'Current Stock', align: 'right', render: i => (
      <span className={clsx('font-semibold', i.status === 'out-of-stock' ? 'text-danger-600' : i.status === 'low-stock' ? 'text-warning-600' : 'text-surface-900')}>
        {i.currentStock} {i.unit}
      </span>
    )},
    { key: 'minStock', header: 'Min Stock', align: 'right', render: i => <span className="text-surface-500">{i.minStock} {i.unit}</span> },
    { key: 'cost', header: 'Cost/Unit', align: 'right', render: i => <span className="text-surface-600">{formatCurrency(i.costPerUnit)}</span> },
    { key: 'status', header: 'Status', render: i => <Badge variant="status" size="sm" dot>{i.status}</Badge> },
  ]

  const adjustmentColumns: Column<StockAdjustment>[] = [
    { key: 'date', header: 'Date', render: a => formatDate(a.date) },
    { key: 'itemName', header: 'Item', render: a => <span className="font-medium text-surface-900">{a.itemName}</span> },
    { key: 'adjustment', header: 'Adjustment', align: 'right', render: a => (
      <span className={clsx('font-semibold', a.adjustment > 0 ? 'text-success-600' : 'text-danger-600')}>
        {a.adjustment > 0 ? '+' : ''}{a.adjustment}
      </span>
    )},
    { key: 'type', header: 'Type', render: a => <Badge variant="outline" size="sm">{a.type}</Badge> },
    { key: 'reason', header: 'Reason', render: a => <span className="text-surface-600">{a.reason}</span> },
    { key: 'performedBy', header: 'By', render: a => <span className="text-surface-600">{a.performedBy}</span> },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Inventory</h1>
          <p className="text-sm text-surface-500 mt-0.5">Track ingredients and stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<History className="w-4 h-4" />} onClick={() => setTab('history')}>Stock History</Button>
          <Button variant="outline" size="sm" icon={<ArrowDownUp className="w-4 h-4" />} onClick={() => setShowAdjust(true)}>Adjustment</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>Add Item</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={String(stats.total)} icon={<Package className="w-5 h-5" />} iconBg="bg-primary-50 text-primary-600" />
        <StatCard title="Low Stock" value={String(stats.lowStock)} icon={<AlertTriangle className="w-5 h-5" />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard title="Out of Stock" value={String(stats.outOfStock)} icon={<XCircle className="w-5 h-5" />} iconBg="bg-danger-50 text-danger-600" />
        <StatCard title="Inventory Value" value={formatCurrency(stats.value)} icon={<DollarSign className="w-5 h-5" />} iconBg="bg-success-50 text-success-600" />
      </div>

      <Tabs
        tabs={[{ id: 'inventory', label: 'Inventory', count: items?.length }, { id: 'history', label: 'Stock History', count: adjustments?.length }]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'inventory' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search ingredients..." className="flex-1" />
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'in-stock', label: 'In Stock' },
                { value: 'low-stock', label: 'Low Stock' },
                { value: 'out-of-stock', label: 'Out of Stock' },
              ]}
              className="w-44"
            />
          </div>
          <DataTable columns={columns} data={filtered} rowKey={i => i.id} emptyMessage="No inventory items found" />
        </>
      )}

      {tab === 'history' && (
        <DataTable columns={adjustmentColumns} data={adjustments || []} rowKey={a => a.id} emptyMessage="No stock adjustments recorded" />
      )}

      {/* Add Item Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Inventory Item" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={() => { setShowAdd(false); addToast({ type: 'success', title: 'Item Added', message: 'Inventory item has been created' }) }}>Add Item</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Item Name" placeholder="e.g. Capsicum" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="SKU" placeholder="ING-013" />
            <Input label="Category" placeholder="Vegetables" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Current Stock" type="number" placeholder="0" />
            <Select label="Unit" options={[{ value: 'kg', label: 'Kg' }, { value: 'L', label: 'Litres' }, { value: 'pcs', label: 'Pieces' }, { value: 'g', label: 'Grams' }]} placeholder="Unit" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Minimum Stock" type="number" placeholder="0" />
            <Input label="Cost per Unit (₹)" type="number" placeholder="0" />
          </div>
        </div>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal open={showAdjust} onClose={() => setShowAdjust(false)} title="Stock Adjustment" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAdjust(false)}>Cancel</Button>
            <Button onClick={() => { setShowAdjust(false); addToast({ type: 'success', title: 'Stock Adjusted', message: 'Inventory has been updated' }) }}>Apply Adjustment</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Item" options={(items || []).map(i => ({ value: i.id, label: i.name }))} placeholder="Select item" />
          <Select label="Adjustment Type" options={[{ value: 'add', label: 'Add Stock' }, { value: 'remove', label: 'Remove Stock' }, { value: 'set', label: 'Set Exact Quantity' }]} placeholder="Type" />
          <Input label="Quantity" type="number" placeholder="0" />
          <Input label="Reason" placeholder="e.g. New delivery, wastage..." />
        </div>
      </Modal>
    </div>
  )
}
