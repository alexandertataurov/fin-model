import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import * as AdminApi from '@/services/adminApi'
import AdminDashboard from '@/pages/AdminDashboard'

vi.mock('@/services/adminApi')

const mocked = AdminApi as unknown as { default: any }

describe('AdminDashboard Auto-refresh toggle', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        mocked.default = {
            getSystemStats: vi.fn().mockResolvedValue({
                users: { total: 0, active: 0, verified: 0, new_24h: 0 },
                files: { total: 0, completed: 0, processing: 0, failed: 0 },
                financial_data: { statements: 0, parameters: 0 },
                system: { database_size: '0 GB', timestamp: new Date().toISOString() },
                performance: { avg_file_size_mb: 0 },
            }),
            getUserActivity: vi.fn().mockResolvedValue([]),
            getSystemMetrics: vi.fn().mockResolvedValue({ cpu_usage: 1, memory_usage: 2, disk_usage: 3, active_connections: 1, request_count_24h: 1, error_rate_24h: 0, avg_response_time: 1 }),
            checkDataIntegrity: vi.fn().mockResolvedValue([]),
            getSecurityAudit: vi.fn().mockResolvedValue({ failed_logins_24h: 0, suspicious_activities: [], rate_limit_violations: 0, password_policy_violations: 0, recommendations: [] }),
            getSystemHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
            getDatabaseHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
            getSystemLogs: vi.fn().mockResolvedValue({ items: [], skip: 0, limit: 100, total: 0 }),
            getUserPermissions: vi.fn().mockResolvedValue({ permissions: [], roles: [], is_admin: true }),
            getAuditLogs: vi.fn().mockResolvedValue({ items: [], skip: 0, limit: 100, total: 0 }),
        }
    })

    it('clears interval when toggled off', async () => {
        const clearSpy = vi.fn()
        const intervalId = 123 as unknown as number
        vi.stubGlobal('setInterval', (cb: any, _ms?: number) => { cb(); return intervalId })
        vi.stubGlobal('clearInterval', clearSpy)

        render(<AdminDashboard />)

        // Toggle off
        const switchBtn = await screen.findByRole('switch')
        await userEvent.click(switchBtn)

        expect(clearSpy).toHaveBeenCalledWith(intervalId)
    })
})


