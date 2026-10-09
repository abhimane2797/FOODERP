import { useState, useMemo, useCallback } from 'react'
import {
  Search, Plus, Minus, Trash2, Pause, Send, Save, CreditCard,
  ShoppingBag, Tag, Percent, User, Hash,
} from 'lucide-react'
import { Button, Input, Badge, Modal } from '../../components/ui'
import { useCart } from '../../hooks/useCart'
import { useToast } from '../../hooks/useToast'
import { menuItems, menuCategories } from '../../mock/mockMenu'
import { mockTables } from '../../mock/mockTables'
import type { MenuItem } from '../../types'
import { formatCurrency, clsx } from '../../utils'

const categories = [{ id: 'all', name: 'All' }, ...menuCategories.filter(c => c.isActive)]

function FoodTypeDot({ type }: { type: string }) {
  return (
    <span className={clsx(
      'inline-flex items-center justify-center w-4 h-4 rounded-sm border-2 shrink-0',
      type === 'veg' ? 'border-success-600' : type === 'non-veg' ? 'border-danger-600' : 'border-warning-600',
    )}>
      <span className={clsx(
        'w-1.5 h-1.5 rounded-full',
        type === 'veg' ? 'bg-success-600' : type === 'non-veg' ? 'bg-danger-600' : 'bg-warning-600',
      )} />
    </span>
  )
}

function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  return (
    <button
      onClick={() => item.isAvailable && onAdd(item)}
      disabled={!item.isAvailable}
      className={clsx(
        'group relative bg-white rounded-xl border border-surface-200 overflow-hidden text-left transition-all duration-200',
        item.isAvailable
          ? 'hover:border-primary-300 hover:shadow-md active:scale-[0.98] cursor-pointer'
          : 'opacity-50 cursor-not-allowed',
      )}
    >
      <div className="relative h-28 bg-surface-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
        />
        <div className="absolute top-2 left-2">
          <FoodTypeDot type={item.foodType} />
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-surface-900/50 flex items-center justify-center">
            <span className="text-xs font-semibold text-white bg-surface-900/60 px-2 py-1 rounded-md">Unavailable</span>
          </div>
        )}
        {item.isBestSeller && (
          <span className="absolute top-2 right-2 text-[10px] font-bold text-white bg-amber-500 px-1.5 py-0.5 rounded-md">★ Popular</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-surface-900 truncate">{item.name}</p>
        <p className="text-xs text-surface-500 truncate mt-0.5">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-surface-900">{formatCurrency(item.price)}</span>
          <span className="text-[11px] text-surface-400">{item.prepTimeMinutes} min</span>
        </div>
      </div>
    </button>
  )
}

export function POSPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('cash')
  const [discount, setDiscount] = useState(0)
  const [selectedTable, setSelectedTable] = useState('')
  const [customerName, setCustomerName] = useState('')
  const cart = useCart()
  const { addToast } = useToast()

  const filteredItems = useMemo(() => {
    let items = menuItems.filter(i => i.isAvailable)
    if (activeCategory !== 'all') items = items.filter(i => i.categoryId === activeCategory)
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(i => i.name.toLowerCase().includes(q))
    }
    return items
  }, [activeCategory, search])

  const tax = (cart.subtotal - discount) * 0.05
  const grandTotal = cart.subtotal - discount + tax

  const handleAdd = useCallback((item: MenuItem) => {
    cart.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      foodType: item.foodType,
      imageUrl: item.imageUrl,
      selectedAddons: [],
    })
    addToast({ type: 'success', title: item.name, message: 'Added to order' })
  }, [cart, addToast])

  const handleHold = () => {
    addToast({ type: 'info', title: 'Order Held', message: 'Order saved as hold. You can resume it later.' })
    cart.clearCart()
  }

  const handleKOT = () => {
    addToast({ type: 'success', title: 'KOT Sent', message: 'Kitchen Order Ticket sent to kitchen.' })
  }

  const handleSave = () => {
    addToast({ type: 'success', title: 'Order Saved', message: 'Order has been saved successfully.' })
    cart.clearCart()
  }

  const handlePay = () => {
    if (cart.items.length === 0) return
    setShowPayment(true)
  }

  const handlePaymentConfirm = () => {
    setShowPayment(false)
    addToast({ type: 'success', title: 'Payment Successful', message: `${formatCurrency(grandTotal)} received via ${selectedPayment.toUpperCase()}` })
    cart.clearCart()
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT: Categories */}
      <div className="lg:w-44 xl:w-52 bg-white border-r border-surface-200 shrink-0 overflow-y-auto">
        <div className="p-3 space-y-1">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-2 py-2">Categories</p>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={clsx(
                'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeCategory === cat.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-surface-600 hover:bg-surface-50',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* CENTER: Menu Items */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="p-4 bg-white border-b border-surface-200 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-50 border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-3">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} onAdd={handleAdd} />
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-surface-300 mb-3" />
              <p className="text-sm font-medium text-surface-500">No items found</p>
              <p className="text-xs text-surface-400 mt-1">Try a different search or category</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Cart */}
      <div className="lg:w-[360px] xl:w-[400px] bg-white border-l border-surface-200 flex flex-col shrink-0">
        {/* Cart Header */}
        <div className="p-4 border-b border-surface-200 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
              <select
                value={selectedTable}
                onChange={e => setSelectedTable(e.target.value)}
                className="w-full h-9 pl-8 pr-2 rounded-lg border border-surface-200 bg-surface-50 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Select Table</option>
                {mockTables.filter(t => t.status === 'available').map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.seats} seats)</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Customer"
                className="w-full h-9 pl-8 pr-2 rounded-lg border border-surface-200 bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <h3 className="text-sm font-semibold text-surface-900">Current Order</h3>
            <Badge variant="outline" size="sm">{cart.totalItems} items</Badge>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-surface-300" />
              </div>
              <p className="text-sm font-medium text-surface-500">Cart is empty</p>
              <p className="text-xs text-surface-400 mt-1">Tap items on the left to add them</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {cart.items.map(item => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <FoodTypeDot type={item.foodType} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{item.name}</p>
                      <p className="text-xs text-surface-500 mt-0.5">{formatCurrency(item.price)} each</p>
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[11px] text-primary-600 mt-0.5">
                          + {item.selectedAddons.map(a => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md bg-surface-100 hover:bg-surface-200 flex items-center justify-center text-surface-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-surface-900">{item.quantity}</span>
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md bg-primary-600 hover:bg-primary-700 flex items-center justify-center text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right ml-2 min-w-[60px]">
                      <p className="text-sm font-semibold text-surface-900">
                        {formatCurrency((item.price + item.selectedAddons.reduce((s, a) => s + a.price, 0)) * item.quantity)}
                      </p>
                      <button
                        onClick={() => cart.removeItem(item.id)}
                        className="text-surface-400 hover:text-danger-500 mt-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-surface-200 p-4 space-y-3 shrink-0">
            {/* Discount */}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-surface-400" />
              <input
                type="number"
                value={discount || ''}
                onChange={e => setDiscount(Number(e.target.value) || 0)}
                placeholder="Discount ₹"
                className="flex-1 h-8 px-3 rounded-lg border border-surface-200 bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <button
                onClick={() => setDiscount(Math.round(cart.subtotal * 0.1))}
                className="h-8 px-2.5 rounded-lg bg-surface-100 text-xs font-medium text-surface-600 hover:bg-surface-200 transition-colors"
              >
                <Percent className="w-3 h-3 inline mr-0.5" />10%
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-surface-600">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-surface-600">
                <span>Tax (5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-surface-900 pt-2 border-t border-surface-200">
                <span>Grand Total</span>
                <span className="text-primary-700">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button variant="secondary" size="sm" onClick={handleHold} icon={<Pause className="w-3.5 h-3.5" />} className="flex-col h-auto py-2 gap-1">
                <span className="text-[10px]">Hold</span>
              </Button>
              <Button variant="warning" size="sm" onClick={handleKOT} icon={<Send className="w-3.5 h-3.5" />} className="flex-col h-auto py-2 gap-1">
                <span className="text-[10px]">KOT</span>
              </Button>
              <Button variant="secondary" size="sm" onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />} className="flex-col h-auto py-2 gap-1">
                <span className="text-[10px]">Save</span>
              </Button>
              <Button variant="success" size="sm" onClick={handlePay} icon={<CreditCard className="w-3.5 h-3.5" />} className="flex-col h-auto py-2 gap-1">
                <span className="text-[10px]">Pay</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Modal open={showPayment} onClose={() => setShowPayment(false)} title="Process Payment" size="sm">
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="text-sm text-surface-500">Amount to Pay</p>
            <p className="text-3xl font-bold text-surface-900 mt-1">{formatCurrency(grandTotal)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'cash', label: 'Cash', icon: '💵' },
              { id: 'upi', label: 'UPI', icon: '📱' },
              { id: 'card', label: 'Card', icon: '💳' },
              { id: 'online', label: 'Online', icon: '🌐' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedPayment(m.id)}
                className={clsx(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  selectedPayment === m.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-surface-200 hover:border-surface-300',
                )}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className={clsx(
                  'text-sm font-medium',
                  selectedPayment === m.id ? 'text-primary-700' : 'text-surface-600',
                )}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          {selectedPayment === 'cash' && (
            <Input label="Cash Received" type="number" placeholder={String(Math.ceil(grandTotal))} />
          )}

          <Button fullWidth size="lg" variant="success" onClick={handlePaymentConfirm}>
            Confirm Payment · {formatCurrency(grandTotal)}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
