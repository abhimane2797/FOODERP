import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  foodType: string
  imageUrl: string
  selectedVariant?: string
  selectedAddons: { name: string; price: number }[]
  specialInstructions?: string
}

interface CartContextValue {
  items: CartItem[]
  tableId: string
  customerName: string
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  setTableId: (id: string) => void
  setCustomerName: (name: string) => void
  subtotal: number
  totalItems: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [tableId, setTableId] = useState('')
  const [customerName, setCustomerName] = useState('')

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedVariant === item.selectedVariant)
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.selectedVariant === item.selectedVariant
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.id !== id))
      return
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setTableId('')
    setCustomerName('')
  }, [])

  const subtotal = items.reduce((sum, i) => {
    const addonTotal = i.selectedAddons.reduce((s, a) => s + a.price, 0)
    return sum + (i.price + addonTotal) * i.quantity
  }, 0)

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, tableId, customerName,
      addItem, removeItem, updateQuantity, clearCart,
      setTableId, setCustomerName,
      subtotal, totalItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
