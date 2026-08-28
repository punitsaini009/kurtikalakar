const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('WebsiteSettings:', await prisma.websiteSettings.findMany());
  console.log('ContactSettings:', await prisma.contactSettings.findMany());
  console.log('ShippingSettings:', await prisma.shippingSettings.findMany());
}
main().catch(console.error).finally(() => prisma.$disconnect());
