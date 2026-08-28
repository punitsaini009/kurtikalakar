import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import { redirect } from 'next/navigation'
import AdminOrderManager from './AdminOrderManager'
import styles from '../page.module.css'

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/')
  }

  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      items: {
        include: {
          product: {
            select: {
              name: true
            }
          }
        }
      },
      statusHistory: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Delivery Tracking & Order Management</h1>
        <p className={styles.subtitle}>Update the delivery status of orders to notify customers</p>
      </div>
      
      <AdminOrderManager initialOrders={orders} />
    </div>
  )
}
