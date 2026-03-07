import { getStore } from '@netlify/blobs'
import { defaultMotives, defaultStatuses } from './defaultData.js'

function checkAuth(request) {
  const password = process.env.APP_PASSWORD
  if (!password) return true
  const auth = request.headers.get('x-app-password')
  return auth === password
}

function getWeekBounds(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date()
  const day = date.getDay() // 0=Sun
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((day + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return { start: monday, end: sunday }
}

export default async (request, context) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const store = getStore('app-data')
  const url = new URL(request.url)
  const weekDate = url.searchParams.get('week') // YYYY-MM-DD of any day in that week
  const todayDate = url.searchParams.get('today') // YYYY-MM-DD

  const [motives, statuses, allLogs] = await Promise.all([
    store.get('motives', { type: 'json' }).then(m => m || defaultMotives),
    store.get('statuses', { type: 'json' }).then(s => s || defaultStatuses),
    store.get('logs', { type: 'json' }).then(l => l || []),
  ])

  const statusMap = Object.fromEntries(statuses.map(s => [s.id, s]))
  const motiveMap = Object.fromEntries(motives.map(m => [m.id, m]))

  // --- Today summary ---
  const todayStr = todayDate || new Date().toISOString().slice(0, 10)
  const todayLogs = allLogs.filter(e => e.timestamp.startsWith(todayStr))

  const todayByMotive = {}
  for (const entry of todayLogs) {
    const status = statusMap[entry.status_id]
    if (!status) continue
    const motive = motiveMap[status.motive_id]
    if (!motive) continue
    if (!todayByMotive[motive.id]) {
      todayByMotive[motive.id] = { motive, entries: [] }
    }
    todayByMotive[motive.id].entries.push({ entry, status })
  }

  const todaySummary = Object.values(todayByMotive).sort((a, b) => a.motive.order - b.motive.order)

  // --- Weekly totals ---
  const { start, end } = getWeekBounds(weekDate)
  const weekLogs = allLogs.filter(e => {
    const d = new Date(e.timestamp)
    return d >= start && d <= end
  })

  // Value status totals
  const valueTotals = {}
  const simpleCounts = {}

  for (const entry of weekLogs) {
    const status = statusMap[entry.status_id]
    if (!status) continue
    if (status.type === 'value' && entry.value !== null) {
      if (!valueTotals[status.id]) {
        valueTotals[status.id] = { status, total: 0 }
      }
      valueTotals[status.id].total += entry.value
    } else if (status.type === 'simple') {
      if (!simpleCounts[status.id]) {
        simpleCounts[status.id] = { status, count: 0 }
      }
      simpleCounts[status.id].count++
    }
  }

  return new Response(JSON.stringify({
    today: todaySummary,
    weekStart: start.toISOString().slice(0, 10),
    weekEnd: end.toISOString().slice(0, 10),
    weekValueTotals: Object.values(valueTotals),
    weekSimpleCounts: Object.values(simpleCounts),
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/summary',
}
