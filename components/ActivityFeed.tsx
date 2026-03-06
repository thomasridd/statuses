import { LogEvent } from '@/lib/types'
import clsx from 'clsx'

interface ActivityFeedProps {
  logs: LogEvent[]
}

const levelConfig = {
  INFO: { dot: 'bg-blue-400', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-700' },
  WARN: { dot: 'bg-yellow-400', text: 'text-yellow-600', badge: 'bg-yellow-50 text-yellow-700' },
  ERROR: { dot: 'bg-red-400', text: 'text-red-600', badge: 'bg-red-50 text-red-700' },
  DEBUG: { dot: 'bg-slate-300', text: 'text-slate-500', badge: 'bg-slate-50 text-slate-600' },
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function ActivityFeed({ logs }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-800">Event Activity</h2>
        <p className="text-xs text-slate-400 mt-0.5">Recent system events and transitions</p>
      </div>
      <div className="divide-y divide-slate-50">
        {logs.map((log, i) => {
          const config = levelConfig[log.level]
          return (
            <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
              <div className={clsx('w-2 h-2 rounded-full mt-1.5 shrink-0', config.dot)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400">{formatTime(log.timestamp)}</span>
                  <span
                    className={clsx(
                      'text-xs font-semibold px-1.5 py-0.5 rounded',
                      config.badge
                    )}
                  >
                    {log.level}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{log.service}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">{log.event_type}</span>
                </div>
                <p className="text-sm text-slate-700 mt-0.5">{log.message}</p>
                <p className="text-xs text-slate-400 font-mono">entity: {log.entity_id.slice(0, 16)}…</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
