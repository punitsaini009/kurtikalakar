'use client'

import { useState } from 'react'
import { RefreshCw, AlertCircle, Package, ShoppingCart, Clock, CheckCircle, Search, Users, IndianRupee, AlertTriangle } from 'lucide-react'
import styles from './page.module.css'
import { refreshDashboardStats } from './actions'

type MetricsData = {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  verifiedPayments: number;
  pendingUtr: number;
  totalCustomers: number;
  totalRevenue: number;
  lowStock: number;
}

export default function DashboardClient({ initialData }: { initialData: MetricsData }) {
  const [data, setData] = useState<MetricsData>(initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true)
    setError(null)
    
    try {
      const refreshedStats = await refreshDashboardStats()
      setData(prev => ({
        ...prev,
        totalOrders: refreshedStats.totalOrders,
        pendingOrders: refreshedStats.pendingOrders,
        verifiedPayments: refreshedStats.verifiedPayments,
        pendingUtr: refreshedStats.pendingUtr,
        totalCustomers: refreshedStats.totalCustomers,
        totalRevenue: refreshedStats.totalRevenue,
        lowStock: refreshedStats.lowStock
      }))
    } catch (err) {
      console.error(err)
      setError('Failed to refresh statistics.')
    } finally {
      setIsRefreshing(false)
    }
  }

  const metrics = [
    { title: 'Total Products', value: data.totalProducts, icon: <Package size={24} /> },
    { title: 'Total Orders', value: data.totalOrders, icon: <ShoppingCart size={24} /> },
    { title: 'Pending Orders', value: data.pendingOrders, icon: <Clock size={24} /> },
    { title: 'Verified Payments', value: data.verifiedPayments, icon: <CheckCircle size={24} /> },
    { title: 'Pending UTR Verification', value: data.pendingUtr, icon: <Search size={24} /> },
    { title: 'Total Customers', value: data.totalCustomers, icon: <Users size={24} /> },
    { title: 'Total Revenue', value: `₹${data.totalRevenue.toLocaleString('en-IN')}`, icon: <IndianRupee size={24} /> },
    { title: 'Low Stock Products', value: data.lowStock, icon: <AlertTriangle size={24} /> },
  ]

  return (
    <div>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Welcome back to the InsForge Core Admin Panel</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className={styles.refreshBtn}
          >
            <RefreshCw size={18} className={isRefreshing ? styles.spin : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Stats'}
          </button>
          {error && (
            <div className={styles.errorMsg}>
              <AlertCircle size={16} />
              <span>{error}</span>
              <button onClick={handleRefresh} className={styles.retryBtn}>Retry</button>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.statsGrid}>
        {metrics.map((metric, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3>{metric.title}</h3>
              <span className={styles.statIcon}>{metric.icon}</span>
            </div>
            <p className={styles.statValue}>{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
