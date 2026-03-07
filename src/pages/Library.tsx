import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import NavBar from '../components/NavBar'
import Toast from '../components/Toast'
import type { Motive, Status } from '../types'

export default function Library() {
  const [motives, setMotives] = useState<Motive[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [selectedMotive, setSelectedMotive] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    api.getStatuses().then(({ motives, statuses }) => {
      setMotives(motives.sort((a, b) => a.order - b.order))
      setStatuses(statuses)
      setSelectedMotive(motives[0]?.id || null)
      setLoading(false)
    })
  }, [])

  async function saveStatuses(updated: Status[]) {
    setSaving(true)
    try {
      await api.updateStatuses({ statuses: updated })
      setStatuses(updated)
      setToast('Saved')
    } catch {
      setToast('Error saving')
    } finally {
      setSaving(false)
    }
  }

  function toggleEnabled(statusId: string) {
    const updated = statuses.map(s =>
      s.id === statusId ? { ...s, enabled: !s.enabled } : s
    )
    saveStatuses(updated)
  }

  function togglePinned(statusId: string) {
    const updated = statuses.map(s =>
      s.id === statusId ? { ...s, pinned: !s.pinned } : s
    )
    saveStatuses(updated)
  }

  function moveStatus(statusId: string, direction: 'up' | 'down') {
    const motiveStatuses = statuses
      .filter(s => s.motive_id === selectedMotive)
      .sort((a, b) => a.order - b.order)

    const idx = motiveStatuses.findIndex(s => s.id === statusId)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === motiveStatuses.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const newOrder = [...motiveStatuses]
    ;[newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]]

    const reordered = newOrder.map((s, i) => ({ ...s, order: i + 1 }))
    const updated = statuses.map(s => {
      const found = reordered.find(r => r.id === s.id)
      return found || s
    })
    saveStatuses(updated)
  }

  const motiveStatuses = statuses
    .filter(s => s.motive_id === selectedMotive)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 safe-top">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Status Library</h1>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {motives.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMotive(m.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedMotive === m.id
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">
              Toggle to enable/disable. Pin to show at the top of your logging grid.
            </p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {motiveStatuses.map((status, idx) => (
                <div
                  key={status.id}
                  className={`flex items-center gap-2 px-4 py-3 ${idx < motiveStatuses.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveStatus(status.id, 'up')}
                      disabled={saving || idx === 0}
                      className="text-gray-300 hover:text-gray-600 disabled:opacity-20 leading-none text-xs"
                    >▲</button>
                    <button
                      onClick={() => moveStatus(status.id, 'down')}
                      disabled={saving || idx === motiveStatuses.length - 1}
                      className="text-gray-300 hover:text-gray-600 disabled:opacity-20 leading-none text-xs"
                    >▼</button>
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${status.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      {status.label}
                      {status.type === 'value' && (
                        <span className="ml-1 text-xs text-gray-400">({status.default_value} {status.unit})</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{status.type}</p>
                  </div>

                  {/* Pin toggle */}
                  <button
                    onClick={() => togglePinned(status.id)}
                    disabled={saving || !status.enabled}
                    className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                      status.pinned ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                    }`}
                    title={status.pinned ? 'Unpin' : 'Pin to top'}
                  >
                    📌
                  </button>

                  {/* Enable toggle */}
                  <button
                    onClick={() => toggleEnabled(status.id)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      status.enabled ? 'bg-sky-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        status.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Toast message={toast} onDismiss={() => setToast('')} />
      <NavBar />
    </div>
  )
}
