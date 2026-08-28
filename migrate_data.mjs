import { PrismaClient as SqliteClient } from './prisma/sqlite-client/index.js';
import { PrismaClient as PostgresClient } from '@prisma/client';

const sqlite = new SqliteClient();
const postgres = new PostgresClient();

async function main() {
  console.log('Connecting to databases...');
  await sqlite.$connect();
  await postgres.$connect();

  console.log('Fetching users...');
  const users = await sqlite.user.findMany();
  console.log(`Found ${users.length} users. Transferring...`);
  if (users.length > 0) {
    await postgres.user.createMany({ data: users });
  }

  console.log('Fetching products...');
  const products = await sqlite.product.findMany();
  console.log(`Found ${products.length} products. Transferring...`);
  if (products.length > 0) {
    await postgres.product.createMany({ data: products });
  }

  console.log('Fetching categories...');
  const categories = await sqlite.category.findMany();
  console.log(`Found ${categories.length} categories. Transferring...`);
  if (categories.length > 0) {
    await postgres.category.createMany({ data: categories });
  }

  console.log('Fetching inventory...');
  const inventory = await sqlite.inventory.findMany();
  console.log(`Found ${inventory.length} inventory records. Transferring...`);
  if (inventory.length > 0) {
    await postgres.inventory.createMany({ data: inventory });
  }

  console.log('Fetching orders...');
  const orders = await sqlite.order.findMany();
  console.log(`Found ${orders.length} orders. Transferring...`);
  if (orders.length > 0) {
    await postgres.order.createMany({ data: orders });
  }

  console.log('Fetching order items...');
  const orderItems = await sqlite.orderItem.findMany();
  console.log(`Found ${orderItems.length} order items. Transferring...`);
  if (orderItems.length > 0) {
    await postgres.orderItem.createMany({ data: orderItems });
  }

  console.log('Fetching payments...');
  const payments = await sqlite.payment.findMany();
  console.log(`Found ${payments.length} payments. Transferring...`);
  if (payments.length > 0) {
    await postgres.payment.createMany({ data: payments });
  }

  console.log('Fetching hero banners...');
  const banners = await sqlite.heroBanner.findMany();
  console.log(`Found ${banners.length} banners. Transferring...`);
  if (banners.length > 0) {
    await postgres.heroBanner.createMany({ data: banners });
  }

  console.log('Fetching website settings...');
  const website = await sqlite.websiteSettings.findMany();
  console.log(`Found ${website.length} website settings. Transferring...`);
  if (website.length > 0) {
    await postgres.websiteSettings.createMany({ data: website });
  }

  console.log('Fetching contact settings...');
  const contact = await sqlite.contactSettings.findMany();
  console.log(`Found ${contact.length} contact settings. Transferring...`);
  if (contact.length > 0) {
    await postgres.contactSettings.createMany({ data: contact });
  }

  console.log('Fetching shipping settings...');
  const shipping = await sqlite.shippingSettings.findMany();
  console.log(`Found ${shipping.length} shipping settings. Transferring...`);
  if (shipping.length > 0) {
    await postgres.shippingSettings.createMany({ data: shipping });
  }

  console.log('Migration complete!');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await sqlite.$disconnect();
    await postgres.$disconnect();
  });
