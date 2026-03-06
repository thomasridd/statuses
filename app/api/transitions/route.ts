import { NextRequest, NextResponse } from 'next/server'
import { mockTransitions } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const entityId = searchParams.get('entity_id')

  let transitions = mockTransitions

  if (entityId) {
    transitions = transitions.filter((t) => t.entity_id === entityId)
  }

  return NextResponse.json({
    data: transitions,
    total: transitions.length,
    timestamp: new Date().toISOString(),
  })
}
