import { NextRequest, NextResponse } from 'next/server'
import { mockEntities, mockTransitions } from '@/lib/mockData'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const entity = mockEntities.find((e) => e.entity_id === params.id || e.id === params.id)

  if (!entity) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
  }

  const transitions = mockTransitions.filter((t) => t.entity_id === entity.entity_id)

  return NextResponse.json({ data: entity, transitions })
}
