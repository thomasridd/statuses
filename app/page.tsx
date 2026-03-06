import KPICard from '@/components/KPICard'
import StatusTable from '@/components/StatusTable'
import ActivityFeed from '@/components/ActivityFeed'
import ThroughputChart from '@/components/charts/ThroughputChart'
import StatusDistributionChart from '@/components/charts/StatusDistributionChart'
import { mockEntities, mockLogs, mockTimeSeriesData } from '@/lib/mockData'
import { KPI, Status } from '@/lib/types'

function computeKPIs() {
  const total = mockEntities.length
  const active = mockEntities.filter((e) => e.status === 'PROCESSING').length
  const failed = mockEntities.filter((e) => e.status === 'FAILED').length
  const succeeded = mockEntities.filter((e) => e.status === 'SUCCEEDED').length
  const successRate = ((succeeded / total) * 100).toFixed(1)

  const kpis: (KPI & { color: string })[] = [
    { label: 'Total Entities', value: total, change: '+2 since last hour', trend: 'up', color: 'bg-sky-500' },
    { label: 'Active Jobs', value: active, change: `${active} running now`, trend: 'neutral', color: 'bg-blue-500' },
    { label: 'Failures', value: failed, change: 'Needs attention', trend: 'down', color: 'bg-red-500' },
    { label: 'Success Rate', value: `${successRate}%`, change: '+1.2% vs yesterday', trend: 'up', color: 'bg-green-500' },
    { label: 'Avg Latency', value: '138ms', change: '-12ms vs last hour', trend: 'up', color: 'bg-purple-500' },
  ]
  return kpis
}

function computeStatusDist() {
  const counts: Record<string, number> = {}
  for (const e of mockEntities) {
    counts[e.status] = (counts[e.status] ?? 0) + 1
  }
  return Object.entries(counts).map(([name, value]) => ({ name: name as Status, value }))
}

export default function DashboardPage() {
  const kpis = computeKPIs()
  const statusDist = computeStatusDist()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Domestic operations overview — {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} kpi={kpi} colorClass={kpi.color} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ThroughputChart data={mockTimeSeriesData} />
        </div>
        <StatusDistributionChart data={statusDist} />
      </div>

      {/* Status Table + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <StatusTable entities={mockEntities} />
        </div>
        <ActivityFeed logs={mockLogs} />
      </div>
    </div>
  )
}
