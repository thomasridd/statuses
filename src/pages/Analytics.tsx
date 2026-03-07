import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { formatTime, formatStatusLabel } from '../lib/format'
import NavBar from '../components/NavBar'
import type { SummaryResponse } from '../types'

interface WeekNavProps {
  weekDate: string
  onChange: (date: string) => void
}

function WeekNav({ weekDate, onChange }: WeekNavProps) {
  function shift(days: number) {
    const d = new Date(weekDate)
    d.setDate(d.getDate() + days)
    onChange(d.toISOString().slice(0, 10))
  }
  const isThisWeek = weekDate >= new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => shift(-7)}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200"
      >‹ Prev</button>
      <button
        onClick={() => onChange(new Date().toISOString().slice(0, 10))}
        className="flex-1 text-center text-sm font-medium text-sky-600"
      >
        This week
      </button>
      <button
        onClick={() => shift(7)}
        disabled={isThisWeek}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40"
      >Next ›</button>
    </div>
  )
}

export default function Analytics() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [weekDate, setWeekDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getSummary({ week: weekDate })
      .then(setSummary)
      .finally(() => setLoading(false))
  }, [weekDate])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 safe-top">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Analytics</h1>
          <WeekNav weekDate={weekDate} onChange={setWeekDate} />
        </div>
      </header>

      <main className="px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">Loading…</div>
        ) : !summary ? (
          <div className="text-center text-gray-400 py-16">No data available</div>
        ) : (
          <>
            {/* Today summary */}
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Today</h2>
              {summary.today.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-6 text-center text-gray-400 text-sm">
                  Nothing logged today yet
                </div>
              ) : (
                <div className="space-y-2">
                  {summary.today.map(({ motive, entries }) => (
                    <div key={motive.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{motive.name}</span>
                      </div>
                      {entries.map(({ entry, status }) => (
                        <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 border-gray-100">
                          <span className="text-xs text-gray-400 w-12 shrink-0 font-mono">
                            {formatTime(entry.timestamp)}
                          </span>
                          <span className="text-sm text-gray-800">
                            {formatStatusLabel(status, entry.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Week value totals */}
            {summary.weekValueTotals.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Week totals ({summary.weekStart} – {summary.weekEnd})
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {summary.weekValueTotals
                    .sort((a, b) => b.total - a.total)
                    .map(({ status, total }) => (
                      <div key={status.id} className="flex items-center justify-between px-4 py-3 border-b last:border-0 border-gray-100">
                        <span className="text-sm text-gray-800">{status.label}</span>
                        <span className="text-sm font-semibold text-sky-700">{total} {status.unit}</span>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Week simple counts */}
            {summary.weekSimpleCounts.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Activity counts this week
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {summary.weekSimpleCounts
                    .sort((a, b) => b.count - a.count)
                    .map(({ status, count }) => (
                      <div key={status.id} className="flex items-center justify-between px-4 py-3 border-b last:border-0 border-gray-100">
                        <span className="text-sm text-gray-800">{status.label}</span>
                        <span className="text-sm font-semibold text-gray-700">×{count}</span>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {summary.weekValueTotals.length === 0 && summary.weekSimpleCounts.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-6 text-center text-gray-400 text-sm mb-6">
                No activity logged this week
              </div>
            )}
          </>
        )}
      </main>

      <NavBar />
    </div>
  )
}
