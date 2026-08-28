const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.paymentSettings.findFirst();
  const webSettings = await prisma.websiteSettings.findFirst();
  console.log("Payment settings:", settings);
  console.log("Website settings:", webSettings);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
