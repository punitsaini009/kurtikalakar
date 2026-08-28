const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const collections = ['new-arrivals', 'best-sellers', 'trending', 'luxury', 'chikankari', 'festive']
const baseNames = ['Royal Kurti Set', 'Elegant Kurti', 'Classic Embroidered Kurti', 'Festive Special Set', 'Minimalist Kurti', 'Chikankari Suit', 'Luxury Silk Kurti']
const sizesJSON = JSON.stringify(['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'])
const imagesJSON = JSON.stringify([
  '/images/hero_1.png',
  '/images/hero_2.png',
  '/images/hero_3.png',
  '/images/hero_4.png'
])

const fabrics = ['Cotton', 'Silk', 'Georgette', 'Chanderi', 'Linen', 'Organza']
const colors = ['Maroon', 'White', 'Gold', 'Black', 'Emerald', 'Navy', 'Ruby Red', 'Pearl']

function getPriceRange(collection) {
  switch (collection) {
    case 'new-arrivals': return [999, 1499] // Basic Collection
    case 'best-sellers':
    case 'trending': return [1500, 1999] // Premium Collection
    case 'festive': return [1800, 2299]
    case 'chikankari': return [2100, 2500]
    case 'luxury': return [2599, 2999]
    default: return [999, 2999]
  }
}

async function main() {
  console.log('Clearing old data...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding database...')

  // Create an Admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@kurtikalakar.com' },
    update: {},
    create: {
      email: 'admin@kurtikalakar.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  // Create a Regular user
  const userPassword = await bcrypt.hash('user123', 10)
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER'
    }
  })

  // Global set to guarantee unique prices
  const usedPrices = new Set()

  // Create 150 Products
  for (let i = 1; i <= 150; i++) {
    const collection = collections[Math.floor(Math.random() * collections.length)]
    const baseName = baseNames[Math.floor(Math.random() * baseNames.length)]
    const fabric = fabrics[Math.floor(Math.random() * fabrics.length)]
    const color = colors[Math.floor(Math.random() * colors.length)]

    const [minPrice, maxPrice] = getPriceRange(collection)

    let price = 0
    let attempts = 0
    // Keep generating until we find a unique price in the range
    while (true) {
      price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice
      if (!usedPrices.has(price)) {
        usedPrices.add(price)
        break
      }
      attempts++
      if (attempts > 1000) {
        // Fallback: pick any unused price between 999 and 2999 if the range is exhausted
        price = 999
        while (usedPrices.has(price)) price++
        usedPrices.add(price)
        break
      }
    }

    // Original price is 20-50% higher
    const multiplier = 1.2 + (Math.random() * 0.3)
    const originalPrice = Math.floor(price * multiplier)
    const discountPercent = Math.round((1 - (price / originalPrice)) * 100)

    await prisma.product.create({
      data: {
        name: `${baseName} ${i}`,
        description: `A stunning ${color.toLowerCase()} ${baseName.toLowerCase()} crafted with premium ${fabric.toLowerCase()} and intricate detailing. Perfect for any special occasion.`,
        price: price,
        originalPrice: originalPrice,
        discountPercent: discountPercent,
        sizes: sizesJSON,
        images: imagesJSON,
        collection: collection,
        fabric: fabric,
        color: color,
        sku: `KK-${collection.substring(0, 3).toUpperCase()}-${i.toString().padStart(4, '0')}`,
        stock: Math.floor(Math.random() * 50) + 10
      }
    })
  }

  console.log(`Successfully created 150 products with ${usedPrices.size} unique prices!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
