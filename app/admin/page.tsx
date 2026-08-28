import { prisma } from '../../lib/prisma'
import DashboardClient from './DashboardClient'

export default async function AdminDashboard() {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    verifiedPayments,
    pendingUtr,
    totalCustomers,
    revenueAgg,
    lowStock
  ] = await prisma.$transaction([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.payment.count({ where: { status: 'APPROVED' } }),
    prisma.payment.count({ where: { status: 'PENDING', utrNumber: { not: null } } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'APPROVED' } }),
    prisma.product.count({ where: { stock: { lt: 5 } } })
  ])

  const initialData = {
    totalProducts,
    totalOrders,
    pendingOrders,
    verifiedPayments,
    pendingUtr,
    totalCustomers,
    totalRevenue: revenueAgg._sum.amount || 0,
    lowStock
  }

  return <DashboardClient initialData={initialData} />
}
