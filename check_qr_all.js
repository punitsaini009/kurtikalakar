const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pss = await prisma.paymentSettings.findMany();
  console.log("All PaymentSettings:", JSON.stringify(pss, null, 2));
}
main().finally(() => prisma.$disconnect());
