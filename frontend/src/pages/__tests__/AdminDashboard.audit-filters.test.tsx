import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import * as AdminApi from '@/services/adminApi'
import AdminDashboard from '@/pages/AdminDashboard'

vi.mock('@/services/adminApi')

const mocked = AdminApi as unknown as { default: any }

describe('AdminDashboard Audit filters', () => {
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
            getSystemMetrics: vi.fn().mockResolvedValue({}),
            checkDataIntegrity: vi.fn().mockResolvedValue([]),
            getSecurityAudit: vi.fn().mockResolvedValue({ failed_logins_24h: 0, suspicious_activities: [], rate_limit_violations: 0, password_policy_violations: 0, recommendations: [] }),
            getSystemHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
            getDatabaseHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
            getSystemLogs: vi.fn().mockResolvedValue([]),
            getUserPermissions: vi.fn().mockResolvedValue({ permissions: [], roles: [], is_admin: true }),
            getAuditLogs: vi.fn().mockResolvedValue({ items: [], skip: 0, limit: 10, total: 0 }),
        }
    })

    it('applies audit filters and calls service with correct params', async () => {
        render(<AdminDashboard />)
        const auditTab = await screen.findByRole('tab', { name: /audit/i })
        await userEvent.click(auditTab)

        const skipInput = await screen.findByPlaceholderText('Skip')
        const limitInput = await screen.findByPlaceholderText('Limit')
        const userIdInput = await screen.findByPlaceholderText('User ID')
        const actionInput = await screen.findByPlaceholderText('Action')
        const dateInputs = await screen.findAllByDisplayValue('')
        const fromInput = dateInputs[0] as HTMLInputElement
        const toInput = dateInputs[1] as HTMLInputElement

        await userEvent.clear(skipInput)
        await userEvent.type(skipInput, '10')
        await userEvent.clear(limitInput)
        await userEvent.type(limitInput, '10')
        await userEvent.type(userIdInput, '42')
        await userEvent.type(actionInput, 'LOGIN')
        await userEvent.type(fromInput as HTMLInputElement, '2025-02-01')
        await userEvent.type(toInput as HTMLInputElement, '2025-02-28')

        const refresh = await screen.findByRole('button', { name: /^refresh$/i })
        await userEvent.click(refresh)

        expect(mocked.default.getAuditLogs).toHaveBeenCalledWith(10, 10, 42, 'LOGIN', expect.objectContaining({
            from: '2025-02-01', to: '2025-02-28', envelope: true,
        }))
    })
})


