'use client'

import { useState } from 'react'
import { useCart } from '../providers/CartProvider'
import { useWishlist } from '../providers/WishlistProvider'
import styles from './ProductOptions.module.css'

export default function ProductOptions({ product }: { product: any }) {
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL']

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [error, setError] = useState('')
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size first.')
      return
    }
    setError('')
    addToCart({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      image: product.images[0]
    })
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        images: product.images,
        color: product.color
      })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>Select Size: <strong>{selectedSize || ''}</strong></span>
        <button className={styles.sizeGuideBtn}>Size Guide</button>
      </div>
      
      <div className={styles.sizesGrid}>
        {sizes.map(size => (
          <button
            key={size}
            className={`${styles.sizeBtn} ${selectedSize === size ? styles.active : ''}`}
            onClick={() => {
              setSelectedSize(size)
              setError('')
            }}
          >
            {size}
          </button>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.addToCart} onClick={handleAddToCart}>
          Add to Cart
        </button>
        <button className={styles.wishlist} onClick={toggleWishlist}>
          {inWishlist ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
        </button>
      </div>
    </div>
  )
}
