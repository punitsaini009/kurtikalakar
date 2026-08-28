const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.$queryRawUnsafe(`SELECT count(*) FROM public.Order`);
    console.log("Unquoted Order worked");
  } catch(e) {
    console.log("Unquoted Order failed:", e.message);
  }
  try {
    await prisma.$queryRawUnsafe(`SELECT count(*) FROM public."Order"`);
    console.log("Quoted Order worked");
  } catch(e) {
    console.log("Quoted Order failed:", e.message);
  }
}
main().finally(() => prisma.$disconnect());
