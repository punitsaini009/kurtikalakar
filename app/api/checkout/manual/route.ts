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
    const { items, total, utrNumber, paymentScreenshot } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    
    if (!utrNumber || !paymentScreenshot) {
      return NextResponse.json({ error: 'UTR number and payment screenshot are required' }, { status: 400 })
    }

    const userId = (session.user as any).id

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        utrNumber,
        paymentScreenshot,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    // Insert the payment record using Prisma
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: total,
        status: 'PENDING',
        utrNumber,
        screenshot: paymentScreenshot
      }
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
