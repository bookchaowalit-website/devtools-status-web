# Status Page — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `status`, evidence Prototype) on 2026-10-23.

## What it is

A static status-page demo over three hard-coded sample services, with the honest footer
"NO LIVE MONITORING · NO NOTIFICATION CHANNEL".

## Who it is for

A portfolio visitor who wants to see how a calm, readable status surface could look.

## What works today

1. The service matrix lists Website, API and Job queue with sample uptime and state (two operational, one
   monitoring) as an accessible table (column headers, row headers, cells).
2. The summary counts operational services; the incident log shows the empty state; one sample advisory explains
   the monitoring state.
3. The 24h / 7d / 30d window buttons change the label only.
4. `/api/mcp` answers JSON-RPC with `get_all`, `get_by_id` and `search` over the same sample list.
5. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No real-time monitoring of 100+ services, no Cloudflare Workers heartbeats, no maintenance notices, no email or
  Slack notifications (claims removed from the portfolio card in the 2026-10 review).
- Uptime values, "LAST CHECK just now" and the advisory are fixed sample copy.

## Live URL and deploy state

- Live: https://status.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-status-frontend` is deployed only by CLI. Last production deploy: 2026-10-23
  12:24, CLI, commit e7527fa (the CVE patch). Its Git link names the old repository
  `bookchaowalit/bookchaowalit-status-frontend`, so a push to `main` does not deploy: the L2 commits (table
  accessibility fix, truthful MCP route, tests, Sentry) stay undeployed until the owner reconnects Vercel Git to
  `bookchaowalit-website/devtools-status-web` (owner action D9). The live site still has the
  aria-required-children error until then.
- `NEXT_PUBLIC_SENTRY_DSN` is set on the Vercel project (Sentry project `devtools-status-web`, org `personal-yu0`).

## Boundaries

- Browser-only apart from the stateless `/api/mcp` route. No personal data is collected.
