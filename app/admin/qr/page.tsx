import { prisma } from '../../../lib/prisma'
import QRClient from './QRClient'

export default async function AdminQRPage() {
  const settings = await prisma.websiteSettings.findUnique({
    where: { id: 1 }
  })

  return (
    <div>
      <QRClient initialUrl={settings?.qrCodeUrl || ''} />
    </div>
  )
}
