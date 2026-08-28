const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  let updatedCount = 0;

  for (const product of products) {
    let images = [];
    try {
      images = JSON.parse(product.images);
    } catch (e) {
      if (typeof product.images === 'string' && product.images.trim().length > 0) {
        images = [product.images];
      }
    }

    if (!Array.isArray(images)) images = [];

    const newImages = [];
    let hasChanges = false;

    for (const image of images) {
      if (image.startsWith('/uploads/')) {
        const filename = image.replace('/uploads/', '');
        const localPath = path.join(__dirname, 'public', 'uploads', filename);

        if (fs.existsSync(localPath)) {
          console.log(`Uploading ${filename}...`);
          try {
            // Upload using CLI
            execSync(`npx.cmd @insforge/cli storage upload --bucket products --key ${filename} "public/uploads/${filename}"`, { stdio: 'pipe' });
            const publicUrl = `https://74mncgr7.us-east.insforge.app/api/storage/buckets/products/objects/${filename}`;
            newImages.push(publicUrl);
            hasChanges = true;
            console.log(`Successfully uploaded to ${publicUrl}`);
          } catch (err) {
            console.error(`Failed to upload ${filename}`, err.message);
            newImages.push(image); // fallback to old
          }
        } else {
          console.log(`File not found locally: ${localPath}`);
          // If we already uploaded it on a previous run but the DB didn't update or we lost local file
          // but we want to retain the URL. Actually if it's missing, maybe it's broken. We'll leave it as is or try to use a fallback.
          newImages.push(image);
        }
      } else {
        newImages.push(image);
      }
    }

    if (hasChanges) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: JSON.stringify(newImages) }
      });
      console.log(`Updated product ${product.id}`);
      updatedCount++;
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} products.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
