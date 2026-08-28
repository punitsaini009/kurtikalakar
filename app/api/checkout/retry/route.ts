import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Must be logged in to checkout' }, { status: 401 })
  }

  try {
    const { orderId, utrNumber, paymentScreenshot } = await request.json()
    
    if (!orderId || !utrNumber || !paymentScreenshot) {
      return NextResponse.json({ error: 'Order ID, UTR number, and payment screenshot are required' }, { status: 400 })
    }

    const userId = (session.user as any).id

    // Verify order exists and belongs to the user and is REJECTED
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (order.status !== 'REJECTED') {
      return NextResponse.json({ error: 'Only rejected orders can be retried' }, { status: 400 })
    }

    // Update the order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PENDING',
        utrNumber,
        paymentScreenshot
      }
    })

    // Update the payment record using Prisma
    await prisma.payment.update({
      where: { orderId: orderId },
      data: {
        amount: order.total,
        status: 'PENDING',
        utrNumber,
        screenshot: paymentScreenshot,
        paymentDate: new Date() // reset payment date
      }
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Retry failed' }, { status: 500 })
  }
}
