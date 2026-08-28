import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './layout.module.css'
import { LayoutDashboard, Package, CreditCard, QrCode, Settings, LogOut } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Robust session check to prevent unauthorized access
  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>InsForge Core</h2>
          <span className={styles.badge}>Admin Panel</span>
        </div>
        
        <nav className={styles.navMenu}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/products" className={styles.navLink}>
            <Package size={20} />
            Products
          </Link>
          <Link href="/admin/payments" className={styles.navLink}>
            <CreditCard size={20} />
            Payments
          </Link>
          <Link href="/admin/orders" className={styles.navLink}>
            <Package size={20} />
            Orders
          </Link>
          <Link href="/admin/qr" className={styles.navLink}>
            <QrCode size={20} />
            QR Settings
          </Link>
          <Link href="/admin/settings" className={styles.navLink}>
            <Settings size={20} />
            Website Settings
          </Link>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <Link href="/api/auth/signout" className={styles.logoutBtn}>
            <LogOut size={20} />
            Sign Out
          </Link>
          <Link href="/" className={styles.storeLink}>
            Return to Store
          </Link>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
