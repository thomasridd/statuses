import { formatTime } from '../lib/format'
import type { Status } from '../types'

interface StatusTodayStats {
  count: number
  lastAt: string
}

interface StatusCardProps {
  status: Status
  onLog: (status: Status) => void
  onLogCustom: (status: Status) => void
  disabled?: boolean
  todayStats?: StatusTodayStats
}

function formatSubtitle(stats: StatusTodayStats): string {
  const time = formatTime(stats.lastAt)
  if (stats.count === 1) return `Once · ${time}`
  return `${stats.count}× · ${time}`
}

export default function StatusCard({ status, onLog, onLogCustom, disabled, todayStats }: StatusCardProps) {
  const isValue = status.type === 'value'
  const label = isValue
    ? `${status.label} ${status.default_value}${status.unit}`
    : status.label

  return (
    <div className="flex items-center rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
      <span className="flex-1 px-3 py-2.5 min-w-0">
        <span className="block text-sm font-medium text-gray-800 leading-snug truncate">{label}</span>
        {todayStats && (
          <span className="block text-xs text-gray-400 leading-tight mt-0.5">{formatSubtitle(todayStats)}</span>
        )}
      </span>
      <button
        className="shrink-0 px-3 py-2.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 disabled:opacity-50 border-l border-gray-100"
        onClick={() => isValue ? onLogCustom(status) : onLog(status)}
        disabled={disabled}
      >
        Log
      </button>
    </div>
  )
}
