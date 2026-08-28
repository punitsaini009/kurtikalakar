'use client'

import { useState } from 'react'
import styles from './payments.module.css'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'

export default function PaymentClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (orderId: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`Are you sure you want to ${action} this payment?`)) return
    
    setLoading(orderId)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action })
      })
      if (res.ok) {
        if (action === 'APPROVE') {
          setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'PAID' } : o))
        } else {
          setOrders(orders.filter(o => o.id !== orderId))
        }
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Payment Verification</h2>
        <p>Review and verify user-submitted UTRs and screenshots.</p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>UTR Number</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className={styles.mono}>{order.id.slice(-8).toUpperCase()}</td>
                <td>
                  <strong>{order.user?.name || 'Guest'}</strong>
                  <br/>
                  <small>{order.user?.email}</small>
                </td>
                <td>₹{order.total.toLocaleString('en-IN')}</td>
                <td>
                  <span className={styles.utrBadge}>{order.utrNumber}</span>
                  {order.paymentScreenshot && (
                    <a href={order.paymentScreenshot} target="_blank" className={styles.screenshotLink}>
                      View Screenshot <ExternalLink size={12} />
                    </a>
                  )}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === 'PENDING' && (
                    <div className={styles.actions}>
                      <button 
                        onClick={() => handleAction(order.id, 'APPROVE')} 
                        disabled={loading === order.id}
                        className={styles.approveBtn}
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(order.id, 'REJECT')} 
                        disabled={loading === order.id}
                        className={styles.rejectBtn}
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.empty}>No pending payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
