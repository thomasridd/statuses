import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { todayISO } from '../lib/format'
import NavBar from '../components/NavBar'
import Toast from '../components/Toast'
import DayNav from '../components/DayNav'
import type { Status, LogEntry } from '../types'

function isOnDate(timestamp: string, dateStr: string): boolean {
  return timestamp.startsWith(dateStr)
}

export default function Badges() {
  const [badges, setBadges] = useState<Status[]>([])
  const [dayLogs, setDayLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [logging, setLogging] = useState(false)
  const [toast, setToast] = useState('')
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const loadBadges = useCallback(async () => {
    const { statuses } = await api.getStatuses()
    setBadges(
      statuses
        .filter(s => s.status_category === 'badge' && s.enabled)
        .sort((a, b) => a.order - b.order)
    )
  }, [])

  const loadDayLogs = useCallback(async (date: string) => {
    const { logs } = await api.getLogs({ date })
    setDayLogs(logs.filter(l => isOnDate(l.timestamp, date)))
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([loadBadges(), loadDayLogs(selectedDate)]).finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadDayLogs(selectedDate)
  }, [selectedDate, loadDayLogs])

  async function toggleBadge(badge: Status) {
    if (logging) return
    const alreadyEarned = dayLogs.some(l => l.status_id === badge.id)
    if (alreadyEarned) return
    setLogging(true)
    try {
      const isToday = selectedDate === todayISO()
      const timestamp = isToday ? undefined : `${selectedDate}T12:00:00.000Z`
      await api.postLog(badge.id, undefined, timestamp)
      setToast(`Earned: ${badge.label}`)
      await loadDayLogs(selectedDate)
    } catch {
      setToast('Error earning badge')
    } finally {
      setLogging(false)
    }
  }

  const earnedIds = new Set(dayLogs.map(l => l.status_id))
  const positive = badges.filter(b => b.valence !== 'negative')
  const negative = badges.filter(b => b.valence === 'negative')

  const earnedCount = badges.filter(b => earnedIds.has(b.id)).length
  const isToday = selectedDate === todayISO()

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 safe-top">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">Badges</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {badges.length === 0
              ? 'No badges configured'
              : earnedCount === 0
              ? isToday ? 'Tap a badge to earn it today' : 'No badges earned this day'
              : `${earnedCount} of ${badges.length} earned`}
          </p>
          <DayNav date={selectedDate} onChange={setSelectedDate} />
        </div>
      </header>

      <main className="px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            {positive.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Achievements
                </h2>
                <div className="flex flex-col gap-2">
                  {positive.map(badge => {
                    const earned = earnedIds.has(badge.id)
                    return (
                      <button
                        key={badge.id}
                        onClick={() => toggleBadge(badge)}
                        disabled={earned || logging}
                        className={`w-full text-left rounded-xl px-4 py-3 border transition-all ${
                          earned
                            ? 'bg-amber-50 border-amber-300'
                            : 'bg-white border-gray-200 active:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl leading-none">
                            {earned ? '🏅' : '⬜'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm ${earned ? 'text-amber-900' : 'text-gray-900'}`}>
                              {badge.label}
                            </div>
                            {badge.criteria && (
                              <div className="text-xs text-gray-500 mt-0.5">{badge.criteria}</div>
                            )}
                          </div>
                          {earned && (
                            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                              Earned
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {negative.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Demerits
                </h2>
                <div className="flex flex-col gap-2">
                  {negative.map(badge => {
                    const earned = earnedIds.has(badge.id)
                    return (
                      <button
                        key={badge.id}
                        onClick={() => toggleBadge(badge)}
                        disabled={earned || logging}
                        className={`w-full text-left rounded-xl px-4 py-3 border transition-all ${
                          earned
                            ? 'bg-red-50 border-red-300'
                            : 'bg-white border-gray-200 active:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl leading-none">
                            {earned ? '🚨' : '⬜'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm ${earned ? 'text-red-900' : 'text-gray-900'}`}>
                              {badge.label}
                            </div>
                            {badge.criteria && (
                              <div className="text-xs text-gray-500 mt-0.5">{badge.criteria}</div>
                            )}
                          </div>
                          {earned && (
                            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
                              Marked
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Toast message={toast} onDismiss={() => setToast('')} />
      <NavBar />
    </div>
  )
}
