import { NextResponse } from 'next/server'
import { mockEntities, mockTimeSeriesData, mockFailureReasons, mockServiceHealth } from '@/lib/mockData'

export async function GET() {
  const total = mockEntities.length
  const succeeded = mockEntities.filter((e) => e.status === 'SUCCEEDED').length
  const failed = mockEntities.filter((e) => e.status === 'FAILED').length
  const processing = mockEntities.filter((e) => e.status === 'PROCESSING').length

  return NextResponse.json({
    kpis: {
      total_entities: total,
      active_jobs: processing,
      failures: failed,
      success_rate: ((succeeded / total) * 100).toFixed(1),
    },
    time_series: mockTimeSeriesData,
    failure_reasons: mockFailureReasons,
    service_health: mockServiceHealth,
    timestamp: new Date().toISOString(),
  })
}
