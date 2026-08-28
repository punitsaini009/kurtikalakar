import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Querying storage.objects...');
  try {
    const objects = await prisma.$queryRaw`SELECT * FROM storage.objects LIMIT 10`;
    console.log(objects);
  } catch (e) {
    console.error('Error querying storage:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
