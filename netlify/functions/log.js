import { getStore } from '@netlify/blobs'

function checkAuth(request) {
  const password = process.env.APP_PASSWORD
  if (!password) return true
  const auth = request.headers.get('x-app-password')
  return auth === password
}

export default async (request, context) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json()
  const { status_id, value } = body

  if (!status_id) {
    return new Response(JSON.stringify({ error: 'status_id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const store = getStore('app-data')
  const logs = await store.get('logs', { type: 'json' }) || []

  const entry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    status_id,
    timestamp: new Date().toISOString(),
    value: value !== undefined ? Number(value) : null,
  }

  logs.push(entry)
  await store.setJSON('logs', logs)

  return new Response(JSON.stringify({ ok: true, entry }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/log',
}
