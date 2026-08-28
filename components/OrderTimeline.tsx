import React from 'react'
import styles from './OrderTimeline.module.css'
import { CheckCircle2, Clock, Truck, Package, PackageCheck, AlertCircle, XCircle } from 'lucide-react'

interface StatusHistory {
  id: string
  status: string
  createdAt: Date
}

interface OrderTimelineProps {
  currentStatus: string
  history: StatusHistory[]
}

export default function OrderTimeline({ currentStatus, history }: OrderTimelineProps) {
  // If no history exists (legacy orders), generate a fake single entry based on current status
  const timelineEvents = history.length > 0 
    ? history 
    : [{ id: 'legacy-1', status: currentStatus, createdAt: new Date() }]

  const getIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={20} />
      case 'PAID': return <CheckCircle2 size={20} />
      case 'ORDER_CONFIRMED': return <CheckCircle2 size={20} />
      case 'PROCESSING': return <Package size={20} />
      case 'SHIPPED': return <Truck size={20} />
      case 'OUT_FOR_DELIVERY': return <Truck size={20} />
      case 'DELIVERY_ATTEMPTED': return <AlertCircle size={20} />
      case 'DELIVERED': return <PackageCheck size={20} />
      case 'REJECTED': return <XCircle size={20} />
      default: return <CheckCircle2 size={20} />
    }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ')
  }

  return (
    <div className={styles.timelineContainer}>
      <h3 className={styles.timelineTitle}>Tracking History</h3>
      <div className={styles.timeline}>
        {timelineEvents.map((event, index) => (
          <div key={event.id} className={styles.timelineItem}>
            <div className={styles.timelineLine}>
              <div className={`${styles.iconWrapper} ${index === timelineEvents.length - 1 ? styles.latest : ''}`}>
                {getIcon(event.status)}
              </div>
              {index < timelineEvents.length - 1 && <div className={styles.line} />}
            </div>
            <div className={styles.timelineContent}>
              <p className={styles.statusText}>{formatStatus(event.status)}</p>
              <p className={styles.dateText}>
                {new Date(event.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
