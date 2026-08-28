// InsForge Core Client Simulator
// This simulates the behavior of connecting to an InsForge Core backend.

import { createClient } from '@insforge/sdk'

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || ''
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || ''

export const insforgeClient = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey
})

type Product = {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  sizes: string[]
  collection: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'The Royal Maroon Kurti Set',
    price: 4999,
    description: 'A masterpiece of elegance. This luxurious maroon kurti set features intricate hand-embroidered gold detailing.',
    images: ['/images/hero_1.png', '/images/product_closeup.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'],
    collection: 'luxury'
  },
  {
    id: '2',
    name: 'Pristine Chikankari Set',
    price: 3499,
    description: 'Timeless grace for the modern woman. White chikankari work on breathable premium fabric.',
    images: ['/images/hero_2.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
    collection: 'chikankari'
  },
  {
    id: '3',
    name: 'Festive Gold Kurti',
    price: 2999,
    description: 'Bright and festive yellow and gold kurti, perfect for haldi ceremonies and daytime celebrations.',
    images: ['/images/collection_festive.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'],
    collection: 'festive'
  },
  {
    id: '4',
    name: 'Midnight Trending Kurti',
    price: 5999,
    description: 'Modern black and gold luxury kurti. Apple level aesthetics, elegant and sophisticated.',
    images: ['/images/collection_trending.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    collection: 'trending'
  }
]

export const insforge = {
  db: {
    products: {
      async getAll(): Promise<Product[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        return mockProducts
      },
      async getById(id: string): Promise<Product | null> {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockProducts.find(p => p.id === id) || null
      },
      async getByCollection(collection: string): Promise<Product[]> {
        await new Promise(resolve => setTimeout(resolve, 400))
        return mockProducts.filter(p => p.collection === collection)
      }
    }
  },
  auth: {
    async loginWithGoogle() {
      // Simulate Google OAuth flow setup
      console.log('Initiating Google Login via InsForge Core...')
      return { user: { id: 'user_123', email: 'test@example.com' } }
    },
    async loginWithEmail(email: string) {
      console.log(`Initiating Email Login for ${email} via InsForge Core...`)
      return { user: { id: 'user_123', email } }
    }
  }
}
