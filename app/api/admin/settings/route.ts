import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    
    // Update Website Settings
    if (data.type === 'WEBSITE') {
      const websiteSettings = await prisma.websiteSettings.upsert({
        where: { id: 1 },
        update: {
          logoUrl: data.logoUrl,
          qrCodeUrl: data.qrCodeUrl,
          heroBannerUrl: data.heroBannerUrl
        },
        create: {
          id: 1,
          logoUrl: data.logoUrl,
          qrCodeUrl: data.qrCodeUrl,
          heroBannerUrl: data.heroBannerUrl
        }
      })
      return NextResponse.json(websiteSettings)
    } 
    
    // Update Contact Settings
    else if (data.type === 'CONTACT') {
      const contactSettings = await prisma.contactSettings.upsert({
        where: { id: 1 },
        update: {
          whatsappNumber: data.whatsappNumber,
          instagramLink: data.instagramLink,
          contactNumber: data.contactNumber,
          supportEmail: data.supportEmail,
          address: data.address
        },
        create: {
          id: 1,
          whatsappNumber: data.whatsappNumber,
          instagramLink: data.instagramLink,
          contactNumber: data.contactNumber,
          supportEmail: data.supportEmail,
          address: data.address
        }
      })
      return NextResponse.json(contactSettings)
    }

    return NextResponse.json({ error: 'Invalid settings type' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
