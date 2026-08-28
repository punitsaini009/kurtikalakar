import { prisma } from '../../../lib/prisma'
import AdminProductManager from './AdminProductManager'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <AdminProductManager initialProducts={products} />
    </div>
  )
}
