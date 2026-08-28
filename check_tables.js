const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRawUnsafe(`
      SELECT table_catalog, table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    `);
    console.log("DB Tables:", JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("Query Error:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
