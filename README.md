# Status (dashboard)

A one-page service status demo: three authored sample services (Website, API, Job queue) with uptime figures and a
state, an overall summary, an empty incident log and one sample advisory. Nothing is probed. Built on the Dashboard shell
(see `DASHBOARD.md`); the old 24h / 7d / 30d buttons were dropped because they changed no number.

Live: https://status.bookchaowalit.com (Vercel Git deploy: a push to `main` deploys).

## What it does not do

- No live monitoring, heartbeats, maintenance notices, incident history or email/Slack notifications.
- The uptime numbers are fixed sample values.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: status logic, MCP route, home page render, the Dashboard shell, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (lint, typecheck, tests with a line-coverage gate,
build) and the shared security scan on every push and PR to `main`.

## Code map

- `lib/status.ts`: the sample services, time windows, `summarize` and `searchServices` (used by the page and the
  MCP route).
- `app/api/mcp/route.ts`: stateless JSON-RPC endpoint with `get_all`, `get_by_id` and `search` over that list;
  unknown tools and methods return JSON-RPC errors.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when
  `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/dashboard-shell.css` + `components/dashboard-shell.tsx`: the copied-in Dashboard shell (`DASHBOARD.md`).
- `next.config.ts`: `/more-projects` redirects (308) to the portfolio hub at https://bookchaowalit.com/.
