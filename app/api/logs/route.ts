import { NextRequest, NextResponse } from 'next/server'
import { mockLogs } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const level = searchParams.get('level')
  const service = searchParams.get('service')
  const traceId = searchParams.get('trace_id')
  const entityId = searchParams.get('entity_id')

  let logs = mockLogs

  if (level) {
    logs = logs.filter((l) => l.level === level.toUpperCase())
  }
  if (service) {
    logs = logs.filter((l) => l.service === service)
  }
  if (traceId) {
    logs = logs.filter((l) => l.trace_id === traceId)
  }
  if (entityId) {
    logs = logs.filter((l) => l.entity_id === entityId)
  }

  return NextResponse.json({
    data: logs,
    total: logs.length,
    timestamp: new Date().toISOString(),
  })
}
