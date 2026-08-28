'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, ShoppingBag, Search, User, Heart, Instagram, X } from 'lucide-react'
import { useCart } from '../providers/CartProvider'
import { useWishlist } from '../providers/WishlistProvider'
import { useSession, signOut } from 'next-auth/react'
import CartDrawer from './CartDrawer'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { items, setIsCartOpen } = useCart()
  const { items: wishlistItems } = useWishlist()
  const pathname = usePathname()
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const { data: session } = useSession()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  const renderUserDropdown = (isMobile: boolean) => (
    <div className={styles.userMenuContainer}>
      <button 
        className={`${styles.iconBtn} ${isMobile ? styles.mobileOnly : ''}`} 
        aria-label="Profile"
        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
      >
        <User size={isMobile ? 24 : 20} />
      </button>
      {isUserDropdownOpen && (
        <div className={styles.userDropdown}>
          {session ? (
            <>
              <Link href="/profile" onClick={() => setIsUserDropdownOpen(false)}>My Account</Link>
              <Link href="/orders" onClick={() => setIsUserDropdownOpen(false)}>My Orders</Link>
              {session?.user && (session.user as any).role === 'ADMIN' && (
                <Link href="/admin" onClick={() => setIsUserDropdownOpen(false)}>Admin Dashboard</Link>
              )}
              <button className={styles.logoutBtn} onClick={() => { signOut(); setIsUserDropdownOpen(false) }}>Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsUserDropdownOpen(false)}>Login / Sign Up</Link>
          )}
        </div>
      )}
    </div>
  )

  return (
    <>
      <nav className={styles.navbar}>
        <div className={`container ${styles.navContainer}`}>
          {/* Mobile Left: Hamburger | Desktop Left: Search */}
          <div className={styles.left}>
            <button className={`${styles.iconBtn} ${styles.mobileOnly}`} onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <button className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search size={20} />
            </button>
          </div>
          
          <div className={styles.center}>
            <Link href="/" className={styles.logoContainer}>
              <span className={styles.logoKK}>KK</span>
              <span className={styles.logoText}>Kurti Kalakar</span>
            </Link>
          </div>
          
          <div className={styles.right}>
            {/* Mobile Right: User + Search + Cart */}
            <div className={styles.mobileOnly} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {renderUserDropdown(true)}
              <button className={styles.iconBtn} aria-label="Search" onClick={() => router.push('/search')}>
                <Search size={24} />
              </button>
              <button 
                className={styles.iconBtn} 
                aria-label="Cart"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={24} />
                {cartItemCount > 0 && <span className={styles.cartCount}>{cartItemCount}</span>}
              </button>
            </div>

            <div className={styles.desktopOnlyIcons}>
              {renderUserDropdown(false)}
              <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
                <Heart size={20} />
                {wishlistItems.length > 0 && <span className={styles.cartCount}>{wishlistItems.length}</span>}
              </Link>
              <button 
                className={styles.iconBtn} 
                aria-label="Cart"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={20} />
                {cartItemCount > 0 && <span className={styles.cartCount}>{cartItemCount}</span>}
              </button>
            </div>
          </div>
        </div>

        {isSearchOpen && (
          <div className={styles.searchBarContainer}>
            <div className="container">
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input 
                  type="text" 
                  placeholder="Search for Kurtis, Colors, Fabrics..." 
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className={styles.searchSubmitBtn}>Search</button>
              </form>
            </div>
          </div>
        )}
        
        <div className={styles.bottomNav}>
          <div className="container">
            <ul className={styles.navLinks}>
              <li><Link href="/collections/new-arrivals" className={pathname === '/collections/new-arrivals' ? styles.active : ''}>New Arrivals</Link></li>
              <li><Link href="/collections/best-sellers" className={pathname === '/collections/best-sellers' ? styles.active : ''}>Best Sellers</Link></li>
              <li><Link href="/collections/trending" className={pathname === '/collections/trending' ? styles.active : ''}>Trending</Link></li>
              <li><Link href="/collections/luxury" className={pathname === '/collections/luxury' ? styles.active : ''}>Luxury</Link></li>
              <li><Link href="/collections/chikankari" className={pathname === '/collections/chikankari' ? styles.active : ''}>Chikankari</Link></li>
              <li><Link href="/collections/festive" className={pathname === '/collections/festive' ? styles.active : ''}>Festive</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div className={`${styles.mobileSidebarOverlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`${styles.mobileSidebar} ${isMobileMenuOpen ? styles.open : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className={styles.mobileSidebarHeader}>
            <h2>Menu</h2>
            <button className={styles.closeSidebarBtn} onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
          </div>
          <ul className={styles.mobileSidebarLinks}>
            <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
            <li><Link href="/collections/new-arrivals" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link></li>
            <li><Link href="/collections/best-sellers" onClick={() => setIsMobileMenuOpen(false)}>Best Sellers</Link></li>
            <li><Link href="/collections/trending" onClick={() => setIsMobileMenuOpen(false)}>Trending</Link></li>
            <li><Link href="/collections/luxury" onClick={() => setIsMobileMenuOpen(false)}>Luxury</Link></li>
            <li><Link href="/collections/chikankari" onClick={() => setIsMobileMenuOpen(false)}>Chikankari</Link></li>
            <li><Link href="/collections/festive" onClick={() => setIsMobileMenuOpen(false)}>Festive</Link></li>
          </ul>
        </div>
      </div>
      
      <CartDrawer />
    </>
  )
}
