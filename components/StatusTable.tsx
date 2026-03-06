import { EntityStatus } from '@/lib/types'
import StatusBadge from './StatusBadge'

interface StatusTableProps {
  entities: EntityStatus[]
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function truncate(str: string, n = 12) {
  return str.length > n ? str.slice(0, n) + '…' : str
}

export default function StatusTable({ entities }: StatusTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-800">Operational Status</h2>
        <p className="text-xs text-slate-400 mt-0.5">Live system entity states</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-medium">Entity ID</th>
              <th className="text-left px-5 py-3 font-medium">Type</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Updated</th>
              <th className="text-left px-5 py-3 font-medium">Owner</th>
              <th className="text-left px-5 py-3 font-medium">Version</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {entities.map((entity) => (
              <tr key={entity.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-slate-600">
                  {truncate(entity.entity_id, 14)}
                </td>
                <td className="px-5 py-3">
                  <span className="capitalize text-slate-700 font-medium">{entity.entity_type}</span>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={entity.status} />
                </td>
                <td className="px-5 py-3 text-slate-500">{formatTime(entity.updated_at)}</td>
                <td className="px-5 py-3 text-slate-600 text-xs">{entity.updated_by}</td>
                <td className="px-5 py-3 text-slate-400 text-xs">v{entity.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
