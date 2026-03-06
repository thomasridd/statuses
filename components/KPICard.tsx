import { KPI } from '@/lib/types'
import clsx from 'clsx'

interface KPICardProps {
  kpi: KPI
  colorClass?: string
}

export default function KPICard({ kpi, colorClass = 'bg-sky-500' }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-2">
      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg', colorClass)}>
        {kpi.label.charAt(0)}
      </div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{kpi.label}</p>
      <p className="text-3xl font-bold text-slate-800">{kpi.value}</p>
      {kpi.change && (
        <p
          className={clsx(
            'text-xs font-medium',
            kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-500' : 'text-slate-400'
          )}
        >
          {kpi.change}
        </p>
      )}
    </div>
  )
}
