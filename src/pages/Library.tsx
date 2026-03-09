import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import NavBar from '../components/NavBar'
import Toast from '../components/Toast'
import type { Motive, Status, Context } from '../types'

type Tab = 'statuses' | 'contexts'

export default function Library() {
  const [motives, setMotives] = useState<Motive[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [contexts, setContexts] = useState<Context[]>([])
  const [selectedMotive, setSelectedMotive] = useState<string | null>(null)
  const [selectedContext, setSelectedContext] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('statuses')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [newContextName, setNewContextName] = useState('')
  const [addStatusSearch, setAddStatusSearch] = useState('')
  const [showAddStatus, setShowAddStatus] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    Promise.all([api.getStatuses(), api.getContexts()]).then(
      ([{ motives: m, statuses: s }, { contexts: c }]) => {
        setMotives(m.sort((a, b) => a.order - b.order))
        setStatuses(s)
        setSelectedMotive(m[0]?.id || null)
        setContexts(c.sort((a, b) => a.order - b.order))
        setSelectedContext(c[0]?.id || null)
        setLoading(false)
      }
    )
  }, [])

  async function resetToDefaults() {
    setSaving(true)
    try {
      await api.resetToDefaults()
      const [{ motives: m, statuses: s }, { contexts: c }] = await Promise.all([api.getStatuses(), api.getContexts()])
      setMotives(m.sort((a, b) => a.order - b.order))
      setStatuses(s)
      setSelectedMotive(m[0]?.id || null)
      setContexts(c.sort((a, b) => a.order - b.order))
      setSelectedContext(c[0]?.id || null)
      setToast('Reset to defaults')
    } catch {
      setToast('Error resetting')
    } finally {
      setSaving(false)
      setShowResetConfirm(false)
    }
  }

  // --- Statuses tab actions ---

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
    saveStatuses(statuses.map(s => s.id === statusId ? { ...s, enabled: !s.enabled } : s))
  }

  function togglePinned(statusId: string) {
    saveStatuses(statuses.map(s => s.id === statusId ? { ...s, pinned: !s.pinned } : s))
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
    const updated = statuses.map(s => reordered.find(r => r.id === s.id) || s)
    saveStatuses(updated)
  }

  // --- Contexts tab actions ---

  async function saveContexts(updated: Context[]) {
    setSaving(true)
    try {
      await api.updateContexts({ contexts: updated })
      setContexts(updated)
      setToast('Saved')
    } catch {
      setToast('Error saving')
    } finally {
      setSaving(false)
    }
  }

  function moveContext(contextId: string, direction: 'up' | 'down') {
    const sorted = [...contexts].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex(c => c.id === contextId)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === sorted.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[sorted[idx], sorted[swapIdx]] = [sorted[swapIdx], sorted[idx]]
    const reordered = sorted.map((c, i) => ({ ...c, order: i + 1 }))
    setContexts(reordered)
    saveContexts(reordered)
  }

  function moveStatusInContext(contextId: string, statusId: string, direction: 'up' | 'down') {
    const updated = contexts.map(ctx => {
      if (ctx.id !== contextId) return ctx
      const sorted = [...ctx.statuses].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex(m => m.status_id === statusId)
      if (direction === 'up' && idx === 0) return ctx
      if (direction === 'down' && idx === sorted.length - 1) return ctx
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      ;[sorted[idx], sorted[swapIdx]] = [sorted[swapIdx], sorted[idx]]
      return { ...ctx, statuses: sorted.map((m, i) => ({ ...m, order: i + 1 })) }
    })
    setContexts(updated)
    saveContexts(updated)
  }

  function removeStatusFromContext(contextId: string, statusId: string) {
    const updated = contexts.map(ctx => {
      if (ctx.id !== contextId) return ctx
      const remaining = ctx.statuses
        .filter(m => m.status_id !== statusId)
        .map((m, i) => ({ ...m, order: i + 1 }))
      return { ...ctx, statuses: remaining }
    })
    setContexts(updated)
    saveContexts(updated)
  }

  function addStatusToContext(contextId: string, statusId: string) {
    const updated = contexts.map(ctx => {
      if (ctx.id !== contextId) return ctx
      if (ctx.statuses.some(m => m.status_id === statusId)) return ctx
      const newOrder = ctx.statuses.length + 1
      return { ...ctx, statuses: [...ctx.statuses, { status_id: statusId, order: newOrder }] }
    })
    setContexts(updated)
    saveContexts(updated)
    setAddStatusSearch('')
    setShowAddStatus(false)
  }

  function addContext() {
    const name = newContextName.trim()
    if (!name) return
    const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    if (contexts.some(c => c.id === newId)) {
      setToast('A context with that name already exists')
      return
    }
    const updated = [...contexts, { id: newId, name, order: contexts.length + 1, statuses: [] }]
    setNewContextName('')
    setContexts(updated)
    setSelectedContext(newId)
    saveContexts(updated)
  }

  function deleteContext(contextId: string) {
    const updated = contexts
      .filter(c => c.id !== contextId)
      .map((c, i) => ({ ...c, order: i + 1 }))
    const nextSelected = updated[0]?.id || null
    setContexts(updated)
    setSelectedContext(nextSelected)
    saveContexts(updated)
  }

  const motiveStatuses = statuses
    .filter(s => s.motive_id === selectedMotive)
    .sort((a, b) => a.order - b.order)

  const activeContext = contexts.find(c => c.id === selectedContext)
  const activeContextStatuses = activeContext
    ? activeContext.statuses
        .sort((a, b) => a.order - b.order)
        .map(m => ({ membership: m, status: statuses.find(s => s.id === m.status_id) }))
        .filter(x => x.status !== undefined) as { membership: { status_id: string; order: number }; status: Status }[]
    : []

  const contextStatusIds = new Set(activeContext?.statuses.map(m => m.status_id) || [])
  const addableStatuses = statuses.filter(s => {
    if (contextStatusIds.has(s.id)) return false
    if (!addStatusSearch.trim()) return true
    return s.label.toLowerCase().includes(addStatusSearch.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-lg font-bold text-gray-900">Library</h1>
            <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-medium">
              <button
                onClick={() => setTab('statuses')}
                className={`px-3 py-1.5 transition-colors ${tab === 'statuses' ? 'bg-sky-500 text-white' : 'bg-white text-gray-600'}`}
              >
                Statuses
              </button>
              <button
                onClick={() => setTab('contexts')}
                className={`px-3 py-1.5 transition-colors ${tab === 'contexts' ? 'bg-sky-500 text-white' : 'bg-white text-gray-600'}`}
              >
                Contexts
              </button>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={saving}
              className="ml-auto px-3 py-1.5 text-xs font-medium bg-white border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              Reset
            </button>
          </div>

          {tab === 'statuses' && (
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
          )}

          {tab === 'contexts' && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
              {contexts.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedContext(c.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedContext === c.id
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">Loading…</div>
        ) : tab === 'statuses' ? (
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

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${status.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      {status.label}
                      {status.type === 'value' && (
                        <span className="ml-1 text-xs text-gray-400">({status.default_value} {status.unit})</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{status.type}</p>
                  </div>

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
        ) : (
          // Contexts tab
          <>
            <p className="text-xs text-gray-400 mb-3">
              Contexts group statuses that are likely to be logged together. Statuses can belong to multiple contexts.
            </p>

            {activeContext ? (
              <>
                {/* Context reorder + delete controls */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveContext(activeContext.id, 'up')}
                      disabled={saving || contexts.indexOf(activeContext) === 0}
                      className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-800 disabled:opacity-30"
                    >← Earlier</button>
                    <button
                      onClick={() => moveContext(activeContext.id, 'down')}
                      disabled={saving || contexts.indexOf(activeContext) === contexts.length - 1}
                      className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-800 disabled:opacity-30"
                    >Later →</button>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete context "${activeContext.name}"?`)) {
                        deleteContext(activeContext.id)
                      }
                    }}
                    disabled={saving}
                    className="ml-auto px-2 py-1 text-xs bg-white border border-red-200 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30"
                  >Delete context</button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                  {activeContextStatuses.length === 0 && (
                    <p className="text-sm text-gray-400 px-4 py-4 text-center">No statuses in this context yet.</p>
                  )}
                  {activeContextStatuses.map(({ membership, status }, idx) => (
                    <div
                      key={membership.status_id}
                      className={`flex items-center gap-2 px-4 py-3 ${idx < activeContextStatuses.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveStatusInContext(activeContext.id, membership.status_id, 'up')}
                          disabled={saving || idx === 0}
                          className="text-gray-300 hover:text-gray-600 disabled:opacity-20 leading-none text-xs"
                        >▲</button>
                        <button
                          onClick={() => moveStatusInContext(activeContext.id, membership.status_id, 'down')}
                          disabled={saving || idx === activeContextStatuses.length - 1}
                          className="text-gray-300 hover:text-gray-600 disabled:opacity-20 leading-none text-xs"
                        >▼</button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${status.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                          {status.label}
                          {!status.enabled && <span className="ml-1 text-xs text-gray-400">(disabled)</span>}
                        </p>
                      </div>

                      <button
                        onClick={() => removeStatusFromContext(activeContext.id, membership.status_id)}
                        disabled={saving}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 text-xs"
                        title="Remove from context"
                      >✕</button>
                    </div>
                  ))}
                </div>

                {/* Add status to context */}
                {showAddStatus ? (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <input
                        type="search"
                        placeholder="Search statuses to add…"
                        value={addStatusSearch}
                        onChange={e => setAddStatusSearch(e.target.value)}
                        autoFocus
                        className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {addableStatuses.slice(0, 30).map((status, idx) => (
                        <button
                          key={status.id}
                          onClick={() => addStatusToContext(activeContext.id, status.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${idx < Math.min(addableStatuses.length, 30) - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                          <span className="text-sm text-gray-800 flex-1">{status.label}</span>
                          <span className="text-xs text-sky-500 font-medium">Add</span>
                        </button>
                      ))}
                      {addableStatuses.length === 0 && (
                        <p className="text-sm text-gray-400 px-4 py-4 text-center">No statuses to add</p>
                      )}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100">
                      <button
                        onClick={() => { setShowAddStatus(false); setAddStatusSearch('') }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddStatus(true)}
                    disabled={saving}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-sky-400 hover:text-sky-600 transition-colors disabled:opacity-40 mb-4"
                  >
                    + Add status to context
                  </button>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No contexts yet. Create one below.</p>
            )}

            {/* New context form */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New context name…"
                value={newContextName}
                onChange={e => setNewContextName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addContext()}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={addContext}
                disabled={saving || !newContextName.trim()}
                className="px-4 py-2.5 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition-colors disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </>
        )}
      </main>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-2">Reset to defaults?</h2>
            <p className="text-sm text-gray-500 mb-6">
              This will replace all statuses, motives, and contexts with the built-in defaults. Your log history will not be affected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={resetToDefaults}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-40"
              >
                {saving ? 'Resetting…' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onDismiss={() => setToast('')} />
      <NavBar />
    </div>
  )
}
