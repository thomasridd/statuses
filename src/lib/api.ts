import type {
  StatusesResponse,
  LogsResponse,
  PostLogResponse,
  UpdateStatusesResponse,
  SummaryResponse,
  ContextsResponse,
  UpdateContextsResponse,
  GoldStarsResponse,
  UpdateGoldStarsResponse,
} from '../types'

const BASE = '/api'

function getPassword(): string {
  return sessionStorage.getItem('app_password') || ''
}

export class AuthError extends Error {
  status: number
  constructor() {
    super('Unauthorized')
    this.status = 401
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const password = getPassword()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(password ? { 'x-app-password': password } : {}),
    ...(options.headers as Record<string, string>),
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    throw new AuthError()
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json() as Promise<T>
}

export const api = {
  getStatuses: () => apiFetch<StatusesResponse>('/statuses'),
  updateStatuses: (data: { statuses?: unknown; motives?: unknown }) =>
    apiFetch<UpdateStatusesResponse>('/statuses', { method: 'PUT', body: JSON.stringify(data) }),
  getLogs: (params: Record<string, string | number> = {}) => {
    const q = new URLSearchParams(params as Record<string, string>).toString()
    return apiFetch<LogsResponse>(`/logs${q ? '?' + q : ''}`)
  },
  postLog: (status_id: string, logged_by: 'me' | 'team', value?: number | null) =>
    apiFetch<PostLogResponse>('/log', {
      method: 'POST',
      body: JSON.stringify({ status_id, logged_by, value }),
    }),
  getSummary: (params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString()
    return apiFetch<SummaryResponse>(`/summary${q ? '?' + q : ''}`)
  },
  getContexts: () => apiFetch<ContextsResponse>('/contexts'),
  updateContexts: (data: { contexts: unknown }) =>
    apiFetch<UpdateContextsResponse>('/contexts', { method: 'PUT', body: JSON.stringify(data) }),
  resetToDefaults: () => apiFetch<{ ok: boolean }>('/reset', { method: 'POST' }),
  getGoldStars: () => apiFetch<GoldStarsResponse>('/gold-stars'),
  updateGoldStars: (data: { goldStars: unknown }) =>
    apiFetch<UpdateGoldStarsResponse>('/gold-stars', { method: 'PUT', body: JSON.stringify(data) }),
}
