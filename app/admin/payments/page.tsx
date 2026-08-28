import { prisma } from '../../../lib/prisma'
import PaymentClient from './PaymentClient'

export default async function AdminPaymentsPage() {
  const ordersWithPayments = await prisma.order.findMany({
    where: { 
      utrNumber: { not: null }
    },
    include: {
      user: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <PaymentClient initialOrders={ordersWithPayments} />
    </div>
  )
}
