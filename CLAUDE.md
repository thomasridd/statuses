# Domestic Status Logger

A lightweight web app for recording everyday domestic activities as timestamped log entries. Built with React + TypeScript on Netlify (serverless functions + Blob storage).

## Development

```bash
npm run dev       # Start Netlify dev server (http://localhost:8888)
npm run build     # Production build
```

Run with `netlify dev` (via the Netlify CLI) rather than plain `vite` so that serverless functions and the `/api/*` → `/.netlify/functions/*` redirect work locally.

## Architecture

**Frontend** — React 18 + TypeScript, Vite, Tailwind CSS, React Router v6

**Backend** — Netlify serverless functions in `netlify/functions/`. Each file exports a default `async (request: Request)` handler and an `export const config = { path: '/api/<name>' }`.

**Storage** — Netlify Blobs (`getStore('app-data')`). Keys: `motives`, `statuses`, `contexts`, `logs`. All reads fall back to defaults from `netlify/functions/defaultData.ts` when no data exists yet.

**Auth** — Single-user password gate. Password stored in `process.env.APP_PASSWORD`. Every API request must include the `x-app-password` header.

## Key files

| Path | Purpose |
|------|---------|
| `src/types.ts` | All shared TypeScript interfaces |
| `src/lib/api.ts` | Typed API client (injects auth header) |
| `src/pages/Home.tsx` | Primary logging interface |
| `src/pages/Analytics.tsx` | Daily summary & weekly analytics |
| `src/pages/Library.tsx` | Status library + context management |
| `netlify/functions/defaultData.ts` | ~120 default statuses, motives, and contexts |
| `netlify/functions/contexts.ts` | GET / PUT `/api/contexts` |
| `netlify/functions/statuses.ts` | GET / PUT `/api/statuses` |
| `netlify/functions/log.ts` | POST `/api/log` |
| `netlify/functions/logs.ts` | GET `/api/logs` |
| `netlify/functions/summary.ts` | GET `/api/summary` |

## Data model

```
Motive       { id, name, order }
Status       { id, label, motive_id, type, unit, default_value, enabled, order, pinned }
Context      { id, name, order, statuses: ContextMembership[] }
ContextMembership  { status_id, order }
LogEntry     { id, status_id, timestamp, value? }
```

**Status types:** `simple` (timestamp only) | `value` (timestamp + numeric)

**Contexts** are named collections of statuses (e.g. *Morning routine*, *In the kitchen*). A status can belong to multiple contexts, with an independent `order` within each. The home page groups enabled statuses by context; statuses not in any context appear under *Other*.

## Home page behaviour

- **No search:** statuses shown grouped by context (context order → status order within context)
- **Searching:** flat filtered list across all enabled statuses
- Simple status → logs immediately on tap
- Value status → logs with `default_value` on tap; edit icon opens `ValueModal` for a custom value

## Library page

Two tabs:

- **Statuses** — enable/disable, pin, reorder within motive category
- **Contexts** — create/delete contexts; add/remove/reorder statuses within each context; reorder contexts themselves

## Adding a new API endpoint

1. Create `netlify/functions/<name>.ts` with a default handler and `export const config = { path: '/api/<name>' }`
2. Add a typed wrapper in `src/lib/api.ts`
3. Add the corresponding response type(s) to `src/types.ts`
