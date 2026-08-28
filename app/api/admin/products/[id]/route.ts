import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../lib/auth'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    
    const updateData: any = { ...data }
    
    // Parse numeric fields
    if (updateData.price) updateData.price = Number(updateData.price)
    if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice)
    if (updateData.discountPercent !== undefined) updateData.discountPercent = Number(updateData.discountPercent)
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock)
    
    // Parse JSON fields
    if (updateData.sizes && Array.isArray(updateData.sizes)) updateData.sizes = JSON.stringify(updateData.sizes)
    if (updateData.images && Array.isArray(updateData.images)) updateData.images = JSON.stringify(updateData.images)
    
    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.product.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
