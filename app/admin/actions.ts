'use server'

import { prisma } from '../../lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'

export async function refreshDashboardStats() {
  noStore() // Opt out of Next.js aggressive caching
  console.log('[Server Action] refreshDashboardStats invoked by client.')
  
  // Artificial delay to ensure "Refreshing..." loading state is visible to user
  await new Promise(resolve => setTimeout(resolve, 600))

  const [
    totalOrders,
    pendingOrders,
    verifiedPayments,
    pendingUtr,
    totalCustomers,
    revenueAgg,
    lowStock
  ] = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.payment.count({ where: { status: 'APPROVED' } }),
    prisma.payment.count({ where: { status: 'PENDING', utrNumber: { not: null } } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'APPROVED' } }),
    prisma.product.count({ where: { stock: { lt: 5 } } })
  ])

  console.log('[Server Action] Database query successful. Returning fresh stats.')

  return {
    totalOrders,
    pendingOrders,
    verifiedPayments,
    pendingUtr,
    totalCustomers,
    totalRevenue: revenueAgg._sum.amount || 0,
    lowStock
  }
}
