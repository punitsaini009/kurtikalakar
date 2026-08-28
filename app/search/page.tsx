import { prisma } from '../../lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '../../components/ProductCard'
import styles from './page.module.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search | Kurti Kalakar',
  description: 'Search for premium kurti sets.',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ''
  
  let products: any[] = []

  if (query) {
    products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { collection: { contains: query } },
          { fabric: { contains: query } },
          { color: { contains: query } },
        ]
      }
    })
  }

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Search Results</h1>
          {query && (
            <p className={styles.subtitle}>
              Showing results for &quot;<strong>{query}</strong>&quot; ({products.length} found)
            </p>
          )}
        </div>

        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No products found matching your search criteria.</p>
            <Link href="/collections/new-arrivals" className={styles.shopBtn}>Explore Collections</Link>
          </div>
        )}
      </div>
    </main>
  )
}
