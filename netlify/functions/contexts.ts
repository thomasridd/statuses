import { getStore } from '@netlify/blobs'
import { defaultContexts } from './defaultData'

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

  if (request.method === 'GET') {
    let contexts = await store.get('contexts', { type: 'json' })
    if (!contexts) contexts = defaultContexts

    return new Response(JSON.stringify({ contexts }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (request.method === 'PUT') {
    const body = await request.json() as { contexts?: unknown }

    if (body.contexts) {
      await store.setJSON('contexts', body.contexts)
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
  path: '/api/contexts',
}
