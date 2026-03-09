import { getStore } from '@netlify/blobs'
import { defaultMotives, defaultStatuses, defaultContexts } from './defaultData'

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

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const store = getStore('app-data')

  await store.setJSON('motives', defaultMotives)
  await store.setJSON('statuses', defaultStatuses)
  await store.setJSON('contexts', defaultContexts)

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/reset',
}
