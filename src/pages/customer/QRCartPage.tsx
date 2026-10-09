import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import { Button } from '../../components/ui'
import { useCart } from '../../hooks/useCart'
import { useToast } from '../../hooks/useToast'
import { useQRContext } from '../../hooks/useQRContext'
import { placeQROrder } from '../../services/qrOrderService'
import type { QROrderLine } from '../../services/qrOrderService'
import { formatCurrency } from '../../utils'

export function QRCartPage() {
  const navigate = useNavigate()
  const { restaurantId, tableId, restaurant, table, paths } = useQRContext()
  const cart = useCart()
  const { addToast } = useToast()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [placing, setPlacing] = useState(false)

  const tax = Math.max(0, cart.subtotal - discount) * 0.05
  const grandTotal = cart.subtotal - discount + tax

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) return
    setPlacing(true)
    try {
      const lines: QROrderLine[] = cart.items.map(i => ({
        menuItemId: i.id,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.price,
        selectedVariant: i.selectedVariant,
        selectedAddons: i.selectedAddons,
        specialInstructions: i.specialInstructions,
      }))
      const order = await placeQROrder({
        restaurantId,
        tableId,
        items: lines,
        discount,
      })
      setPlacing(false)
      cart.clearCart()
      addToast({ type: 'success', title: `Order #${order.displayNumber} placed`, message: 'Your order is being prepared' })
      navigate(paths.order(order.displayNumber))
    } catch {
      setPlacing(false)
      addToast({ type: 'error', title: 'Order failed', message: 'Please try again' })
    }
  }

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(Math.round(cart.subtotal * 0.1))
      addToast({ type: 'success', title: 'Promo Applied', message: '10% discount applied!' })
    } else {
      addToast({ type: 'error', title: 'Invalid Code', message: 'Try WELCOME10 for 10% off' })
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
<button onClick={() => navigate(paths.menu)} className="p-2 -ml-2 rounded-lg hover:bg-surface-100">
          <ArrowLeft className="w-5 h-5 text-surface-700" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-surface-900">Your Order</h1>
          <p className="text-xs text-surface-500">{table.label} · {restaurant.name}</p>
        </div>
        </div>
      </div>

      {cart.items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-surface-300" />
          </div>
          <h2 className="text-lg font-bold text-surface-900">Your cart is empty</h2>
          <p className="text-sm text-surface-500 mt-1 mb-6">Browse our menu and add some delicious items</p>
          <Button onClick={() => navigate(paths.menu)}>Browse Menu</Button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {cart.items.map(item => {
              const addonTotal = item.selectedAddons.reduce((s, a) => s + a.price, 0)
              const lineTotal = (item.price + addonTotal) * item.quantity
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-surface-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-surface-900">{item.name}</h3>
                      {item.selectedVariant && (
                        <p className="text-xs text-surface-500 mt-0.5">{item.selectedVariant}</p>
                      )}
                      {item.selectedAddons.length > 0 && (
                        <p className="text-xs text-primary-600 mt-0.5">
                          + {item.selectedAddons.map(a => `${a.name} (${formatCurrency(a.price)})`).join(', ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-warning-600 mt-0.5 italic">"{item.specialInstructions}"</p>
                      )}
                    </div>
                    <button
                      onClick={() => cart.removeItem(item.id)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 bg-surface-100 rounded-xl px-2 py-1">
                      <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-surface-900 text-sm">{item.quantity}</span>
                      <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-surface-900">{formatCurrency(lineTotal)}</span>
                  </div>
                </div>
              )
            })}

            {/* Promo code */}
            <div className="bg-white rounded-2xl border border-surface-200 p-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-surface-400 shrink-0" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Promo code (try WELCOME10)"
                  className="flex-1 text-sm placeholder:text-surface-400 focus:outline-none"
                />
                <button
                  onClick={handleApplyPromo}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary + Place Order */}
          <div className="bg-white border-t border-surface-200 px-4 py-4 space-y-3 sticky bottom-0">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-surface-600">
                <span>Subtotal ({cart.totalItems} items)</span>
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
                <span>Total</span>
                <span className="text-primary-700">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
            <Button fullWidth size="lg" loading={placing} onClick={handlePlaceOrder}>
              {placing ? 'Placing Order...' : `Place Order · ${formatCurrency(grandTotal)}`}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
