# Frontend Admin Test Coverage Tracker

## Completed

- [x] API client interceptors (auth header, 401 token clear)
- [x] Admin API contract tests (URLs, methods, params, payloads)
- [x] Admin API response-shape tests (key fields/types)
- [x] UI: Overview (healthy + CPU alert path)
- [x] UI: Logs (render, refresh, basic controls)
- [x] UI: Security (Clear Rate Limits)
- [x] UI: Maintenance (cleanup preview/run)
- [x] UI: Permissions (roles/flags)
- [x] UI: Audit (next/prev basic)
- [x] UI: Logs filters pass correct params
  - [x] level, limit, date-from/to, search
  - [x] prev/next disabled/enabled logic with totals

## Pending (to implement)

- [ ] UI: Audit filters pass correct params
  - [ ] skip/limit, userId, action, date-from/to
  - [ ] prev/next disabled/enabled logic with totals
- [ ] UI: Auto-refresh toggle
  - [ ] when off, prevents periodic getSystemMetrics/getSystemLogs
- [ ] UI: Robustness
  - [ ] partial failures → warning toast
  - [ ] all failures → error toast
- [ ] UI: Access control
  - [ ] redirects to /login when unauthenticated
- [ ] UI: Health tab
  - [ ] system/db health present vs absent render states
- [ ] UI: Metrics alerts
  - [ ] memory > 90 alert
  - [ ] disk > 90 alert

## How to run

- Full suite: `pnpm test:minimal:ci`
- Service-only: `pnpm vitest run src/services/__tests__ | cat`

## Notes

- Tests use lightweight Tabs/Switch mocks and disabled intervals for speed.
- Scope queries to card containers to avoid ambiguous matches.
