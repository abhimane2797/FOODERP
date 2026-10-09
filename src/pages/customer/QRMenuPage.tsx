import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ShoppingBag, Star, Utensils, X, Plus, Minus,
  Bell, Droplets, Receipt, ConciergeBell, XCircle,
} from 'lucide-react'
import { Button, Modal } from '../../components/ui'
import { useCart } from '../../hooks/useCart'
import { useToast } from '../../hooks/useToast'
import { useQRContext } from '../../hooks/useQRContext'
import { getQRMenu } from '../../services/qrMenuService'
import { menuItems, menuCategories } from '../../mock/mockMenu'
import type { MenuItem, MenuCategory } from '../../types'
import { formatCurrency, clsx } from '../../utils'

function FoodTypeDot({ type, size = 'sm' }: { type: string; size?: 'sm' | 'md' }) {
  return (
    <span className={clsx(
      'inline-flex items-center justify-center rounded-sm border-2 shrink-0',
      size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
      type === 'veg' ? 'border-success-600' : type === 'non-veg' ? 'border-danger-600' : 'border-warning-600',
    )}>
      <span className={clsx(
        'rounded-full',
        size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5',
        type === 'veg' ? 'bg-success-600' : type === 'non-veg' ? 'bg-danger-600' : 'bg-warning-600',
      )} />
    </span>
  )
}

function ServiceRequestButtons({ tableId }: { tableId: string }) {
  const { addToast } = useToast()
  const [showConfirm, setShowConfirm] = useState<string | null>(null)

  const requests = [
    { id: 'call-waiter', label: 'Call Waiter', icon: Bell, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'request-water', label: 'Request Water', icon: Droplets, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'request-bill', label: 'Request Bill', icon: Receipt, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'request-service', label: 'Request Service', icon: ConciergeBell, color: 'bg-green-50 text-green-700 border-green-200' },
  ]

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {requests.map(r => (
          <button
            key={r.id}
            onClick={() => setShowConfirm(r.id)}
            className={clsx('flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all active:scale-95', r.color)}
          >
            <r.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium text-center leading-tight">{r.label}</span>
          </button>
        ))}
      </div>

      <Modal open={!!showConfirm} onClose={() => setShowConfirm(null)} size="sm" title="Confirm Request">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <ConciergeBell className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-sm text-surface-600 mb-1">
            Send <span className="font-semibold text-surface-900">{requests.find(r => r.id === showConfirm)?.label}</span> request?
          </p>
          <p className="text-xs text-surface-400">Table {tableId}</p>
        </div>
        <Button fullWidth onClick={() => {
          addToast({ type: 'success', title: 'Waiter Notified', message: 'Your request has been sent to the staff.' })
          setShowConfirm(null)
        }}>
          Send Request
        </Button>
      </Modal>
    </>
  )
}

function ItemDetailModal({
  item, open, onClose, onAdd,
}: {
  item: MenuItem | null
  open: boolean
  onClose: () => void
  onAdd: (item: MenuItem, qty: number, unitPrice: number, variant?: string, instructions?: string, addons?: { name: string; price: number }[]) => void
}) {
  const [qty, setQty] = useState(1)
  const [variant, setVariant] = useState<string | undefined>()
  const [instructions, setInstructions] = useState('')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  if (!item) return null

  const activeVariant = item.variants.find(v => v.id === variant)
  const addonTotal = item.addons.filter(a => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price, 0)
  const unitPrice = item.price + (activeVariant?.priceModifier || 0) + addonTotal
  const total = unitPrice * qty

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="-m-6 mb-0">
        <div className="relative h-56 bg-surface-100">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
            <X className="w-4 h-4 text-surface-700" />
          </button>
          <div className="absolute bottom-3 left-3">
            <FoodTypeDot type={item.foodType} size="md" />
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-surface-900">{item.name}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-surface-700">{item.rating}</span>
              </div>
            </div>
            <p className="text-sm text-surface-500 mt-1">{item.description}</p>
            <p className="text-xs text-surface-400 mt-1">⏱ {item.prepTimeMinutes} min preparation</p>
          </div>

          {/* Variants */}
          {item.variants.length > 1 && (
            <div>
              <p className="text-sm font-medium text-surface-700 mb-2">Choose Size</p>
              <div className="flex gap-2">
                {item.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v.id)}
                    className={clsx(
                      'flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all',
                      variant === v.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-surface-200 text-surface-600',
                    )}
                  >
                    {v.name}
                    {v.priceModifier !== 0 && (
                      <span className="block text-xs font-normal mt-0.5">
                        {v.priceModifier > 0 ? '+' : ''}{formatCurrency(v.priceModifier)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {item.addons.length > 0 && (
            <div>
              <p className="text-sm font-medium text-surface-700 mb-2">Add-ons</p>
              <div className="space-y-2">
                {item.addons.map(a => (
                  <label key={a.id} className="flex items-center justify-between p-3 rounded-xl border border-surface-200 cursor-pointer hover:bg-surface-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(a.id)}
                        onChange={e => {
                          setSelectedAddons(prev =>
                            e.target.checked ? [...prev, a.id] : prev.filter(id => id !== a.id)
                          )
                        }}
                        className="w-4 h-4 rounded border-surface-300 text-primary-600"
                      />
                      <span className="text-sm text-surface-700">{a.name}</span>
                    </div>
                    <span className="text-sm font-medium text-surface-600">+{formatCurrency(a.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Special instructions */}
          <div>
            <p className="text-sm font-medium text-surface-700 mb-2">Special Instructions</p>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, no onions..."
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-3 bg-surface-100 rounded-xl px-2 py-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-surface-900">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button
              className="flex-1 h-12 text-base"
              onClick={() => {
                onAdd(item, qty, unitPrice, activeVariant?.name, instructions, item.addons.filter(a => selectedAddons.includes(a.id)))
                onClose()
                setQty(1)
                setVariant(undefined)
                setInstructions('')
                setSelectedAddons([])
              }}
            >
              Add · {formatCurrency(total)}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export function QRMenuPage() {
  const navigate = useNavigate()
  const { restaurantId, restaurant, table, paths } = useQRContext()
  const cart = useCart()
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Load the menu for this restaurant via the service layer.
  // Falls back to the shared mock catalogue while loading.
  const [categories, setCategories] = useState<MenuCategory[]>(menuCategories.filter(c => c.isActive))
  const [items, setItems] = useState<MenuItem[]>(menuItems.filter(i => i.isAvailable))

  useEffect(() => {
    let cancelled = false
    getQRMenu(restaurantId).then(menu => {
      if (!cancelled) {
        setCategories(menu.categories)
        setItems(menu.items)
      }
    })
    return () => { cancelled = true }
  }, [restaurantId])

  const filteredItems = useMemo(() => {
    let result = items
    if (activeCategory !== 'all') result = result.filter(i => i.categoryId === activeCategory)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
    }
    return result
  }, [items, activeCategory, search])

  const handleAdd = (
    item: MenuItem,
    qty: number,
    unitPrice: number,
    variant?: string,
    instructions?: string,
    addons?: { name: string; price: number }[],
  ) => {
    cart.addItem({
      id: item.id,
      name: item.name,
      price: unitPrice,
      foodType: item.foodType,
      imageUrl: item.imageUrl,
      selectedVariant: variant,
      selectedAddons: addons || [],
      specialInstructions: instructions,
    }, qty)
    addToast({ type: 'success', title: `${item.name} added`, message: `×${qty} added to your order` })
  }

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId)
    categoryRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{restaurant.name}</h1>
            <p className="text-xs text-primary-200">{restaurant.tagline}</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
          {table.label}
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for food..."
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      {/* Service Requests */}
      <div className="px-4 -mt-4 relative z-10">
        <ServiceRequestButtons tableId={table.label.replace(/^Table\s*/i, '')} />
      </div>

      {/* Category pills */}
      <div className="sticky top-0 z-20 bg-surface-50/95 backdrop-blur-md py-3 px-4 border-b border-surface-200 mt-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-white text-surface-600 border border-surface-200',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4 space-y-6">
        {activeCategory === 'all' && !search ? (
          // Group by category
          categories.map(cat => {
            const catItems = items.filter(i => i.categoryId === cat.id)
            if (catItems.length === 0) return null
            return (
              <div key={cat.id} ref={el => { categoryRefs.current[cat.id] = el }}>
                <h2 className="text-base font-bold text-surface-900 mb-3">{cat.name.toUpperCase()}</h2>
                <div className="space-y-3">
                  {catItems.map(item => (
                    <FoodCard key={item.id} item={item} onClick={() => { setSelectedItem(item); setShowDetail(true) }} />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="space-y-3">
            {filteredItems.map(item => (
              <FoodCard key={item.id} item={item} onClick={() => { setSelectedItem(item); setShowDetail(true) }} />
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <XCircle className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-sm text-surface-500">No items found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Cart Bar */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 z-30">
          <button
            onClick={() => navigate(paths.cart)}
            className="w-full h-14 bg-primary-600 text-white rounded-2xl shadow-xl shadow-primary-600/30 flex items-center justify-between px-5 hover:bg-primary-700 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-semibold">{cart.totalItems} item{cart.totalItems > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatCurrency(cart.subtotal)}</span>
              <span className="text-primary-200">→</span>
            </div>
          </button>
        </div>
      )}

      <ItemDetailModal
        item={selectedItem}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onAdd={handleAdd}
      />
    </div>
  )
}

function FoodCard({ item, onClick }: { item: MenuItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex gap-3 bg-white rounded-2xl border border-surface-200 overflow-hidden text-left hover:shadow-md active:scale-[0.98] transition-all p-3"
    >
      <div className="w-24 h-24 rounded-xl bg-surface-100 overflow-hidden shrink-0">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-1.5">
          <FoodTypeDot type={item.foodType} />
          {item.isBestSeller && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">★ Bestseller</span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-surface-900 mt-1 truncate">{item.name}</h3>
        <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">{item.description}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-sm font-bold text-surface-900">{formatCurrency(item.price)}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-surface-600">{item.rating}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
