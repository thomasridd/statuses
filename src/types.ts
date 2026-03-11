export interface Motive {
  id: string
  name: string
  order: number
}

export interface Status {
  id: string
  label: string
  motive_id: string
  type: 'simple' | 'value'
  unit: string | null
  default_value: number | null
  enabled: boolean
  order: number
  pinned: boolean
  status_category?: 'task' | 'badge'
  criteria?: string
  valence?: 'positive' | 'negative'
}

export interface LogEntry {
  id: string
  status_id: string
  timestamp: string
  value: number | null
}

export interface TodayEntry {
  entry: LogEntry
  status: Status
}

export interface TodayGroup {
  motive: Motive
  entries: TodayEntry[]
}

export interface ValueTotal {
  status: Status
  total: number
}

export interface SimpleCount {
  status: Status
  count: number
}

export interface SummaryResponse {
  today: TodayGroup[]
  weekStart: string
  weekEnd: string
  weekValueTotals: ValueTotal[]
  weekSimpleCounts: SimpleCount[]
}

export interface ContextMembership {
  status_id: string
  order: number
}

export interface Context {
  id: string
  name: string
  order: number
  statuses: ContextMembership[]
}

export interface StatusesResponse {
  motives: Motive[]
  statuses: Status[]
}

export interface ContextsResponse {
  contexts: Context[]
}

export interface UpdateContextsResponse {
  ok: boolean
}

export interface LogsResponse {
  logs: LogEntry[]
}

export interface PostLogResponse {
  ok: boolean
  entry: LogEntry
}

export interface UpdateStatusesResponse {
  ok: boolean
}

export interface GoldStar {
  id: string
  caption: string
  notes: string
  created_at: string
  completed_at?: string
  order: number
}

export interface GoldStarsResponse {
  goldStars: GoldStar[]
}

export interface UpdateGoldStarsResponse {
  ok: boolean
}
