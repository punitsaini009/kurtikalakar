const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  console.log("Products in DB:");
  products.forEach(p => console.log(p.id, p.name));
}
main().finally(() => prisma.$disconnect());
