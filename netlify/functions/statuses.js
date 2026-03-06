import { getStore } from '@netlify/blobs'
import { defaultMotives, defaultStatuses } from './defaultData.js'

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

  const store = getStore('app-data')

  if (request.method === 'GET') {
    let motives = await store.get('motives', { type: 'json' })
    let statuses = await store.get('statuses', { type: 'json' })

    if (!motives) motives = defaultMotives
    if (!statuses) statuses = defaultStatuses

    return new Response(JSON.stringify({ motives, statuses }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (request.method === 'PUT') {
    const body = await request.json()

    if (body.motives) {
      await store.setJSON('motives', body.motives)
    }
    if (body.statuses) {
      await store.setJSON('statuses', body.statuses)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/statuses',
}
