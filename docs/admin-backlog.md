## Admin Dashboard Missing/Mock Implementations (Backlog)

- Backend

  - Audit logs
    - [ ] Persist real audit events (models + hooks) for user/role changes, auth, files, maintenance; replace synthetic data in `/admin/audit-logs` with DB results
    - [x] Support filters: `skip`, `limit`, `user_id`, `action`, `from`, `to`
    - [x] Return envelope `{ logs, skip, limit, total }`
  - System logs (`/admin/system/logs`)
    - [x] Filters: `from`, `to`, `search`
    - [ ] Pagination envelope `{ items, skip, limit, total }`
    - [ ] Integrate with real logging store (DB/file); remove sample logs
    - [ ] Optional streaming endpoint
  - DB operations endpoints
    - [x] `POST /admin/database/backup` → `{ job_id, message }`
    - [x] `POST /admin/database/export` → `{ file_url, message }`
    - [x] `POST /admin/database/reindex` → `{ job_id, message }`
  - Maintenance schedules
    - [x] `GET/PUT /admin/maintenance/schedules` with validation (in-memory store)
    - [ ] Persist schedules (DB/cron) and execute
  - DB performance
    - [x] Extend `/admin/database/performance` with `window`, `from`, `to`
    - [ ] Include aggregates (avg, p95, calls) per query
  - Security audit
    - [x] Support `from`/`to` on `/admin/security/audit`
    - [ ] Implement failed login tracking and suspicious activity heuristics
  - Reports
    - [ ] `GET /admin/reports/overview?format=json|csv` to feed “Generate Report”
  - Consistency
    - [ ] Standardize pagination envelopes across admin endpoints (`{ items, skip, limit, total }`)

- Frontend

  - [x] Update `AdminApiService.getAuditLogs` type to `{ logs: AuditEntry[]; skip; limit; total }`; add `AuditEntry` type
  - Data Management → Manual Ops wiring (`frontend/src/components/Admin/DataManagement.tsx`)
    - [x] Backup Database → `POST /admin/database/backup` (confirm + toast)
    - [x] Export Data → `POST /admin/database/export` (table + format select, download)
    - [x] Rebuild Indexes → `POST /admin/database/reindex` (progress toast)
    - [ ] Generate Report → `/admin/reports/overview?format=` (download)
  - [ ] Maintenance schedules UI: editable list (toggle enable, time, task type) using `GET/PUT /admin/maintenance/schedules`
  - Logs tab
    - [x] Add `from`/`to` date pickers
    - [x] Add text search
    - [ ] Add paging/infinite scroll; adapt to pagination envelope
  - [ ] Performance tab: add window selector (1h/24h/7d) → `/admin/database/performance`
  - [ ] Security tab: add date range filters; table for `suspicious_activities` (type, user/ip, timestamp, details)
  - [ ] Data tables export per-table (Download button) → `/admin/database/export?table=...`

- Validation/Safety

  - [x] Backend permission gates on destructive ops use `Permission.ADMIN_ACCESS`
  - [ ] UI confirm dialogs for destructive actions
  - [x] Empty-state/placeholder coverage (no demo/sample data)

- Quality
  - [ ] Basic API tests for new admin endpoints.
  - [ ] Frontend integration tests for Logs/Audit pagination and Maintenance actions.

Notes

- Current `/admin/audit-logs` returns synthetic entries; frontend already tolerates `{ logs }`. Align service type and remove synthetic generation once DB storage is ready.
- Current `/admin/system/logs` returns hardcoded samples; replace with real source + filters.
