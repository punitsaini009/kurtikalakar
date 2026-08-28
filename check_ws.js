const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ws = await prisma.websiteSettings.findMany();
  console.log("All WebsiteSettings:", JSON.stringify(ws, null, 2));
}
main().finally(() => prisma.$disconnect());
