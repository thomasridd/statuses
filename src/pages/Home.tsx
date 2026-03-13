import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { formatTime, formatDate, formatStatusLabel, todayISO } from '../lib/format'
import StatusCard from '../components/StatusCard'
import ValueModal from '../components/ValueModal'
import Toast from '../components/Toast'
import DayNav from '../components/DayNav'
import type { Status, LogEntry, Context } from '../types'

interface StatusTodayStats {
  count: number
  lastAt: string
  total?: number
}

function getTodayStart(): Date {
  const now = new Date()
  const cutoff = new Date(now)
  cutoff.setHours(4, 30, 0, 0)
  if (now < cutoff) {
    cutoff.setDate(cutoff.getDate() - 1)
  }
  return cutoff
}

function computeTodayStats(logs: LogEntry[], statusMap: Record<string, Status>): Record<string, StatusTodayStats> {
  const stats: Record<string, StatusTodayStats> = {}
  // logs are sorted newest first
  for (const entry of logs) {
    if (!stats[entry.status_id]) {
      stats[entry.status_id] = { count: 1, lastAt: entry.timestamp }
    } else {
      stats[entry.status_id].count++
    }
    const status = statusMap[entry.status_id]
    if (status?.type === 'value' && entry.value != null) {
      stats[entry.status_id].total = (stats[entry.status_id].total ?? 0) + entry.value
    }
  }
  return stats
}

export default function Home() {
  const [statuses, setStatuses] = useState<Status[]>([])
  const [contexts, setContexts] = useState<Context[]>([])
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([])
  const [todayStats, setTodayStats] = useState<Record<string, StatusTodayStats>>({})
  const [statusMap, setStatusMap] = useState<Record<string, Status>>({})
  const statusMapRef = useRef<Record<string, Status>>({})
  const [toast, setToast] = useState('')
  const [customEntry, setCustomEntry] = useState<Status | null>(null)
  const [logging, setLogging] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const isActualToday = selectedDate === todayISO()

  async function fetchDayLogs(date: string): Promise<LogEntry[]> {
    if (date === todayISO()) {
      const todayStart = getTodayStart()
      const { logs } = await api.getLogs({ since: todayStart.toISOString() })
      return logs
    }
    const { logs } = await api.getLogs({ date })
    return logs
  }

  const loadData = useCallback(async () => {
    try {
      const [{ statuses: allStatuses }, { contexts: allContexts }] = await Promise.all([
        api.getStatuses(),
        api.getContexts(),
      ])

      const enabled = allStatuses.filter(s => s.enabled && s.status_category !== 'badge')
      const map = Object.fromEntries(allStatuses.map(s => [s.id, s]))
      statusMapRef.current = map
      setStatusMap(map)
      setContexts(allContexts.sort((a, b) => a.order - b.order))
      setStatuses(enabled)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadLogs = useCallback(async (date: string) => {
    const isToday = date === todayISO()
    const [dayLogs, recentResult] = await Promise.all([
      fetchDayLogs(date),
      isToday ? api.getLogs({ limit: 20 }) : api.getLogs({ date }),
    ])
    setTodayStats(computeTodayStats(dayLogs, statusMapRef.current))
    setRecentLogs(recentResult.logs)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    loadLogs(selectedDate)
  }, [selectedDate, loadLogs])

  function backdatedTimestamp(date: string): string | undefined {
    if (date === todayISO()) return undefined
    return `${date}T12:00:00.000Z`
  }

  async function logStatus(status: Status, value?: number) {
    setLogging(true)
    try {
      const logValue = value !== undefined ? value : (status.type === 'value' ? status.default_value ?? undefined : undefined)
      const ts = backdatedTimestamp(selectedDate)
      await api.postLog(status.id, logValue, ts)
      const label = formatStatusLabel(status, logValue ?? null)
      setToast(`Logged: ${label}`)
      await loadLogs(selectedDate)
    } catch {
      setToast('Error logging status')
    } finally {
      setLogging(false)
    }
  }

  function handleLogCustom(status: Status) {
    setCustomEntry(status)
  }

  async function handleCustomConfirm(value: number) {
    const entry = customEntry
    setCustomEntry(null)
    if (entry) await logStatus(entry, value)
  }

  const enabledStatusIds = new Set(statuses.map(s => s.id))

  const contextSections = contexts.map(ctx => ({
    context: ctx,
    statuses: ctx.statuses
      .filter(m => enabledStatusIds.has(m.status_id))
      .sort((a, b) => a.order - b.order)
      .map(m => statusMap[m.status_id])
      .filter(Boolean) as Status[],
  })).filter(s => s.statuses.length > 0)

  const contextStatusIds = new Set(contexts.flatMap(ctx => ctx.statuses.map(m => m.status_id)))
  const ungroupedStatuses = statuses.filter(s => !contextStatusIds.has(s.id))

  const activityTitle = isActualToday ? 'Recent activity' : 'Day activity'

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <header className="bg-white border-b border-gray-200 sticky top-12 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Status Logger</h1>
            <Link to="/analytics" className="text-sm text-sky-600 font-medium">
              Summary →
            </Link>
          </div>
          <DayNav date={selectedDate} onChange={setSelectedDate} />
        </div>
      </header>

      <main className="px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            {contextSections.map(({ context, statuses: ctxStatuses }) => (
              <section key={context.id} className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {context.name}
                </h2>
                <div className="flex flex-col gap-2">
                  {ctxStatuses.map(status => (
                    <StatusCard
                      key={status.id}
                      status={status}
                      onLog={logStatus}
                      onLogCustom={handleLogCustom}
                      disabled={logging}
                      todayStats={todayStats[status.id]}
                    />
                  ))}
                </div>
              </section>
            ))}

            {ungroupedStatuses.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Other
                </h2>
                <div className="flex flex-col gap-2">
                  {ungroupedStatuses.map(status => (
                    <StatusCard
                      key={status.id}
                      status={status}
                      onLog={logStatus}
                      onLogCustom={handleLogCustom}
                      disabled={logging}
                      todayStats={todayStats[status.id]}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className="mt-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {activityTitle}
              </h2>
              {recentLogs.length === 0 ? (
                <p className="text-gray-400 text-sm">No activity yet. Start logging above!</p>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {recentLogs.map((entry, i) => {
                    const status = statusMap[entry.status_id]
                    if (!status) return null
                    return (
                      <div
                        key={entry.id}
                        className={`flex items-center gap-3 px-4 py-3 ${i < recentLogs.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <span className="text-xs text-gray-400 w-12 shrink-0 font-mono">
                          {formatTime(entry.timestamp)}
                        </span>
                        {!isActualToday && (
                          <span className="text-xs text-gray-300 shrink-0 font-mono">
                            {formatDate(entry.timestamp)}
                          </span>
                        )}
                        <span className="text-sm text-gray-800 flex-1">
                          {formatStatusLabel(status, entry.value)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Toast message={toast} onDismiss={() => setToast('')} />
      <ValueModal
        status={customEntry}
        onConfirm={handleCustomConfirm}
        onCancel={() => setCustomEntry(null)}
      />
    </div>
  )
}
