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
    const data = await req.json()
    
    // Set default images array and sizes if not provided
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || '',
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        discountPercent: data.discountPercent ? Number(data.discountPercent) : null,
        sizes: JSON.stringify(data.sizes || ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL']),
        images: JSON.stringify(data.images || []),
        collection: data.collection || 'new-arrivals',
        fabric: data.fabric || '',
        color: data.color || '',
        sku: data.sku || `SKU-${Date.now()}`,
        stock: Number(data.stock || 0),
        isFeatured: Boolean(data.isFeatured),
        isBestSeller: Boolean(data.isBestSeller),
        isTrending: Boolean(data.isTrending),
        isLuxury: Boolean(data.isLuxury),
        isChikankari: Boolean(data.isChikankari),
        isFestive: Boolean(data.isFestive)
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
