const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    await prisma.$executeRawUnsafe(`CREATE POLICY "bucket_select" ON storage.buckets FOR SELECT TO public USING (true);`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "objects_all" ON storage.objects FOR ALL TO public USING (bucket = 'products') WITH CHECK (bucket = 'products');`);
    console.log('Policies created.');
  } catch (e) {
    console.log(e.message);
  }
}
run().then(() => prisma.$disconnect());
