import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- POSTGRESQL MIGRATION VERIFICATION ---');

  const userCount = await prisma.user.count();
  console.log(`Users: ${userCount}`);
  if (userCount > 0) {
    const sampleUser = await prisma.user.findFirst();
    console.log(`Sample User: ${sampleUser?.email} (${sampleUser?.role})`);
  }

  const productCount = await prisma.product.count();
  console.log(`Products: ${productCount}`);
  if (productCount > 0) {
    const sampleProduct = await prisma.product.findFirst();
    console.log(`Sample Product: ${sampleProduct?.name}, Price: ${sampleProduct?.price}, Stock: ${sampleProduct?.stock}, Sizes: ${sampleProduct?.sizes}`);
  }

  const orderCount = await prisma.order.count();
  console.log(`Orders: ${orderCount}`);

  const orderItemCount = await prisma.orderItem.count();
  console.log(`Order Items: ${orderItemCount}`);

  const paymentCount = await prisma.payment.count();
  console.log(`Payments: ${paymentCount}`);

  const paymentSettingsCount = await prisma.paymentSettings.count();
  console.log(`Payment Settings: ${paymentSettingsCount}`);
}

main()
  .catch(e => {
    console.error('Error connecting to Postgres:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
