const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.order.create({
    data: {
      userId: 'cmskeggdl0000tprk74evf9wn',
      total: 100,
      status: 'PENDING'
    }
  });
  console.log('Created pending order');
  await prisma.$disconnect();
}
main();
