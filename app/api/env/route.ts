import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ env: Object.keys(process.env).filter(k => k.includes('INSFORGE')) })
}
