import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import Razorpay from 'razorpay'

// Razorpay will be instantiated inside the POST handler to avoid build time errors

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Must be logged in to checkout' }, { status: 401 })
  }

  try {
    const { items, total } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const userId = (session.user as any).id

    const amountInPaise = Math.round(total * 100)

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    })

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    })

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
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
    try {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: total,
          status: 'PENDING'
          // razorpayOrderId: razorpayOrder.id (removed from schema)
        }
      })
    } catch (paymentError) {
      console.error('Failed to insert payment via Prisma:', paymentError)
    }

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
