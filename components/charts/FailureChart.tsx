'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface FailureReason {
  reason: string
  count: number
  percentage: number
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#64748b']

export default function FailureChart({ data }: { data: FailureReason[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-1">Failures by Reason</h3>
      <p className="text-xs text-slate-400 mb-4">Top failure causes in the current window</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 80, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis type="category" dataKey="reason" tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
            formatter={(value: number, _name: string, props: { payload?: { percentage?: number } }) => [
              `${value} (${props.payload?.percentage ?? 0}%)`,
              'Count',
            ]}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
