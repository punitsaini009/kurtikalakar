import styles from './page.module.css'
import ProductGallery from '../../../components/ProductGallery'
import ProductOptions from '../../../components/ProductOptions'
import { prisma } from '../../../lib/prisma'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // Cache page for 1 hour

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  })

  if (!product) {
    notFound()
  }

  let rawImages = [];
  try {
    rawImages = JSON.parse(product.images);
    if (!Array.isArray(rawImages)) rawImages = [rawImages];
  } catch (e) {
    rawImages = typeof product.images === 'string' ? product.images.split(',') : [product.images];
  }
  let images = rawImages.map((img: string) => img.replace(/[\[\]"\\]/g, '').trim()).filter(Boolean);
  const fallbackImage = '/images/logo.png'
  if (images.length === 0 || !images[0]) {
    images = [fallbackImage]
  }

  let parsedSizes = [];
  if (product.sizes) {
    try {
      parsedSizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
    } catch (e) {
      if (typeof product.sizes === 'string') {
        parsedSizes = product.sizes.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
  }

  // Format the product for client component to handle safely
  const calculatedDiscount = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const clientProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    images: images,
    sizes: parsedSizes
  }

  const isValid = (text: string | null | undefined) => {
    if (!text) return false;
    const trimmed = text.trim();
    if (trimmed === '') return false;
    if (trimmed === 'Details coming soon.') return false;
    if (trimmed === 'Not specified') return false;
    return true;
  };

  return (
    <main className={styles.main}>
      <div className={`container ${styles.productContainer}`}>
        <div className={styles.gallerySection}>
          <ProductGallery images={images} />
        </div>
        
        <div className={styles.detailsSection}>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.productPagePriceLayout}>
            <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                {' '}<span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>{' '}
                <span className={styles.discountBadge}>{calculatedDiscount}% OFF</span>
              </>
            )}
          </div>
          
          <div className={styles.divider}></div>
          
          {isValid(product.description) && (
            <div className={styles.description}>
              <p>{product.description}</p>
            </div>
          )}
          
          <div className={styles.options}>
            <ProductOptions product={clientProduct} />
          </div>
          
          <div className={styles.details}>
            <h3>Product Details</h3>
            <ul>
              {isValid(product.collection) && (
                <li>Collection: <span style={{textTransform: 'capitalize'}}>{product.collection.replace('-', ' ')}</span></li>
              )}
              {isValid(product.fabric) && (
                <li>Fabric: {product.fabric}</li>
              )}
              {isValid(product.color) && (
                <li>Color: {product.color}</li>
              )}
              {isValid(product.sku) && (
                <li>SKU: {product.sku}</li>
              )}
              <li>Status: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
