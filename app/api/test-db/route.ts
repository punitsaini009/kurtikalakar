import { NextResponse } from 'next/server'
import { insforgeClient } from '../../../lib/insforge'

export async function GET() {
  const { data, error } = await insforgeClient.database.from('payment_settings').select('*')
  return NextResponse.json({ data, error })
}
