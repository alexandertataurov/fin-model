import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminApiService, { SystemStats, UserActivity, SystemMetrics, SecurityAudit, MaintenanceSchedules, LogEntry, AuditEntry, UserWithRoles, DatabaseHealth } from '../adminApi'
import apiClient from '../api'

vi.mock('../api', () => {
    const mock = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: { request: { handlers: [] }, response: { handlers: [] } },
    }
    return { default: mock }
})

const api = apiClient as unknown as { get: any; post: any; put: any; delete: any }
const ok = (data: any) => Promise.resolve({ data })

describe('AdminApiService response shapes', () => {
    beforeEach(() => vi.clearAllMocks())

    it('returns SystemStats shape', async () => {
        const data: SystemStats = {
            users: { total: 100, active: 80, verified: 70, new_24h: 5 },
            files: { total: 500, completed: 450, processing: 10, failed: 5 },
            financial_data: { statements: 120, parameters: 340 },
            system: { database_size: '10 GB', timestamp: new Date().toISOString() },
            performance: { avg_file_size_mb: 2.5 },
        }
        api.get.mockResolvedValueOnce(ok(data))
        const res = await AdminApiService.getSystemStats()
        expect(res).toEqual(data)
    })

    it('returns UserActivity array', async () => {
        const items: UserActivity[] = [
            {
                user_id: 1,
                username: 'alice',
                last_login: null,
                login_count: 5,
                files_uploaded: 2,
                models_created: 1,
                is_active: true,
            },
        ]
        api.get.mockResolvedValueOnce(ok(items))
        const res = await AdminApiService.getUserActivity(1)
        expect(res).toEqual(items)
    })

    it('returns SystemMetrics', async () => {
        const metrics: SystemMetrics = {
            cpu_usage: 10,
            memory_usage: 20,
            disk_usage: 30,
            active_connections: 2,
            request_count_24h: 100,
            error_rate_24h: 0,
            avg_response_time: 120,
        }
        api.get.mockResolvedValueOnce(ok(metrics))
        const res = await AdminApiService.getSystemMetrics()
        expect(res).toEqual(metrics)
    })

    it('returns SecurityAudit', async () => {
        const audit: SecurityAudit = {
            failed_logins_24h: 2,
            suspicious_activities: [],
            rate_limit_violations: 0,
            password_policy_violations: 0,
            recommendations: ['Enable 2FA'],
        }
        api.get.mockResolvedValueOnce(ok(audit))
        const res = await AdminApiService.getSecurityAudit()
        expect(res.recommendations[0]).toBe('Enable 2FA')
    })

    it('returns listUsers envelope and raw', async () => {
        const user: UserWithRoles = {
            id: 1,
            username: 'alice',
            email: 'a@b.c',
            first_name: 'A',
            last_name: 'B',
            is_active: true,
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: null,
            roles: ['admin'],
        }
        api.get.mockResolvedValueOnce(
            ok({
                items: [user],
                pagination: { skip: 0, limit: 1, total: 1, has_more: false, page: 1, total_pages: 1 },
            }),
        )
        const env = (await AdminApiService.listUsers(0, 1, true)) as any
        expect(env.items[0].username).toBe('alice')

        api.get.mockResolvedValueOnce(ok([user]))
        const raw = await AdminApiService.listUsers(0, 1, false) as any
        expect(raw[0].roles).toContain('admin')
    })

    it('returns logs envelope and raw', async () => {
        const log: LogEntry = { timestamp: new Date().toISOString(), level: 'ERROR', message: 'x', module: 'core', user_id: null }
        api.get.mockResolvedValueOnce(
            ok({
                items: [log],
                pagination: { skip: 0, limit: 100, total: 1, has_more: false, page: 1, total_pages: 1 },
            }),
        )
        const env = (await AdminApiService.getSystemLogs('ERROR', 100, { envelope: true })) as any
        expect(env.items.length).toBe(1)

        api.get.mockResolvedValueOnce(ok([log]))
        const raw = await AdminApiService.getSystemLogs('ERROR', 100) as any
        expect(Array.isArray(raw)).toBe(true)
    })

    it('returns audit envelope variants', async () => {
        const entry: AuditEntry = { timestamp: new Date().toISOString(), action: 'LOGIN', user_id: 1 }
        api.get.mockResolvedValueOnce(
            ok({
                items: [entry],
                pagination: { skip: 0, limit: 100, total: 1, has_more: false, page: 1, total_pages: 1 },
            }),
        )
        const env = (await AdminApiService.getAuditLogs(0, 100, undefined, undefined, { envelope: true })) as any
        expect(env.items[0].action).toBe('LOGIN')
    })

    it('returns health and maintenance schedules', async () => {
        const db: DatabaseHealth = { status: 'ok', connection_pool: {}, table_statistics: {}, performance_metrics: {} }
        api.get.mockResolvedValueOnce(ok(db))
        const dbRes = await AdminApiService.getDatabaseHealth()
        expect(dbRes.status).toBe('ok')

        const schedules: MaintenanceSchedules = { items: [{ id: '1', name: 'cleanup', task: 'cleanup', schedule: '* * * * *', enabled: true }] }
        api.get.mockResolvedValueOnce(ok(schedules))
        const schedRes = await AdminApiService.getMaintenanceSchedules()
        expect(schedRes.items[0].task).toBe('cleanup')
    })
})


