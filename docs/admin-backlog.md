## Admin Dashboard Missing/Mock Implementations (Backlog)

- Backend

  - Audit logs
    - [x] Replace synthetic data in `/admin/audit-logs` with DB-backed results
    - [ ] Persist real audit events (models + hooks)
      - [x] User/role changes (create/update/deactivate, role assign/remove)
      - [ ] Auth events (login/logout/failed login, password actions)
      - [ ] File events (uploads, processing, cleanup)
      - [ ] Maintenance actions (schedules, executions)
    - [x] Support filters: `skip`, `limit`, `user_id`, `action`, `from`, `to`
    - [x] Return envelope `{ logs, skip, limit, total }`
  - System logs (`/admin/system/logs`)
    - [x] Filters: `from`, `to`, `search`
    - [x] Pagination envelope `{ items, skip, limit, total }` (via `envelope=true`)
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
    - [x] `GET /admin/reports/overview?format=json|csv` to feed “Generate Report”
  - Consistency
    - [ ] Standardize pagination envelopes across admin endpoints (`{ items, skip, limit, total }`)
      - [x] `/admin/system/logs` (envelope=true)
      - [x] `/admin/audit-logs` (envelope=true)
      - [x] `/admin/users` (envelope=true)
    - [x] Add Pydantic response models for admin endpoints

- Frontend

  - [x] Update `AdminApiService.getAuditLogs` type to `{ logs: AuditEntry[]; skip; limit; total }`; add `AuditEntry` type
  - Data Management → Manual Ops wiring (`frontend/src/components/Admin/DataManagement.tsx`)
    - [x] Backup Database → `POST /admin/database/backup` (confirm + toast)
    - [x] Export Data → `POST /admin/database/export` (table + format select, download)
    - [x] Rebuild Indexes → `POST /admin/database/reindex` (progress toast)
    - [x] Generate Report → `/admin/reports/overview?format=` (download)
  - [x] Maintenance schedules UI: editable list (toggle enable, time, task type) using `GET/PUT /admin/maintenance/schedules`
  - Logs tab
    - [x] Add `from`/`to` date pickers
    - [x] Add text search
    - [x] Add paging (Prev/Next) using envelope
  - [x] Performance tab: add window selector (1h/24h/7d) → `/admin/database/performance`
  - [x] Security tab: add date range filters; table for `suspicious_activities` (type, user/ip, timestamp, details)
  - [x] Data tables export per-table (Download button) → `/admin/database/export?table=...`

- Validation/Safety

  - [x] Backend permission gates on destructive ops use `Permission.ADMIN_ACCESS`
  - [x] UI confirm dialogs for destructive actions (backup/reindex/cleanup)
  - [x] Empty-state/placeholder coverage (no demo/sample data)

- Quality
  - [ ] Basic API tests for new admin endpoints.
  - [ ] Frontend integration tests for Logs/Audit pagination and Maintenance actions.

Notes

- `/admin/audit-logs` now returns DB-backed entries. Continue instrumenting auth, file, and maintenance flows to persist additional audit events.
- `/admin/system/logs` currently returns hardcoded samples; replace with real source + filters (and optional streaming).
