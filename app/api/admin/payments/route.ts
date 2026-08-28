import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { orderId, action } = await req.json()
    
    if (action === 'APPROVE') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' }
      })
    } else if (action === 'REJECT') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'REJECTED' }
      })
      await prisma.payment.update({
        where: { orderId: orderId },
        data: { status: 'REJECTED' }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process payment action' }, { status: 500 })
  }
}
