'use client'

import { useState } from 'react'
import { mockLogs } from '@/lib/mockData'
import { LogEvent } from '@/lib/types'
import clsx from 'clsx'

type LogLevel = 'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

const levelConfig = {
  INFO: 'bg-blue-100 text-blue-700 border-blue-200',
  WARN: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ERROR: 'bg-red-100 text-red-700 border-red-200',
  DEBUG: 'bg-slate-100 text-slate-600 border-slate-200',
}

function LogRow({ log, expanded, onToggle }: { log: LogEvent; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-50 last:border-0">
      <div
        className="flex items-start gap-4 px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <span className="text-xs text-slate-400 font-mono whitespace-nowrap pt-0.5">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
        <span
          className={clsx(
            'text-xs font-semibold px-2 py-0.5 rounded border whitespace-nowrap',
            levelConfig[log.level]
          )}
        >
          {log.level}
        </span>
        <span className="text-xs text-slate-500 whitespace-nowrap">{log.service}</span>
        <span className="text-sm text-slate-700 flex-1">{log.message}</span>
        <span className="text-xs text-slate-400 whitespace-nowrap">{log.event_type}</span>
        <span className="text-slate-300 text-xs pt-0.5">{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className="px-5 pb-4 bg-slate-50">
          <pre className="text-xs text-slate-600 bg-white rounded-lg border border-slate-100 p-4 overflow-x-auto">
            {JSON.stringify(log, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function LogsPage() {
  const [levelFilter, setLevelFilter] = useState<LogLevel>('ALL')
  const [search, setSearch] = useState('')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const filtered = mockLogs.filter((log) => {
    const matchLevel = levelFilter === 'ALL' || log.level === levelFilter
    const matchSearch =
      search === '' ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.trace_id.includes(search) ||
      log.entity_id.includes(search) ||
      log.service.includes(search) ||
      log.event_type.includes(search)
    return matchLevel && matchSearch
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Structured event logs and diagnostics</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search message, trace_id, entity_id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 w-72"
        />
        <div className="flex gap-1">
          {(['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'] as LogLevel[]).map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                levelFilter === l
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Schema Reference */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-xs text-sky-700">
        <span className="font-semibold">Log schema:</span> timestamp · level · service · environment · message · trace_id · span_id · correlation_id · entity_id · entity_type · event_type · payload · host · version
      </div>

      {/* Log Viewer */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
          {filtered.length} log entries
        </div>
        <div className="divide-y divide-slate-50 font-mono">
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-slate-400 text-sm">No matching logs.</div>
          )}
          {filtered.map((log, i) => (
            <LogRow
              key={i}
              log={log}
              expanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
