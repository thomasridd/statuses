# Deployment Guide

## Prerequisites

- Node.js 18+
- npm 9+

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Production Build

```bash
npm install
npm run build
npm start
```

## Environment Variables

No environment variables are required for the mock-data build. When connecting real data sources, add the following to a `.env.local` file:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
KAFKA_BROKER=localhost:9092
ELASTICSEARCH_URL=http://localhost:9200
```

## Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Vercel auto-detects Next.js — no additional configuration needed.

## Deploying to Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Enable standalone output in `next.config.js`:

```js
module.exports = { output: 'standalone' }
```

Build and run:

```bash
docker build -t domestic-dashboard .
docker run -p 3000:3000 domestic-dashboard
```

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/entities` | List entities (`?status=FAILED&type=job`) |
| GET | `/api/entities/[id]` | Entity detail + transition history |
| GET | `/api/transitions` | Transitions (`?entity_id=...`) |
| GET | `/api/logs` | Logs (`?level=ERROR&trace_id=...`) |
| GET | `/api/analytics` | KPIs, time series, failure reasons |

## Pages

| Path | Description |
|------|-------------|
| `/` | Main dashboard |
| `/analytics` | Charts and performance insights |
| `/entities` | Entity browser with status filtering |
| `/logs` | Structured log viewer |
| `/settings` | Configuration |
