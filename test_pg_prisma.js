const { PrismaClient } = require('@prisma/client');
try {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: 'postgresql://postgres:ik_78c14aea78b50d58e799cad00b823ffd@db.74mncgr7.us-east.insforge.app:5432/postgres' }
    }
  });
  console.log('Client created');
  prisma.$connect().then(() => console.log('Connected')).catch(e => console.log('Conn error', e.message));
} catch(e) {
  console.log('Init error', e.message);
}
