const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const products = await prisma.product.findMany();
  const settings = await prisma.websiteSettings.findMany();
  fs.writeFileSync('db_images.json', JSON.stringify({
    products: products.map(p => ({id: p.id, name: p.name, images: p.images})),
    settings
  }, null, 2));
  console.log('Saved to db_images.json');
}

main().catch(console.error).finally(() => prisma.$disconnect());
