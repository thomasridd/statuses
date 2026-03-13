import { formatTime, formatValueWithUnit, isCurrencyUnit } from '../lib/format'
import type { Status } from '../types'

interface StatusTodayStats {
  count: number
  lastAt: string
  total?: number
}

interface StatusCardProps {
  status: Status
  onLog: (status: Status) => void
  onLogCustom: (status: Status) => void
  disabled?: boolean
  todayStats?: StatusTodayStats
}

function formatSubtitle(stats: StatusTodayStats, status: Status): string {
  const time = formatTime(stats.lastAt)
  const countPart = stats.count === 1 ? `Once · ${time}` : `${stats.count}× · ${time}`
  if (stats.total != null && isCurrencyUnit(status.unit ?? null)) {
    return `${countPart} · ${formatValueWithUnit(stats.total, status.unit ?? null)} total`
  }
  return countPart
}

export default function StatusCard({ status, onLog, onLogCustom, disabled, todayStats }: StatusCardProps) {
  const isValue = status.type === 'value'
  const label = status.label

  return (
    <div className="flex items-center rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
      <span className="flex-1 px-3 py-2.5 min-w-0">
        <span className="block text-sm font-medium text-gray-800 leading-snug truncate">{label}</span>
        {todayStats && (
          <span className="block text-xs text-gray-400 leading-tight mt-0.5">{formatSubtitle(todayStats, status)}</span>
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
