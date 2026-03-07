import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { formatTime, formatStatusLabel } from '../lib/format'
import StatusCard from '../components/StatusCard'
import ValueModal from '../components/ValueModal'
import Toast from '../components/Toast'
import NavBar from '../components/NavBar'
import type { Status, LogEntry } from '../types'

export default function Home() {
  const [statuses, setStatuses] = useState<Status[]>([])
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([])
  const [statusMap, setStatusMap] = useState<Record<string, Status>>({})
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [customStatus, setCustomStatus] = useState<Status | null>(null)
  const [logging, setLogging] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [{ statuses: allStatuses }, { logs }] = await Promise.all([
        api.getStatuses(),
        api.getLogs({ limit: 20 }),
      ])

      const enabled = allStatuses.filter(s => s.enabled)
      const map = Object.fromEntries(allStatuses.map(s => [s.id, s]))
      setStatusMap(map)
      setRecentLogs(logs)

      // Order: pinned first (by order), then most recently used (by last log timestamp)
      const lastUsed: Record<string, string> = {}
      for (const log of [...logs].reverse()) {
        if (!lastUsed[log.status_id]) {
          lastUsed[log.status_id] = log.timestamp
        }
      }

      const sorted = [...enabled].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        if (a.pinned && b.pinned) return a.order - b.order
        // Both unpinned: sort by most recently used
        const aLast = lastUsed[a.id] || ''
        const bLast = lastUsed[b.id] || ''
        if (aLast && bLast) return bLast.localeCompare(aLast)
        if (aLast) return -1
        if (bLast) return 1
        return a.order - b.order
      })

      setStatuses(sorted)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function logStatus(status: Status, value?: number) {
    setLogging(true)
    try {
      const logValue = value !== undefined ? value : (status.type === 'value' ? status.default_value : undefined)
      await api.postLog(status.id, logValue)
      const label = formatStatusLabel(status, logValue)
      setToast(`Logged: ${label}`)
      // Refresh recent logs
      const { logs } = await api.getLogs({ limit: 20 })
      setRecentLogs(logs)
    } catch {
      setToast('Error logging status')
    } finally {
      setLogging(false)
    }
  }

  function handleLogCustom(status: Status) {
    setCustomStatus(status)
  }

  async function handleCustomConfirm(value: number) {
    const status = customStatus
    setCustomStatus(null)
    if (status) await logStatus(status, value)
  }

  const filtered = search.trim()
    ? statuses.filter(s =>
        s.label.toLowerCase().includes(search.trim().toLowerCase())
      )
    : statuses

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-900">Status Logger</h1>
            <Link to="/analytics" className="text-sm text-sky-600 font-medium">
              Today's summary →
            </Link>
          </div>
          <input
            type="search"
            placeholder="Search statuses…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </header>

      <main className="px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            <section>
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">No statuses found</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {filtered.map(status => (
                  <StatusCard
                    key={status.id}
                    status={status}
                    onLog={logStatus}
                    onLogCustom={handleLogCustom}
                    disabled={logging}
                  />
                ))}
              </div>
            </section>

            {!search && (
              <section className="mt-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Recent activity
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
                          <span className="text-sm text-gray-800">
                            {formatStatusLabel(status, entry.value)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      <Toast message={toast} onDismiss={() => setToast('')} />
      <ValueModal
        status={customStatus}
        onConfirm={handleCustomConfirm}
        onCancel={() => setCustomStatus(null)}
      />
      <NavBar />
    </div>
  )
}
