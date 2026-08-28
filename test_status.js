const { PrismaClient } = require('@prisma/client');
const { encode } = require('next-auth/jwt');
const prisma = new PrismaClient();

async function testStatusUpdate() {
  // Find a pending order
  const order = await prisma.order.findFirst({
    where: { status: 'PENDING' }
  });

  if (!order) {
    console.log('No PENDING order found.');
    return;
  }
  
  console.log(`Found PENDING order: ${order.id}`);

  // Create an ADMIN token
  const secret = 'K9xP7mQ2vL8nR4sT6wY1zA7';
  const tokenStr = await encode({
    token: { email: 'admin@kurtikalakar.com', role: 'ADMIN', id: 'cmshh93i00000tpfgexu15tnw' },
    secret
  });

  const url = `http://localhost:3000/api/admin/orders/${order.id}/status`;
  console.log(`Sending PATCH request to ${url} with status: PAID`);

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Cookie': `next-auth.session-token=${tokenStr}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'PAID' })
    });

    console.log(`Status code: ${res.status}`);
    const text = await res.text();
    console.log(`Response: ${text}`);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testStatusUpdate()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
