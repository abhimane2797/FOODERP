import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Image as ImageIcon, Tag, Layers, Puzzle } from 'lucide-react'
import { Badge, Button, Input, Modal, Select, Textarea, Toggle, Card, Tabs, SearchInput } from '../../components/ui'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { useApi } from '../../hooks'
import { useToast } from '../../hooks/useToast'
import { menuService } from '../../services/menuService'
import type { MenuItem, MenuCategory } from '../../types'
import { formatCurrency, clsx } from '../../utils'

function FoodTypeDot({ type }: { type: string }) {
  return (
    <span className={clsx(
      'inline-flex items-center justify-center w-4 h-4 rounded-sm border-2',
      type === 'veg' ? 'border-success-600' : type === 'non-veg' ? 'border-danger-600' : 'border-warning-600',
    )}>
      <span className={clsx(
        'w-1.5 h-1.5 rounded-full',
        type === 'veg' ? 'bg-success-600' : type === 'non-veg' ? 'bg-danger-600' : 'bg-warning-600',
      )} />
    </span>
  )
}

const categoriesList: MenuCategory[] = [
  { id: 'cat-starters', name: 'Starters', isActive: true, sortOrder: 1 },
  { id: 'cat-main', name: 'Main Course', isActive: true, sortOrder: 2 },
  { id: 'cat-pizza', name: 'Pizza', isActive: true, sortOrder: 3 },
  { id: 'cat-burgers', name: 'Burgers', isActive: true, sortOrder: 4 },
  { id: 'cat-beverages', name: 'Beverages', isActive: true, sortOrder: 5 },
  { id: 'cat-desserts', name: 'Desserts', isActive: true, sortOrder: 6 },
]

export function MenuManagementPage() {
  const { data: items } = useApi<MenuItem[]>(() => menuService.getItems())
  const [tab, setTab] = useState('items')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null)
  const { addToast } = useToast()

  const filtered = useMemo(() => {
    let result = items || []
    if (catFilter !== 'all') result = result.filter(i => i.categoryId === catFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
    }
    return result
  }, [items, catFilter, search])

  const columns: Column<MenuItem>[] = [
    {
      key: 'image', header: '',
      render: item => (
        <img src={item.imageUrl} alt={item.name} className="w-11 h-11 rounded-lg object-cover bg-surface-100" />
      ),
    },
    {
      key: 'name', header: 'Item Name',
      render: item => (
        <div className="flex items-center gap-2">
          <FoodTypeDot type={item.foodType} />
          <div>
            <p className="font-medium text-surface-900">{item.name}</p>
            <p className="text-xs text-surface-400">{item.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: item => categoriesList.find(c => c.id === item.categoryId)?.name || '—' },
    { key: 'price', header: 'Price', align: 'right', render: item => <span className="font-semibold">{formatCurrency(item.price)}</span> },
    { key: 'tax', header: 'Tax', render: item => <span className="text-surface-600">{item.taxPercent}%</span> },
    {
      key: 'foodType', header: 'Type',
      render: item => (
        <Badge variant="outline" size="sm" className={clsx(
          item.foodType === 'veg' ? 'text-success-700 border-success-200' : item.foodType === 'non-veg' ? 'text-danger-700 border-danger-200' : 'text-warning-700 border-warning-200',
        )}>
          {item.foodType === 'non-veg' ? 'Non-Veg' : item.foodType === 'egg' ? 'Egg' : 'Veg'}
        </Badge>
      ),
    },
    { key: 'availability', header: 'Availability', render: item => <Badge variant="status" size="sm">{item.isAvailable ? 'active' : 'inactive'}</Badge> },
    {
      key: 'actions', header: '', align: 'right',
      render: item => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={e => { e.stopPropagation(); setEditingItem(item) }} className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={e => { e.stopPropagation(); setDeleteItem(item) }} className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const tabs = [
    { id: 'categories', label: 'Categories' },
    { id: 'items', label: 'Items', count: items?.length },
    { id: 'variants', label: 'Variants' },
    { id: 'addons', label: 'Add-ons' },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Menu Management</h1>
          <p className="text-sm text-surface-500 mt-0.5">Manage categories, items, variants and add-ons</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          {tab === 'categories' ? 'Add Category' : tab === 'variants' ? 'Add Variant' : tab === 'addons' ? 'Add Add-on' : 'Add Item'}
        </Button>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {/* Categories Tab */}
      {tab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesList.map(cat => (
            <Card key={cat.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">{cat.name}</p>
                    <p className="text-xs text-surface-500">{items?.filter(i => i.categoryId === cat.id).length || 0} items</p>
                  </div>
                </div>
                <Badge variant="status" size="sm">{cat.isActive ? 'active' : 'inactive'}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Items Tab */}
      {tab === 'items' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search items or SKU..." className="flex-1" />
            <Select
              options={[{ value: 'all', label: 'All Categories' }, ...categoriesList.map(c => ({ value: c.id, label: c.name }))]}
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              className="w-48"
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            rowKey={i => i.id}
            onRowClick={setEditingItem}
            emptyMessage="No menu items found"
          />
        </>
      )}

      {/* Variants Tab */}
      {tab === 'variants' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Regular', modifier: 0, count: 18 },
            { name: 'Large', modifier: 80, count: 12 },
            { name: 'Half', modifier: -40, count: 8 },
            { name: 'Full', modifier: 60, count: 10 },
          ].map(v => (
            <Card key={v.name} hover>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-surface-900">{v.name}</p>
                  <p className="text-xs text-surface-500">{v.count} items · {v.modifier >= 0 ? '+' : ''}{formatCurrency(v.modifier)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add-ons Tab */}
      {tab === 'addons' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'Extra Cheese', price: 30, available: true },
            { name: 'Extra Sauce', price: 20, available: true },
            { name: 'Extra Patty', price: 50, available: true },
          ].map(a => (
            <Card key={a.name} hover>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Puzzle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-surface-900">{a.name}</p>
                  <p className="text-xs text-surface-500">+{formatCurrency(a.price)}</p>
                </div>
                <Badge variant="status" size="sm">{a.available ? 'active' : 'inactive'}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Item Modal */}
      <Modal
        open={showAddModal || !!editingItem}
        onClose={() => { setShowAddModal(false); setEditingItem(null) }}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowAddModal(false); setEditingItem(null) }}>Cancel</Button>
            <Button onClick={() => {
              setShowAddModal(false); setEditingItem(null)
              addToast({ type: 'success', title: editingItem ? 'Item Updated' : 'Item Added', message: 'Menu has been updated successfully' })
            }}>
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input label="Item Name" defaultValue={editingItem?.name} placeholder="e.g. Paneer Tikka" />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Description" defaultValue={editingItem?.description} placeholder="Short description of the dish" />
          </div>
          <Select
            label="Category"
            options={categoriesList.map(c => ({ value: c.id, label: c.name }))}
            defaultValue={editingItem?.categoryId}
            placeholder="Select category"
          />
          <Input label="Price (₹)" type="number" defaultValue={editingItem?.price} placeholder="0" />
          <Input label="Tax (%)" type="number" defaultValue={editingItem?.taxPercent || 5} />
          <Input label="SKU" defaultValue={editingItem?.sku} placeholder="e.g. ST-006" />
          <Select
            label="Food Type"
            options={[
              { value: 'veg', label: 'Vegetarian' },
              { value: 'non-veg', label: 'Non-Vegetarian' },
              { value: 'egg', label: 'Egg' },
            ]}
            defaultValue={editingItem?.foodType}
            placeholder="Select type"
          />
          <Input label="Prep Time (min)" type="number" defaultValue={editingItem?.prepTimeMinutes} placeholder="15" />

          {/* Image upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Item Image</label>
            <div className="flex items-center gap-4">
              {editingItem?.imageUrl && (
                <img src={editingItem.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover bg-surface-100" />
              )}
              <div className="flex-1 border-2 border-dashed border-surface-300 rounded-xl p-4 text-center hover:border-primary-400 transition-colors cursor-pointer">
                <ImageIcon className="w-6 h-6 text-surface-400 mx-auto mb-1" />
                <p className="text-sm text-surface-600">Click to upload or drag & drop</p>
                <p className="text-xs text-surface-400 mt-0.5">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Toggle checked={editingItem?.isAvailable ?? true} onChange={() => {}} label="Available for ordering" />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Item" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => {
              setDeleteItem(null)
              addToast({ type: 'success', title: 'Item Deleted', message: `${deleteItem?.name} has been removed` })
            }}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-surface-600">
          Are you sure you want to delete <span className="font-semibold text-surface-900">{deleteItem?.name}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
