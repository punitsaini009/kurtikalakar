import { prisma } from '../../../lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '../../../components/ProductCard'
import styles from './page.module.css'

export const revalidate = 3600 // Cache page for 1 hour

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `${params.slug.replace('-', ' ').toUpperCase()} Collection | Kurti Kalakar`,
    description: `Shop the latest ${params.slug.replace('-', ' ')} collection at Kurti Kalakar. Premium luxury fashion for Indian women.`,
  }
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const products = await prisma.product.findMany({
    where: { collection: params.slug }
  })

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>{params.slug.replace('-', ' ')}</h1>
          <p className={styles.subtitle}>Explore our curated luxury pieces</p>
        </div>

        {products.length === 0 ? (
          <div className={styles.empty}>
            <p>No products found in this collection.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
