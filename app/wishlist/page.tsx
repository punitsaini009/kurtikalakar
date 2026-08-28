'use client'

import Link from 'next/link'
import { useWishlist } from '../../providers/WishlistProvider'
import ProductCard from '../../components/ProductCard'
import styles from './page.module.css'

export default function WishlistPage() {
  const { items } = useWishlist()

  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>My Wishlist</h1>
        
        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your wishlist is currently empty.</p>
            <Link href="/collections/new-arrivals" className={styles.shopBtn}>Explore Collections</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
