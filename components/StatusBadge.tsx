import { Status } from '@/lib/types'
import clsx from 'clsx'

const statusConfig: Record<Status, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  PROCESSING: { label: 'Processing', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  SUCCEEDED: { label: 'Succeeded', className: 'bg-green-100 text-green-700 border-green-200' },
  FAILED: { label: 'Failed', className: 'bg-red-100 text-red-700 border-red-200' },
  CANCELLED: { label: 'Cancelled', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  RETRYING: { label: 'Retrying', className: 'bg-purple-100 text-purple-700 border-purple-200' },
}

export default function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status]
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
