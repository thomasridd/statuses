import ThroughputChart from '@/components/charts/ThroughputChart'
import LatencyChart from '@/components/charts/LatencyChart'
import FailureChart from '@/components/charts/FailureChart'
import ServiceHealthChart from '@/components/charts/ServiceHealthChart'
import { mockTimeSeriesData, mockFailureReasons, mockServiceHealth } from '@/lib/mockData'

function InsightCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{title}</p>
      <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </div>
  )
}

export default function AnalyticsPage() {
  const latest = mockTimeSeriesData[mockTimeSeriesData.length - 1]
  const totalRequests = mockTimeSeriesData.reduce((s, d) => s + (d.requests ?? 0), 0)
  const totalFailed = mockTimeSeriesData.reduce((s, d) => s + (d.failed ?? 0), 0)
  const overallSuccessRate = (((totalRequests - totalFailed) / totalRequests) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">System performance and operational insights</p>
      </div>

      {/* Derived Insights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <InsightCard title="Overall Success Rate" value={`${overallSuccessRate}%`} description="Across all services" />
        <InsightCard title="Peak Requests" value={`${latest.requests ?? 0}/30min`} description="Current window" />
        <InsightCard title="Avg P95 Latency" value="520ms" description="Across time window" />
        <InsightCard title="Busiest Period" value="11:00–11:30" description="Highest load interval" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ThroughputChart data={mockTimeSeriesData} />
        <LatencyChart data={mockTimeSeriesData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FailureChart data={mockFailureReasons} />
        <ServiceHealthChart data={mockServiceHealth} />
      </div>

      {/* Service Health Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Service Health Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Service</th>
                <th className="text-left px-5 py-3 font-medium">Total Requests</th>
                <th className="text-left px-5 py-3 font-medium">Failures</th>
                <th className="text-left px-5 py-3 font-medium">Success Rate</th>
                <th className="text-left px-5 py-3 font-medium">SLA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockServiceHealth.map((row) => (
                <tr key={row.service} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-700">{row.service}</td>
                  <td className="px-5 py-3 text-slate-600">{row.requests.toLocaleString()}</td>
                  <td className="px-5 py-3 text-red-500">{row.failures}</td>
                  <td className="px-5 py-3">
                    <span className={row.success_rate >= 95 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                      {row.success_rate}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        row.success_rate >= 95
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      {row.success_rate >= 95 ? 'Meeting SLA' : 'Below SLA'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
