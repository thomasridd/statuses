import { NextRequest, NextResponse } from 'next/server'
import { mockEntities } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  let entities = mockEntities

  if (status) {
    entities = entities.filter((e) => e.status === status.toUpperCase())
  }
  if (type) {
    entities = entities.filter((e) => e.entity_type === type.toLowerCase())
  }

  return NextResponse.json({
    data: entities,
    total: entities.length,
    timestamp: new Date().toISOString(),
  })
}
