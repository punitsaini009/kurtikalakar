const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING TRACKING TEST ---');
  
  // 1. Create a dummy user and order
  const user = await prisma.user.create({
    data: { email: 'test_tracking@example.com', name: 'Test Track User', role: 'USER' }
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total: 1000,
      status: 'PENDING'
    }
  });
  console.log(`Created Order ${order.id}`);

  // 2. Simulate Admin status changes (mocking the API route logic)
  const statuses = [
    'ORDER_CONFIRMED', 
    'PROCESSING', 
    'SHIPPED', 
    'DELIVERY_ATTEMPTED', 
    'OUT_FOR_DELIVERY', 
    'DELIVERED'
  ];

  for (const status of statuses) {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: status
        }
      });
    });
    console.log(`Transitioned to: ${status}`);
    // Wait a brief moment to ensure timestamps differ slightly
    await new Promise(r => setTimeout(r, 100)); 
  }

  // 3. Verify history
  const history = await prisma.orderStatusHistory.findMany({
    where: { orderId: order.id },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`\nFound ${history.length} history records.`);
  let passed = true;
  for (let i = 0; i < statuses.length; i++) {
    if (history[i].status !== statuses[i]) {
      passed = false;
      console.error(`Mismatch at step ${i}: Expected ${statuses[i]}, got ${history[i].status}`);
    } else {
      console.log(`Verified History: ${history[i].status} at ${history[i].createdAt}`);
    }
  }

  if (passed && history.length === 6) {
    console.log('\n✅ DB History Test: PASS');
  } else {
    console.error('\n❌ DB History Test: FAIL');
  }

  // Cleanup
  await prisma.orderStatusHistory.deleteMany({ where: { orderId: order.id } });
  await prisma.order.delete({ where: { id: order.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log('Cleanup complete.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
