'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface ServiceHealth {
  service: string
  success_rate: number
  requests: number
  failures: number
}

export default function ServiceHealthChart({ data }: { data: ServiceHealth[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-1">Service Reliability</h3>
      <p className="text-xs text-slate-400 mb-4">Success rate per service (%)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="service"
            tick={{ fontSize: 10, fill: '#64748b' }}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
            formatter={(value: number) => [`${value}%`, 'Success Rate']}
          />
          <ReferenceLine y={95} stroke="#22c55e" strokeDasharray="4 4" label={{ value: '95% SLA', fontSize: 10, fill: '#22c55e' }} />
          <Bar dataKey="success_rate" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Success Rate" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
