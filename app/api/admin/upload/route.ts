import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import path from 'path'
import { createAdminClient } from '@insforge/sdk'

import fs from 'fs'

// Helper to get Admin Client
function getAdminClient() {
  let apiKey = process.env.INSFORGE_API_KEY || ''
  if (!apiKey) {
    try {
      const projectJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.insforge', 'project.json'), 'utf8'))
      apiKey = projectJson.api_key
    } catch (e) {
      console.warn('Could not read project.json for local fallback')
    }
  }
  return createAdminClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || '',
    apiKey
  })
}
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Sanitize and create unique filename
    const ext = path.extname(file.name) || '.png'
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    // Convert Next.js File to Buffer for standard upload
    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: file.type })
    
    // Upload to InsForge Storage using Admin Client
    const adminClient = getAdminClient()
    const { data, error } = await adminClient.storage
      .from('payment_qr')
      .upload(uniqueFilename, blob)

    if (error || !data) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: error?.message || 'Failed to upload' }, { status: 500 })
    }
    
    return NextResponse.json({ url: data.url, key: data.key })
  } catch (error) {
    console.error('Upload catch error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
