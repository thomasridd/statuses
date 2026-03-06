export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">System configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Data Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Data Sources</h2>
          <div className="space-y-3">
            {[
              { name: 'PostgreSQL', status: 'Connected', note: 'Status store', color: 'bg-green-400' },
              { name: 'Kafka', status: 'Connected', note: 'Event stream', color: 'bg-green-400' },
              { name: 'Elasticsearch', status: 'Degraded', note: 'Log pipeline', color: 'bg-yellow-400' },
              { name: 'Grafana', status: 'Connected', note: 'Observability', color: 'bg-green-400' },
            ].map((src) => (
              <div key={src.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${src.color}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{src.name}</p>
                    <p className="text-xs text-slate-400">{src.note}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{src.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logging Config */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Logging Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Log Level
              </label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300">
                <option>INFO</option>
                <option>DEBUG</option>
                <option>WARN</option>
                <option>ERROR</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Log Format
              </label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300">
                <option>Structured JSON</option>
                <option>Plain Text</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Include trace_id</p>
                <p className="text-xs text-slate-400">Attach trace IDs to all events</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-sky-500 flex items-center justify-end px-1 cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Immutable logs</p>
                <p className="text-xs text-slate-400">Prevent log modification</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-sky-500 flex items-center justify-end px-1 cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Thresholds */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Alert Thresholds</h2>
          <div className="space-y-4">
            {[
              { label: 'Failure Rate Alert (%)', value: '10' },
              { label: 'P99 Latency Alert (ms)', value: '1000' },
              { label: 'Min Success Rate (%)', value: '95' },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  {field.label}
                </label>
                <input
                  type="number"
                  defaultValue={field.value}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Tech Stack</h2>
          <div className="space-y-2 text-sm text-slate-600">
            {[
              ['Frontend', 'Next.js 14, React 18, Tailwind CSS, Recharts'],
              ['Backend', 'Next.js API Routes (Node.js)'],
              ['Status Store', 'PostgreSQL'],
              ['Event Stream', 'Kafka'],
              ['Observability', 'OpenTelemetry, Grafana, ELK'],
              ['Log Pipeline', 'FluentBit / OpenTelemetry'],
            ].map(([key, val]) => (
              <div key={key} className="flex gap-3 py-1.5 border-b border-slate-50 last:border-0">
                <span className="font-medium text-slate-500 w-32 shrink-0">{key}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="px-5 py-2.5 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors">
          Save Settings
        </button>
        <button className="px-5 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
