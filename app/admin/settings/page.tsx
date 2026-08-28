import { prisma } from '../../../lib/prisma'
import SettingsClient from './SettingsClient'

export default async function AdminSettingsPage() {
  const [websiteSettings, contactSettings] = await prisma.$transaction([
    prisma.websiteSettings.findUnique({ where: { id: 1 } }),
    prisma.contactSettings.findUnique({ where: { id: 1 } })
  ])

  return (
    <div>
      <SettingsClient 
        initialWebsite={websiteSettings || {}} 
        initialContact={contactSettings || {}} 
      />
    </div>
  )
}
