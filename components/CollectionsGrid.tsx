import Image from 'next/image'
import Link from 'next/link'
import styles from './CollectionsGrid.module.css'

const collections = [
  { id: 1, title: 'New Arrivals', image: '/images/hero.1.png', link: '/collections/new-arrivals', colSpan: 2, rowSpan: 2 },
  { id: 2, title: 'Luxury', image: '/images/hero_2.png', link: '/collections/luxury', colSpan: 1, rowSpan: 1 },
  { id: 3, title: 'Trending', image: '/images/collection_trending.png', link: '/collections/trending', colSpan: 1, rowSpan: 1 },
  { id: 4, title: 'Festive', image: '/images/collection_festive.png', link: '/collections/festive', colSpan: 2, rowSpan: 1 },
]

export default function CollectionsGrid() {
  return (
    <section className={styles.section}>
      <div className={`container`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Shop By Collection</h2>
          <p className={styles.subtitle}>Discover our meticulously crafted curations</p>
        </div>
        
        <div className={styles.grid}>
          {collections.map((col) => (
            <Link 
              href={col.link} 
              key={col.id} 
              className={`${styles.item} ${styles[`col${col.colSpan}`]} ${styles[`row${col.rowSpan}`]}`}
            >
              <Image 
                src={col.image} 
                alt={col.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={col.id <= 2}
                className={styles.image}
              />
              <div className={styles.overlay}>
                <h3 className={styles.itemTitle}>{col.title}</h3>
                <span className={styles.exploreBtn}>Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
