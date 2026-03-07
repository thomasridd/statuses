import { getStore } from '@netlify/blobs'
import type { LogEntry } from '../../src/types'

function checkAuth(request: Request): boolean {
  const password = process.env.APP_PASSWORD
  if (!password) return true
  const auth = request.headers.get('x-app-password')
  return auth === password
}

export default async (request: Request) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const store = getStore('app-data')
  const url = new URL(request.url)
  const date = url.searchParams.get('date') // YYYY-MM-DD
  const limit = parseInt(url.searchParams.get('limit') || '50')

  let logs: LogEntry[] = await store.get('logs', { type: 'json' }) || []

  if (date) {
    logs = logs.filter(entry => entry.timestamp.startsWith(date))
  }

  // Sort newest first
  logs = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (!date) {
    logs = logs.slice(0, limit)
  }

  return new Response(JSON.stringify({ logs }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/logs',
}
