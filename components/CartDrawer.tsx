import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus } from 'lucide-react'
import { useCart } from '../providers/CartProvider'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart()

  if (!isCartOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsCartOpen(false)} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2>Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn}><X /></button>
        </div>
        
        <div className={styles.content}>
          {items.length === 0 ? (
            <p className={styles.empty}>Your cart is empty.</p>
          ) : (
            <div className={styles.itemsList}>
              {items.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.imageContainer}>
                    <Image src={item.image} alt={item.name} fill sizes="80px" className={styles.image} />
                  </div>
                  <div className={styles.details}>
                    <h3>{item.name}</h3>
                    <p className={styles.size}>Size: {item.size}</p>
                    <div className={styles.quantityControl}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                  <div className={styles.priceCol}>
                    <p className={styles.price}>₹{item.price}</p>
                    <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summary}>
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <p className={styles.taxInfo}>Taxes and shipping calculated at checkout</p>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)} className={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
