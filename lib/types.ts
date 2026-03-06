export type Status = 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'RETRYING'

export type EntityType = 'job' | 'workflow' | 'task' | 'request'

export interface EntityStatus {
  id: string
  entity_id: string
  entity_type: EntityType
  status: Status
  status_reason: string
  updated_at: string
  updated_by: string
  version: number
  metadata: Record<string, unknown>
}

export interface StatusTransition {
  id: string
  entity_id: string
  from_status: Status
  to_status: Status
  trigger: string
  reason: string
  timestamp: string
  actor: string
  correlation_id: string
}

export interface LogEvent {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  service: string
  environment: string
  message: string
  trace_id: string
  span_id: string
  correlation_id: string
  entity_id: string
  entity_type: EntityType
  event_type: string
  payload: Record<string, unknown>
  host: string
  version: string
}

export interface KPI {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export interface TimeSeriesDataPoint {
  time: string
  requests?: number
  succeeded?: number
  failed?: number
  retrying?: number
  throughput?: number
  p50?: number
  p95?: number
  p99?: number
}
