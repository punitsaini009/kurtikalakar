const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const url = 'https://74mncgr7.us-east.insforge.app/api/storage/buckets/payment_qr/objects/1786789437122-962102623.jpeg?v=4f50e85b0a08d3f05dd57454d0cde50c';
  await prisma.websiteSettings.update({
    where: { id: 1 },
    data: { qrCodeUrl: url }
  });
  console.log("Updated website settings to correct URL");
}
main().finally(() => prisma.$disconnect());
