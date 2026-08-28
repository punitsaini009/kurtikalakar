const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allProds = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const original34 = allProds.slice(0, 34);
  const new64 = allProds.slice(34);

  if (original34.length !== 34 || new64.length !== 64) {
    console.error(`Counts mismatch. Found ${original34.length} old and ${new64.length} new.`);
    return;
  }

  // Backup original prices for verification
  const originalPrices = {};
  for(const p of original34) {
    originalPrices[p.id] = p.price;
  }

  // Pricing rules based on category (clean numbers, 1000-2500)
  const categoryPrices = {
    'new-arrivals': 1200,
    'trending': 1500,
    'best-sellers': 1800,
    'festive': 2000,
    'chikankari': 2200,
    'luxury': 2500
  };

  let updatedCount = 0;

  for (const p of new64) {
    const price = categoryPrices[p.collection] || 1000;
    const originalPrice = price + 500; // Flat 500 discount for a nice clean number
    const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

    await prisma.product.update({
      where: { id: p.id },
      data: {
        price: price,
        originalPrice: originalPrice,
        discountPercent: discountPercent
      }
    });
    updatedCount++;
  }

  // Verification step
  const finalProds = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' }
  });

  let originalPricesIntact = true;
  for(let i=0; i<34; i++) {
    if (finalProds[i].price !== originalPrices[finalProds[i].id]) {
      originalPricesIntact = false;
      break;
    }
  }

  let newPricesValid = true;
  for(let i=34; i<98; i++) {
    if (finalProds[i].price < 1000 || finalProds[i].price > 2500) {
      newPricesValid = false;
      break;
    }
  }

  console.log(`Updated pricing for ${updatedCount} new products.`);
  console.log(`Original 34 prices intact: ${originalPricesIntact}`);
  console.log(`New 64 prices within 1000-2500 range: ${newPricesValid}`);

}

main().catch(console.error).finally(() => prisma.$disconnect());
