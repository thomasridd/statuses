'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TimeSeriesDataPoint } from '@/lib/types'

export default function LatencyChart({ data }: { data: TimeSeriesDataPoint[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-1">Latency Distribution</h3>
      <p className="text-xs text-slate-400 mb-4">P50, P95, P99 latency in milliseconds</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="p99Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="p95Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="p50Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="ms" />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
            formatter={(value: number) => [`${value}ms`]}
          />
          <Area type="monotone" dataKey="p99" stroke="#a855f7" fill="url(#p99Gradient)" strokeWidth={2} name="P99" />
          <Area type="monotone" dataKey="p95" stroke="#f97316" fill="url(#p95Gradient)" strokeWidth={2} name="P95" />
          <Area type="monotone" dataKey="p50" stroke="#0ea5e9" fill="url(#p50Gradient)" strokeWidth={2} name="P50" />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
