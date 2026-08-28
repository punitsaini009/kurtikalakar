import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const qrUrl = 'https://74mncgr7.us-east.insforge.app/api/storage/buckets/payment_qr/objects/6318942962225713354_120.jpg';
const upiId = 'gurjar200@fam';

async function main() {
  console.log('Proceeding with database insert...');
  
  const record = await prisma.paymentSettings.create({
    data: {
      id: 1, // Make sure it's 1 so it's the primary record
      upiId: upiId,
      qrCodeUrl: qrUrl,
      paymentInstructions: 'Please ensure UTR is correct.',
      accountName: 'Gurjar',
    }
  });
  console.log('Inserted Record:', record);

  // Verify read
  console.log('Verifying read...');
  const readBack = await prisma.paymentSettings.findUnique({ where: { id: 1 } });
  console.log('Read Back:', readBack);
}

main().catch(console.error).finally(async () => await prisma.$disconnect());
