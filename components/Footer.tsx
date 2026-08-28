import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.column}>
          <h3 className={styles.brand}>Kurti Kalakar</h3>
          <p className={styles.desc}>
            Premium luxury fashion for the modern Indian woman. Elegance in every thread.
          </p>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/nayara_kurtis/?igsh=MjQyaTlvdjFnMjdp" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
          </div>
        </div>
        
        <div className={styles.column}>
          <h4>Shop</h4>
          <Link href="/collections/new-arrivals">New Arrivals</Link>
          <Link href="/collections/best-sellers">Best Sellers</Link>
          <Link href="/collections/luxury">Luxury Collection</Link>
        </div>
        
        <div className={styles.column}>
          <h4>Help</h4>
          <Link href="/faq">FAQ</Link>
          <Link href="/shipping">Shipping & Returns</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
        
        <div className={styles.column}>
          <h4>Newsletter</h4>
          <p className={styles.desc}>Subscribe for exclusive offers and updates.</p>
          <form className={styles.form}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Kurti Kalakar. All rights reserved.</p>
      </div>
    </footer>
  )
}
