const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);
const prisma = new PrismaClient();

async function uploadFile(filename) {
  const localPath = path.join(__dirname, 'public', 'uploads', filename);
  if (!fs.existsSync(localPath)) {
    console.log(`File not found locally: ${localPath}`);
    return null;
  }
  
  console.log(`Uploading ${filename}...`);
  try {
    await execAsync(`npx.cmd @insforge/cli storage upload --bucket products --key "${filename}" "public/uploads/${filename}"`);
    const publicUrl = `https://74mncgr7.us-east.insforge.app/api/storage/buckets/products/objects/${filename}`;
    console.log(`Successfully uploaded to ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error(`Failed to upload ${filename}:`, err.message);
    return null;
  }
}

async function main() {
  const products = await prisma.product.findMany();
  let updatedCount = 0;

  // Fix products
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
      if (image.includes('/uploads/')) {
        const filename = image.split('/uploads/').pop();
        const newUrl = await uploadFile(filename);
        if (newUrl) {
          newImages.push(newUrl);
          hasChanges = true;
        } else {
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

  console.log(`Updated ${updatedCount} products.`);

  // Fix settings QR code
  const settings = await prisma.websiteSettings.findMany();
  if (settings.length > 0) {
    const setting = settings[0];
    if (setting.qrCodeUrl && setting.qrCodeUrl.includes('/uploads/')) {
      const filename = setting.qrCodeUrl.split('/uploads/').pop();
      const newUrl = await uploadFile(filename);
      if (newUrl) {
        await prisma.websiteSettings.update({
          where: { id: setting.id },
          data: { qrCodeUrl: newUrl }
        });
        console.log(`Updated WebsiteSettings QR code.`);
      }
    }
  }

  // Also check other images like hero banners, logo, etc.
  if (settings.length > 0) {
    const setting = settings[0];
    let updates = {};
    if (setting.logoUrl && setting.logoUrl.includes('/uploads/')) {
       const url = await uploadFile(setting.logoUrl.split('/uploads/').pop());
       if (url) updates.logoUrl = url;
    }
    if (setting.heroBannerUrl && setting.heroBannerUrl.includes('/uploads/')) {
       const url = await uploadFile(setting.heroBannerUrl.split('/uploads/').pop());
       if (url) updates.heroBannerUrl = url;
    }
    if (Object.keys(updates).length > 0) {
      await prisma.websiteSettings.update({ where: { id: setting.id }, data: updates });
      console.log('Updated WebsiteSettings logo/hero.');
    }
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
