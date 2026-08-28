const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: 'cmslqfs7i0001tpd4z0x4q3sc' },
        data: { status: 'PAID' }
      });
      await tx.orderStatusHistory.create({
        data: {
          orderId: 'cmslqfs7i0001tpd4z0x4q3sc',
          status: 'PAID'
        }
      });
      return updatedOrder;
    });
    console.log(res);
  } catch (e) {
    console.error('DB ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
