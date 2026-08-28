const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ take: 5 });
  products.forEach(p => console.log(p.name, p.images));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
