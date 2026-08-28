import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../../lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // Run in a sequential transaction (array) to avoid PgBouncer pool timeouts
    const result = await prisma.$transaction([
      // 1. Update the order status
      prisma.order.update({
        where: { id: params.id },
        data: { status }
      }),
      // 2. Insert into history
      prisma.orderStatusHistory.create({
        data: {
          orderId: params.id,
          status: status
        }
      })
    ])

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}
