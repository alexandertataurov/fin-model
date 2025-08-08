## Admin Dashboard Missing/Mock Implementations (Backlog)

- Backend

  - [ ] Audit logs: persist real audit events (models + hooks) for user/role changes, auth, files, maintenance; replace synthetic data in `/admin/audit-logs` with DB results. Support `skip`, `limit`, `user_id`, `action`, `from`, `to`. Return `{ logs, skip, limit, total }`.
  - [ ] System logs: integrate with logging store (DB/file). Enhance `/admin/system/logs` with pagination, `from`/`to`, `search`, and streaming option; remove sample logs.
  - [ ] DB operations: add endpoints
    - [ ] `POST /admin/database/backup` (pg_dump or job), returns `{ job_id | file_url }`.
    - [ ] `POST /admin/database/export` (full/table), params: `table?`, `format=json|csv`, returns `{ file_url }`.
    - [ ] `POST /admin/database/reindex` (blocking or job), returns `{ message | job_id }`.
  - [ ] Maintenance schedules: `GET/PUT /admin/maintenance/schedules` to CRUD daily/weekly tasks (cleanup, vacuum, archive). Validate cron/time windows.
  - [ ] DB performance: extend `/admin/database/performance` with `window=1h|24h|7d` (or `from`/`to`) and include aggregates (avg, p95, calls) per query.
  - [ ] Security audit: extend `/admin/security/audit` to accept `from`/`to`; implement failed login tracking and simple heuristics for suspicious activity (e.g., many failures per IP/user).
  - [ ] Admin reports export: `GET /admin/reports/overview?format=json|csv` to feed “Generate Report”.
  - [ ] Standardize pagination envelopes across admin endpoints (`{ items, skip, limit, total }`).

- Frontend

  - [ ] Update `AdminApiService.getAuditLogs` return type to `{ logs: AuditEntry[]; skip; limit; total }` (not `{ message }`). Create `AuditEntry` type separate from `LogEntry`.
  - [ ] Wire Data Management → Manual Operations buttons in `frontend/src/components/Admin/DataManagement.tsx`:
    - [ ] Backup Database → `POST /admin/database/backup` with confirm + toast.
    - [ ] Export Data → `POST /admin/database/export` (allow table + format select, download file).
    - [ ] Rebuild Indexes → `POST /admin/database/reindex` with progress/result toast.
    - [ ] Generate Report → call `/admin/reports/overview?format=` and download.
  - [ ] Maintenance schedules UI: replace static badges with editable schedule list (toggle enable, time, task type) calling `GET/PUT /admin/maintenance/schedules`.
  - [ ] Logs tab: add `from`/`to`, text search, paging/infinite scroll; pass to `/admin/system/logs`.
  - [ ] Performance tab: add window selector (1h/24h/7d) and forward to `/admin/database/performance`.
  - [ ] Security tab: add date range filters and table for `suspicious_activities` with columns (type, user/ip, timestamp, details).
  - [ ] Data tables export per-table in Data Management (Download button) → `/admin/database/export?table=...`.

- Validation/Safety

  - [ ] Permission gates: ensure destructive ops use `Permission.ADMIN_ACCESS` and show confirm dialogs on UI.
  - [ ] Empty-state/placeholder coverage for every tab; no demo/sample data rendered.

- Quality
  - [ ] Basic API tests for new admin endpoints.
  - [ ] Frontend integration tests for Logs/Audit pagination and Maintenance actions.

Notes

- Current `/admin/audit-logs` returns synthetic entries; frontend already tolerates `{ logs }`. Align service type and remove synthetic generation once DB storage is ready.
- Current `/admin/system/logs` returns hardcoded samples; replace with real source + filters.
