import { getStore } from '@netlify/blobs'
import type { GoldStar } from '../../src/types'

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
    const goldStars: GoldStar[] = (await store.get('gold-stars', { type: 'json' })) ?? []

    return new Response(JSON.stringify({ goldStars }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (request.method === 'PUT') {
    const body = await request.json() as { goldStars?: unknown }

    if (body.goldStars !== undefined) {
      await store.setJSON('gold-stars', body.goldStars)
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
  path: '/api/gold-stars',
}
