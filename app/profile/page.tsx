import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'
import LogoutButton from './LogoutButton'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const user = session.user as any

  return (
    <main className={styles.main}>
      <div className={`container ${styles.profileContainer}`}>
        <div className={styles.sidebar}>
          <div className={styles.avatar}>
            {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
          </div>
          <h2 className={styles.name}>{user.name || 'User'}</h2>
          <p className={styles.email}>{user.email}</p>
          
          <nav className={styles.nav}>
            <Link href="/profile" className={styles.active}>My Profile</Link>
            <Link href="/orders">Order History</Link>
            <Link href="/wishlist">Wishlist</Link>
            {user.role === 'ADMIN' && (
              <Link href="/admin" className={styles.adminLink}>Admin Dashboard</Link>
            )}
            <LogoutButton />
          </nav>
        </div>
        
        <div className={styles.content}>
          <h1 className={styles.title}>My Profile</h1>
          
          <div className={styles.card}>
            <h3>Account Information</h3>
            <div className={styles.infoGrid}>
              <div>
                <label>Name</label>
                <p>{user.name || 'Not provided'}</p>
              </div>
              <div>
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div>
                <label>Role</label>
                <p>{user.role}</p>
              </div>
            </div>
            <button className={styles.editBtn}>Edit Profile</button>
          </div>
        </div>
      </div>
    </main>
  )
}
