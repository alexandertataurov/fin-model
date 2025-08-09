import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

import * as AdminApi from '@/services/adminApi'
import { toast } from 'sonner'
import AdminDashboard from '@/pages/AdminDashboard'

vi.mock('@/services/adminApi')

const mocked = AdminApi as unknown as { default: any }

describe('AdminDashboard robustness to API failures', () => {
    beforeEach(() => {
        vi.resetAllMocks()
            ; (toast.success as unknown as vi.Mock).mockClear?.()
            ; (toast.warning as unknown as vi.Mock).mockClear?.()
            ; (toast.error as unknown as vi.Mock).mockClear?.()
    })

    it('shows warning toast when some sections fail', async () => {
        mocked.default = {
            getSystemStats: vi.fn().mockResolvedValue({ users: {}, files: {}, financial_data: {}, system: {}, performance: {} }),
            getUserActivity: vi.fn().mockResolvedValue([]),
            getSystemMetrics: vi.fn().mockRejectedValue(new Error('fail')),
            checkDataIntegrity: vi.fn().mockResolvedValue([]),
            getSecurityAudit: vi.fn().mockResolvedValue({ failed_logins_24h: 0, suspicious_activities: [], rate_limit_violations: 0, password_policy_violations: 0, recommendations: [] }),
            getSystemHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
            getDatabaseHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
            getSystemLogs: vi.fn().mockResolvedValue([]),
            getUserPermissions: vi.fn().mockResolvedValue({ permissions: [], roles: [], is_admin: true }),
            getAuditLogs: vi.fn().mockResolvedValue({ items: [], skip: 0, limit: 100, total: 0 }),
        }
        render(<AdminDashboard />)
        await waitFor(() => expect((toast.warning as any).mock.calls.length).toBeGreaterThanOrEqual(1))
    })

    it('shows error toast when all sections fail', async () => {
        const reject = vi.fn().mockRejectedValue(new Error('down'))
        mocked.default = {
            getSystemStats: reject,
            getUserActivity: reject,
            getSystemMetrics: reject,
            checkDataIntegrity: reject,
            getSecurityAudit: reject,
            getSystemHealth: reject,
            getDatabaseHealth: reject,
            getSystemLogs: reject,
            getUserPermissions: reject,
            getAuditLogs: reject,
        }
        render(<AdminDashboard />)
        await waitFor(() => expect((toast.error as any).mock.calls.length).toBeGreaterThanOrEqual(1))
    })
})


