const BASE = '/api'

function getPassword() {
  return sessionStorage.getItem('app_password') || ''
}

async function apiFetch(path, options = {}) {
  const password = getPassword()
  const headers = {
    'Content-Type': 'application/json',
    ...(password ? { 'x-app-password': password } : {}),
    ...options.headers,
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    sessionStorage.removeItem('app_password')
    window.location.reload()
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export const api = {
  getStatuses: () => apiFetch('/statuses'),
  updateStatuses: (data) => apiFetch('/statuses', { method: 'PUT', body: JSON.stringify(data) }),
  getLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return apiFetch(`/logs${q ? '?' + q : ''}`)
  },
  postLog: (status_id, value) => apiFetch('/log', {
    method: 'POST',
    body: JSON.stringify({ status_id, value }),
  }),
  getSummary: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return apiFetch(`/summary${q ? '?' + q : ''}`)
  },
}
