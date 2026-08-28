const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst();
  if (product) {
    console.log("Sizes format in DB:", typeof product.sizes, product.sizes);
  } else {
    console.log("No products found");
  }
}
main().finally(() => prisma.$disconnect());
