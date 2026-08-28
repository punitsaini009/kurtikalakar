import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import { prisma } from '../../lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

import OrderTimeline from '../../components/OrderTimeline'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const user = session.user as any

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { 
      items: { include: { product: true } },
      statusHistory: { orderBy: { createdAt: 'asc' } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className={styles.main}>
      <div className={`container ${styles.ordersContainer}`}>
        <div className={styles.sidebar}>
          <nav className={styles.nav}>
            <Link href="/profile">My Profile</Link>
            <Link href="/orders" className={styles.active}>Order History</Link>
            <Link href="/wishlist">Wishlist</Link>
          </nav>
        </div>
        
        <div className={styles.content}>
          <h1 className={styles.title}>Order History</h1>
          
          {orders.length === 0 ? (
            <div className={styles.empty}>
              <p>You haven&apos;t placed any orders yet.</p>
              <Link href="/collections/new-arrivals" className={styles.shopBtn}>Start Shopping</Link>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order: any) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <p className={styles.orderId}>Order #{order.id.slice(-6)}</p>
                      <p className={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.orderStatus}>
                      <span className={`${styles.status} ${styles[order.status.toLowerCase()] || ''}`}>
                        {order.status === 'REJECTED' ? 'PAYMENT REJECTED' : order.status.replace(/_/g, ' ')}
                      </span>
                      {order.status === 'REJECTED' && (
                        <div style={{ marginTop: '8px' }}>
                          <Link href={`/checkout/pay/${order.id}`} className={styles.payAgainBtn}>PAY AGAIN</Link>
                        </div>
                      )}
                      <p className={styles.total}>Total: ₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  
                  <div className={styles.orderItems}>
                    {order.items.map((item: any) => (
                      <div key={item.id} className={styles.item}>
                        <div className={styles.itemInfo}>
                          <h4>{item.product.name}</h4>
                          <p>Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <p className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  <OrderTimeline currentStatus={order.status} history={order.statusHistory} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
