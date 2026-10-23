# Status Page (Control / Room)

A one-page service status demo: three authored sample services (Website, API, Job queue) with uptime figures and a
state, an overall summary, an empty incident log and one sample advisory. The 24h / 7d / 30d buttons only relabel the
view; the numbers do not change. Nothing is probed.

Live: https://status.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

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
npm test           # Vitest: status logic, MCP route, home page render (incl. table roles), Sentry scrubbing
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
- `app/more-projects/page.tsx`: shared portfolio link page (copied per repository, not a package).
