import type { Status } from '../types'

interface StatusCardProps {
  status: Status
  onLog: (status: Status, logged_by: 'me' | 'team') => void
  onLogCustom: (status: Status, logged_by: 'me' | 'team') => void
  disabled?: boolean
}

export default function StatusCard({ status, onLog, onLogCustom, disabled }: StatusCardProps) {
  const isValue = status.type === 'value'
  const label = isValue
    ? `${status.label} ${status.default_value}${status.unit}`
    : status.label

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
      <div className="px-3 py-2 text-sm font-medium text-gray-800 leading-snug">
        {label}
      </div>
      <div className="flex border-t border-gray-100">
        <button
          className="flex-1 py-2 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 disabled:opacity-50 border-r border-gray-100"
          onClick={() => isValue ? onLogCustom(status, 'me') : onLog(status, 'me')}
          disabled={disabled}
        >
          Log for me
        </button>
        <button
          className="flex-1 py-2 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 active:bg-violet-200 disabled:opacity-50"
          onClick={() => isValue ? onLogCustom(status, 'team') : onLog(status, 'team')}
          disabled={disabled}
        >
          Log for team
        </button>
      </div>
    </div>
  )
}
