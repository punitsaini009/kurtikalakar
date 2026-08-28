'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('kurti_cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse cart')
      }
    }
    setIsInitialized(true)
  }, [])

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('kurti_cart', JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addToCart = (newItem: CartItem) => {
    setItems(current => {
      const existing = current.find(item => item.productId === newItem.productId && item.size === newItem.size)
      if (existing) {
        return current.map(item => 
          item.id === existing.id 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }
      return [...current, newItem]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    setItems(current => current.map(item => 
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, total, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
