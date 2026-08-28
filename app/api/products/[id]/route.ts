import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { price } = await request.json()
    
    if (typeof price !== 'number') {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: { price }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
