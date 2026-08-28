const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const settings = await prisma.paymentSettings.findFirst();
    const websiteSettings = await prisma.websiteSettings.findFirst();
    const result = {
      ...(settings || {}),
      qrCodeUrl: settings?.qrCodeUrl || websiteSettings?.qrCodeUrl || null
    };
    console.log("Resolved QR Code URL:", result.qrCodeUrl);
  } catch(e) {
    console.log("Error:", e.message);
  }
}
main().finally(() => prisma.$disconnect());
