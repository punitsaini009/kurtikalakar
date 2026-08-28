import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.paymentSettings.findFirst();
    const websiteSettings = await prisma.websiteSettings.findFirst();
    return NextResponse.json({
      ...(settings || {}),
      qrCodeUrl: settings?.qrCodeUrl || null,
      fallbackQrCodeUrl: websiteSettings?.qrCodeUrl || null
    });
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
