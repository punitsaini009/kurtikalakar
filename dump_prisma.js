const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const models = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
  for (const model of models) {
    if (typeof prisma[model].findMany === 'function') {
      const data = await prisma[model].findMany();
      if (data.length > 0) {
        const jsonStr = JSON.stringify(data);
        if (jsonStr.toLowerCase().includes('gurjar')) {
            console.log(`FOUND IN ${model}:`, jsonStr);
        }
      }
    }
  }
  console.log("Done");
}
main().catch(console.error).finally(() => prisma.$disconnect());
