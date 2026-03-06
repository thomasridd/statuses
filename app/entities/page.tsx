'use client'

import { useState } from 'react'
import { mockEntities, mockTransitions } from '@/lib/mockData'
import StatusBadge from '@/components/StatusBadge'
import { EntityStatus, Status } from '@/lib/types'

const ALL_STATUSES: (Status | 'ALL')[] = ['ALL', 'PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'RETRYING']

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' })
}

function EntityDrawer({ entity, onClose }: { entity: EntityStatus; onClose: () => void }) {
  const transitions = mockTransitions.filter((t) => t.entity_id === entity.entity_id)

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-2xl overflow-y-auto">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Entity Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Entity ID</p>
            <p className="font-mono text-sm text-slate-700 break-all">{entity.entity_id}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Type</p>
              <p className="font-medium capitalize text-slate-700">{entity.entity_type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Status</p>
              <StatusBadge status={entity.status} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Version</p>
              <p className="text-slate-700">v{entity.version}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Updated By</p>
              <p className="text-slate-700 text-sm">{entity.updated_by}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Updated At</p>
            <p className="text-slate-700 text-sm">{formatDateTime(entity.updated_at)}</p>
          </div>
          {entity.status_reason && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Status Reason</p>
              <p className="text-slate-700 text-sm">{entity.status_reason}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Metadata</p>
            <pre className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 overflow-x-auto">
              {JSON.stringify(entity.metadata, null, 2)}
            </pre>
          </div>
          {transitions.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Transition History</p>
              <div className="space-y-2">
                {transitions.map((t) => (
                  <div key={t.id} className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.from_status} />
                      <span className="text-slate-400">→</span>
                      <StatusBadge status={t.to_status} />
                    </div>
                    <p className="text-slate-500">
                      <span className="font-medium">Trigger:</span> {t.trigger}
                    </p>
                    <p className="text-slate-500">
                      <span className="font-medium">Actor:</span> {t.actor}
                    </p>
                    <p className="text-slate-400">{formatDateTime(t.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EntitiesPage() {
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<EntityStatus | null>(null)

  const filtered = mockEntities.filter((e) => {
    const matchStatus = filter === 'ALL' || e.status === filter
    const matchSearch =
      search === '' ||
      e.entity_id.toLowerCase().includes(search.toLowerCase()) ||
      e.entity_type.includes(search.toLowerCase()) ||
      e.updated_by.includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Entities</h1>
        <p className="text-sm text-slate-500 mt-1">Browse and inspect system entities</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by ID, type, owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 w-64"
        />
        <div className="flex gap-1 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filter === s
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Entity ID</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Updated</th>
                <th className="text-left px-5 py-3 font-medium">Owner</th>
                <th className="text-left px-5 py-3 font-medium">Metadata</th>
                <th className="text-left px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400 text-sm">
                    No entities match the current filter.
                  </td>
                </tr>
              )}
              {filtered.map((entity) => (
                <tr key={entity.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{entity.entity_id.slice(0, 18)}…</td>
                  <td className="px-5 py-3 capitalize text-slate-700 font-medium">{entity.entity_type}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={entity.status} />
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{formatDateTime(entity.updated_at)}</td>
                  <td className="px-5 py-3 text-slate-600 text-xs">{entity.updated_by}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs max-w-xs truncate">
                    {JSON.stringify(entity.metadata)}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelected(entity)}
                      className="text-xs text-sky-500 hover:underline font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-50 bg-slate-50 text-xs text-slate-400">
          Showing {filtered.length} of {mockEntities.length} entities
        </div>
      </div>

      {selected && <EntityDrawer entity={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
