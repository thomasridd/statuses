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

**Storage** — Netlify Blobs (`getStore('app-data')`). Keys: `motives`, `statuses`, `contexts`, `logs`, `gold-stars`. All reads fall back to defaults from `netlify/functions/defaultData.ts` when no data exists yet.

**Auth** — Single-user password gate. Password stored in `process.env.APP_PASSWORD`. Every API request must include the `x-app-password` header. Password is stored in `sessionStorage` after login.

## Project structure

```
src/
  types.ts              All shared TypeScript interfaces
  main.tsx              Entry point
  App.tsx               Auth gate + React Router routes
  householdTasks.json   Unused/reference task list (not loaded at runtime)
  lib/
    api.ts              Typed API client (injects auth header)
    format.ts           Formatting helpers (time, date, labels, currency)
  components/
    StatusCard.tsx      Status tile with a single Log button
    ValueModal.tsx      Custom value input modal (for value-type statuses)
    LoginGate.tsx       Password authentication form
    NavBar.tsx          Bottom navigation bar (5 links)
    Toast.tsx           Auto-dismissing notification (2.5s)
    GoldStarCard.tsx    Goal display card
    GoldStarModal.tsx   Goal create/edit form
  pages/
    Home.tsx            Primary logging interface
    Analytics.tsx       Daily summary & weekly analytics
    Library.tsx         Status library + context management
    Badges.tsx          Badge achievement system
    Goals.tsx           Gold star goals management
netlify/
  functions/
    defaultData.ts      Default statuses, motives, and contexts
    statuses.ts         GET / PUT /api/statuses
    contexts.ts         GET / PUT /api/contexts
    log.ts              POST /api/log
    logs.ts             GET /api/logs
    summary.ts          GET /api/summary
    gold-stars.ts       GET / PUT /api/gold-stars
    reset.ts            POST /api/reset
netlify.toml
```

## Data model

```typescript
Motive      { id, name, order }

Status      { id, label, motive_id, type, unit, default_value,
              enabled, order, pinned,
              status_category?,   // 'task' | 'badge'
              criteria?,          // human-readable badge criteria
              valence? }          // 'positive' | 'negative' (badges)

Context     { id, name, order, statuses: ContextMembership[] }
ContextMembership  { status_id, order }

LogEntry    { id, status_id, timestamp, value? }
            // timestamp: always "now" (ISO 8601), never backdated
            // value: null for simple statuses; number for value statuses

GoldStar    { id, caption, notes, created_at, completed_at?, order }
```

**Status types:** `simple` (timestamp only) | `value` (timestamp + numeric)

**Value statuses** support a `unit` field. Units can be standard strings (e.g. `mins`, `ml`) or currency symbols (`£`, `$`, `€`, `¥`). Currency units are rendered as prefixes (e.g. `£25`), others as suffixes (e.g. `30mins`). The `isCurrencyUnit` helper in `format.ts` identifies currency units.

**Contexts** are named collections of statuses (e.g. *Food and Drink*, *Kitchen*). A status can belong to multiple contexts, with an independent `order` within each. The home page groups enabled statuses by context; statuses not in any context appear under *Other*.

**Badges** are statuses with `status_category: 'badge'`. They are shown on the Badges page, not the home page. They have a `criteria` description and a `valence` (`'positive'` for achievements, `'negative'` for demerits). A badge can be earned once per day.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/statuses` | Returns `{ motives, statuses }` |
| PUT | `/api/statuses` | Accepts `{ motives?, statuses? }` |
| GET | `/api/contexts` | Returns `{ contexts }` |
| PUT | `/api/contexts` | Accepts `{ contexts }` |
| GET | `/api/logs` | Returns `{ logs }`, query params: `date`, `since`, `limit` (default 50) |
| POST | `/api/log` | Body: `{ status_id, value? }` — timestamp is always "now" |
| GET | `/api/summary` | Returns today + weekly aggregates; query params: `week`, `today` |
| GET | `/api/gold-stars` | Returns `{ goldStars }` |
| PUT | `/api/gold-stars` | Accepts `{ goldStars }` |
| POST | `/api/reset` | Resets motives, statuses, contexts to defaults |

All endpoints require `x-app-password` header.

## Key files

| Path | Purpose |
|------|---------|
| `src/types.ts` | All shared TypeScript interfaces |
| `src/lib/api.ts` | Typed API client (injects auth header) |
| `src/lib/format.ts` | `formatTime`, `formatDate`, `formatStatusLabel`, `formatValueWithUnit`, `isCurrencyUnit`, `todayISO` |
| `src/pages/Home.tsx` | Primary logging interface |
| `src/pages/Analytics.tsx` | Daily summary & weekly analytics |
| `src/pages/Library.tsx` | Status library + context management |
| `src/pages/Badges.tsx` | Badge achievement tracking |
| `src/pages/Goals.tsx` | Gold star goals |
| `netlify/functions/defaultData.ts` | Default statuses (29), motives (5), and contexts (5) |

## Home page behaviour

- **"Today" boundary:** 4:30 AM — if the current time is before 4:30 AM, "today" means the previous calendar day
- Statuses shown grouped by context (context order → status order within context); badge statuses are excluded
- Statuses not in any context appear under *Other*
- Each status has a single **Log** button:
  - Simple status → logs immediately on tap
  - Value status → opens `ValueModal` to enter/confirm the value (default pre-filled)
- Today stats (count + last logged time) are shown as a subtitle on each card when the status has been logged today
- Recent activity (last 20 logs) shown below the status grid

## StatusCard component

`StatusCard` renders a single status row:
- Shows the status label and optional today stats subtitle
- Single **Log** button on the right:
  - For `simple` statuses: calls `onLog(status)` directly
  - For `value` statuses: calls `onLogCustom(status)` which opens `ValueModal`
- Accepts `disabled` prop to prevent double-logging during a pending API call

## Library page

Two tabs:

- **Statuses** — enable/disable, pin, reorder within motive category; reset to defaults button
- **Contexts** — create/delete contexts; add/remove/reorder statuses within each context; reorder contexts themselves

## Badges page

- Displays statuses filtered by `status_category === 'badge'`
- Two sections: **Achievements** (`valence: 'positive'`) and **Demerits** (`valence: 'negative'`)
- Each badge can be earned once per day; earning it creates a log entry
- Visual: ⬜ not earned → 🏅 achievement earned / 🚨 demerit earned

## Goals page

- Create, edit, complete, and delete gold star goals (`GoldStar`)
- Goals are ordered by `order` field; completed goals are shown collapsed at the bottom
- `GoldStarModal` handles both create (null arg) and edit (existing goal) modes

## Analytics page

- Week navigation (prev/next/this week); week = Monday–Sunday
- **Today section:** all logs from today grouped by motive
- **Week value totals:** sum of numeric values per value status
- **Week simple counts:** count per simple status

## Default data (netlify/functions/defaultData.ts)

5 motives: Kitchen, Domestic grind, Family, Bathroom, Badges

29 statuses (all enabled by default):
- Kitchen motive (8 statuses, all simple):
  - Cooked a meal, Dishwasher loaded, Dishwasher unloaded, Surfaces cleaned, Bins
  - Coffee, Tea, Snack (food & drink statuses filed under the Kitchen motive)
- Domestic grind (6 simple): Laundry cranked, Laundry put away, Toys away, Kelvin run, Bedsheets, Towels
- Family (4 value, all with `£` currency unit): Big shop (£80), Top up shop (£20), Eating out (£25), Takeaway (£25)
- Bathroom (2 simple): Teeth, Wash
- Badges (9, `status_category: 'badge'`):
  - Positive (6): Up and out, Robo-ready, Home cooked, Big napper, Good lad, Golden bedtime
  - Negative (3): Street Picnic, Lazy Cafe, Default delivery

5 default contexts: Food and Drink, Kitchen, Domestic grind, Money, Bathroom

Note: The "Money" context (id: `family`) contains the 4 family value statuses. The context `name` is "Money" even though its `id` is `'family'`.

## Adding a new API endpoint

1. Create `netlify/functions/<name>.ts` with a default handler and `export const config = { path: '/api/<name>' }`
2. Add a typed wrapper in `src/lib/api.ts`
3. Add the corresponding response type(s) to `src/types.ts`

## Key conventions

- **IDs** are generated as `` `${Date.now()}_${Math.random().toString(36).slice(2, 7)}` ``
- **Ordering** uses integer `order` fields; the UI manages reordering by updating these fields and calling the relevant PUT endpoint
- **Netlify Blobs** reads always fall back to `defaultData.ts` — never throw on missing keys
- **Auth errors** from the API throw an `AuthError` class (defined in `src/lib/api.ts`); `App.tsx` catches these to show the login gate
- **Toast** notifications are shown after logging actions and reset via `setTimeout` in the component
- **Currency units** (`£`, `$`, `€`, `¥`) are detected by `isCurrencyUnit()` and rendered as prefixes; all other units render as suffixes
- All function handlers follow the Web Fetch API (`Request` → `Response`) — not the older Lambda-style handler
