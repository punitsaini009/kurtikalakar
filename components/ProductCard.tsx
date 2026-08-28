'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Eye, X } from 'lucide-react'
import { useCart } from '../providers/CartProvider'
import { useWishlist } from '../providers/WishlistProvider'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }: { product: any }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [error, setError] = useState('')
  const { addToCart, setIsCartOpen } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  let rawImages = [];
  try {
    rawImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    if (!Array.isArray(rawImages)) rawImages = [rawImages];
  } catch (e) {
    rawImages = typeof product.images === 'string' ? product.images.split(',') : [product.images];
  }
  const images = rawImages.map((img: string) => typeof img === 'string' ? img.replace(/[\[\]"\\]/g, '').trim() : img).filter(Boolean);
  const fallbackImage = '/images/logo.png' // Safe fallback image
  const displayImage = images.length > 0 && images[0] ? images[0] : fallbackImage;
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL']
  const colors = [product.color] // DB currently holds 1 color. We mock a few extra for premium look if needed, or just show the actual color.

  const calculatedDiscount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size')
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
      image: displayImage
    })
    setIsQuickViewOpen(false)
    setIsCartOpen(true)
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        images: [displayImage, ...images.slice(1)],
        color: product.color
      })
    }
  }

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  return (
    <>
      <div className={styles.card}>
        <Link href={`/products/${product.id}`} className={styles.imageLink}>
          <div className={styles.imageContainer}>
            <Image 
              src={displayImage} 
              alt={product.name} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.image}
            />
            <button className={styles.wishlistBtn} aria-label="Toggle wishlist" onClick={toggleWishlist}>
              <Heart size={18} fill={inWishlist ? '#ff3b30' : 'none'} color={inWishlist ? '#ff3b30' : 'currentColor'} />
            </button>
            <div className={styles.overlayActions}>
              <button className={styles.actionBtn} onClick={openQuickView}>
                <Eye size={18} /> Quick View
              </button>
              <button className={styles.actionBtn} onClick={openQuickView}>
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </Link>
        
        <div className={styles.details}>
          <div className={styles.colors}>
            <span className={styles.colorSwatch} title={product.color || ''} style={{ backgroundColor: product.color?.toLowerCase() === 'gold' ? '#D4AF37' : product.color?.toLowerCase() === 'white' ? '#FFFFFF' : product.color?.toLowerCase() === 'maroon' ? '#800000' : product.color?.toLowerCase() === 'black' ? '#000000' : product.color?.toLowerCase() === 'navy' ? '#000080' : '#800000' }}></span>
          </div>
          <Link href={`/products/${product.id}`} className={styles.nameLink}>
            <h3 className={styles.name}>{product.name}</h3>
          </Link>
          <div className={styles.productPriceLayout}>
            <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <>
                <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className={styles.inlineDiscountBadge}>{calculatedDiscount}% OFF</span>
              </>
            )}
          </div>
        </div>
      </div>

      {isQuickViewOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsQuickViewOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setIsQuickViewOpen(false)}><X size={24} /></button>
            <div className={styles.modalBody}>
              <div className={styles.modalImageContainer}>
                 <Image src={displayImage} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.modalImage} priority />
              </div>
              <div className={styles.modalDetails}>
                <h2 className={styles.modalName}>{product.name}</h2>
                <p className={styles.modalPrice}>₹{product.price.toLocaleString('en-IN')}</p>
                <div className={styles.sizeSection}>
                  <p className={styles.sizeLabel}>Select Size:</p>
                  <div className={styles.sizeGrid}>
                    {sizes.map((s: string) => (
                      <button 
                        key={s} 
                        className={`${styles.sizeBtn} ${selectedSize === s ? styles.activeSize : ''}`}
                        onClick={() => { setSelectedSize(s); setError(''); }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {error && <p className={styles.errorText}>{error}</p>}
                </div>
                <button className={styles.modalAddToCart} onClick={handleAddToCart}>Add to Cart</button>
                <Link href={`/products/${product.id}`} className={styles.viewFullBtn}>View Full Details</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
