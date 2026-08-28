const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const fullSizes = JSON.stringify(["S","M","L","XL","XXL","3XL","4XL","5XL","6XL"]);
  
  // Update all products in the database to the full size list
  const result = await prisma.product.updateMany({
    data: {
      sizes: fullSizes
    }
  });
  
  console.log(`Updated ${result.count} products to use the complete size list: ["S","M","L","XL","XXL","3XL","4XL","5XL","6XL"]`);
  
  // Fetch final stats for the report
  const allProds = await prisma.product.findMany();
  
  let catCounts = {};
  for(const p of allProds) {
    catCounts[p.collection] = (catCounts[p.collection] || 0) + 1;
  }
  
  console.log('Category Distribution:', catCounts);
  
}

main().catch(console.error).finally(() => prisma.$disconnect());
