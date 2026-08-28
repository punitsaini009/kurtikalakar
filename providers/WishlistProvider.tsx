'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type WishlistProduct = {
  id: string
  name: string
  price: number
  originalPrice?: number
  discountPercent?: number
  images: any
  color?: string
}

type WishlistContextType = {
  items: WishlistProduct[]
  addToWishlist: (product: WishlistProduct) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistProduct[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('kurti_wishlist')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse wishlist')
      }
    }
    setIsInitialized(true)
  }, [])

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('kurti_wishlist', JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addToWishlist = (product: WishlistProduct) => {
    setItems(current => {
      if (current.find(item => item.id === product.id)) {
        return current
      }
      return [...current, product]
    })
  }

  const removeFromWishlist = (id: string) => {
    setItems(current => current.filter(item => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return items.some(item => item.id === id)
  }

  const clearWishlist = () => setItems([])

  return (
    <WishlistContext.Provider value={{
      items, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
