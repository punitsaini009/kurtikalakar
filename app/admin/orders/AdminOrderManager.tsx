'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './AdminOrderManager.module.css'

const AVAILABLE_STATUSES = [
  'PENDING',
  'PAID',
  'ORDER_CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERY_ATTEMPTED',
  'DELIVERED',
  'REJECTED'
]

export default function AdminOrderManager({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleStatusChange = (orderId: string, status: string) => {
    setSelectedStatuses(prev => ({ ...prev, [orderId]: status }))
  }

  const updateStatus = async (orderId: string) => {
    const newStatus = selectedStatuses[orderId]
    if (!newStatus) return

    setLoadingId(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) throw new Error('Failed to update')
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ))
      
      // Clear selection
      setSelectedStatuses(prev => {
        const next = { ...prev }
        delete next[orderId]
        return next
      })
      
      router.refresh()
    } catch (error) {
      alert('Error updating status')
      console.error(error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className={styles.managerContainer}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status Management</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>
                  <span className={styles.orderId}>{order.id.slice(-6)}</span>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }} suppressHydrationWarning>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{order.user?.name || 'Guest'}</span>
                    <span className={styles.userEmail}>{order.user?.email}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '14px', maxWidth: '200px' }}>
                    {order.items.map((item: any) => (
                      <div key={item.id} style={{ marginBottom: '4px' }}>
                        {item.quantity}x {item.product.name} ({item.size})
                      </div>
                    ))}
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>
                  ₹{order.total.toLocaleString('en-IN')}
                </td>
                <td>
                  <div className={`${styles.currentStatus} ${styles['status_' + order.status]}`}>
                    {order.status.replace(/_/g, ' ')}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <select 
                      className={styles.statusDropdown}
                      value={selectedStatuses[order.id] || order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {AVAILABLE_STATUSES.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                    
                    {selectedStatuses[order.id] && selectedStatuses[order.id] !== order.status && (
                      <button 
                        className={styles.updateBtn}
                        onClick={() => updateStatus(order.id)}
                        disabled={loadingId === order.id}
                      >
                        {loadingId === order.id ? 'Updating...' : 'Confirm Update'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className={styles.emptyState}>No orders found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
