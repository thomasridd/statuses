'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface StatusDist {
  name: string
  value: number
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#eab308',
  PROCESSING: '#0ea5e9',
  SUCCEEDED: '#22c55e',
  FAILED: '#ef4444',
  CANCELLED: '#94a3b8',
  RETRYING: '#a855f7',
}

export default function StatusDistributionChart({ data }: { data: StatusDist[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-1">Status Distribution</h3>
      <p className="text-xs text-slate-400 mb-2">Current entity statuses</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={STATUS_COLORS[entry.name] ?? '#0ea5e9'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
