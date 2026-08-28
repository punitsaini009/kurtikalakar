const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { 
      collection: 'New Arrivals' 
    }
  });

  let counts = { chikankari: 0, festive: 0, luxury: 0, trending: 0, 'best-sellers': 0, 'new-arrivals': 0 };
  let fallbackCollections = ['luxury', 'trending', 'best-sellers', 'new-arrivals'];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    let newCollection = 'new-arrivals';
    let isChikankari = false;
    let isFestive = false;
    let isLuxury = false;
    let isTrending = false;
    let isBestSeller = false;

    if (p.name.toLowerCase().includes('chikankari')) {
      newCollection = 'chikankari';
      isChikankari = true;
    } else if (p.name.toLowerCase().includes('suit') || p.name.toLowerCase().includes('festive') || p.name.toLowerCase().includes('dupatta') || p.name.toLowerCase().includes('anarkali')) {
      newCollection = 'festive';
      isFestive = true;
    } else {
      // Rotate through remaining categories to distribute them
      newCollection = fallbackCollections[i % fallbackCollections.length];
      if (newCollection === 'luxury') isLuxury = true;
      if (newCollection === 'trending') isTrending = true;
      if (newCollection === 'best-sellers') isBestSeller = true;
    }

    await prisma.product.update({
      where: { id: p.id },
      data: {
        collection: newCollection,
        isChikankari: isChikankari,
        isFestive: isFestive,
        isLuxury: isLuxury,
        isTrending: isTrending,
        isBestSeller: isBestSeller
      }
    });
    counts[newCollection] = (counts[newCollection] || 0) + 1;
  }
  
  console.log('Fixed collection distribution:', counts);
}

main().catch(console.error).finally(() => prisma.$disconnect());
