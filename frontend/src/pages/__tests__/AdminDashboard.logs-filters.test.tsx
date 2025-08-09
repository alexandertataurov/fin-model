import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import * as AdminApi from '@/services/admin'
import AdminDashboard from '@/pages/AdminDashboard'

vi.mock('@/services/admin')

const mocked = AdminApi as unknown as Record<string, any>

describe('AdminDashboard Logs filters', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        const now = new Date().toISOString()
        Object.assign(mocked, {
            getSystemStats: vi.fn().mockResolvedValue({ users: {}, files: {}, financial_data: {}, system: {}, performance: {} }),
            getUserActivity: vi.fn().mockResolvedValue([]),
            getSystemMetrics: vi.fn().mockResolvedValue({ cpu_usage: 0 }),
            checkDataIntegrity: vi.fn().mockResolvedValue([]),
            getSecurityAudit: vi.fn().mockResolvedValue({ failed_logins_24h: 0, suspicious_activities: [], rate_limit_violations: 0, password_policy_violations: 0, recommendations: [] }),
            getSystemHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
            getDatabaseHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
            getUserPermissions: vi.fn().mockResolvedValue({ permissions: [], roles: [], is_admin: true }),
            getAuditLogs: vi.fn().mockResolvedValue({ items: [], skip: 0, limit: 100, total: 0 }),
            getSystemLogs: vi.fn().mockResolvedValue({
                items: [
                    { timestamp: now, level: 'ERROR', message: 'A', module: 'db', user_id: null },
                    { timestamp: now, level: 'ERROR', message: 'B', module: 'db', user_id: null },
                ], skip: 0, limit: 50, total: 2
            }),
        })
    })

    it('applies level/limit/date/search and calls service with correct params', async () => {
        render(<AdminDashboard />)

        const logsTab = await screen.findByRole('tab', { name: /logs/i })
        await userEvent.click(logsTab)

        // Scope to Logs card section to avoid collisions with Audit controls
        const logsCardTitle = await screen.findByText(/System Logs/i)
        const logsSection = logsCardTitle.closest('div')!.parentElement!.parentElement as HTMLElement

        // Change level to INFO (first select)
        const selects = Array.from(logsSection.querySelectorAll('select'))
        const levelSel = selects[0] as HTMLSelectElement
        await userEvent.selectOptions(levelSel, 'INFO')

        // Change limit to 50 (second select)
        const limitSel = selects[1] as HTMLSelectElement
        await userEvent.selectOptions(limitSel, '50')

        // Set date range and search (date inputs within logs section)
        const dateInputs = Array.from(logsSection.querySelectorAll('input[type="date"]')) as HTMLInputElement[]
        const fromInput = dateInputs[0]
        const toInput = dateInputs[1]
        await userEvent.type(fromInput, '2025-01-01')
        await userEvent.type(toInput, '2025-01-31')
        const searchBox = logsSection.querySelector('input[type="text"][placeholder="Search"]') as HTMLInputElement
        await userEvent.type(searchBox, 'timeout')

        // Refresh Logs button
        const refreshBtn = Array.from(logsSection.querySelectorAll('button')).find(b => /refresh logs/i.test(b.textContent || '')) as HTMLButtonElement
        await userEvent.click(refreshBtn)

        expect(mocked.getSystemLogs).toHaveBeenCalledWith('INFO', 50, expect.objectContaining({
            from: '2025-01-01', to: '2025-01-31', search: 'timeout', skip: 0, envelope: true,
        }))

        // Prev/Next disabled when total <= limit
        const prevBtn = Array.from(logsSection.querySelectorAll('button')).find(b => /prev/i.test(b.textContent || '')) as HTMLButtonElement
        const nextBtn = Array.from(logsSection.querySelectorAll('button')).find(b => /next/i.test(b.textContent || '')) as HTMLButtonElement
        expect(prevBtn.disabled).toBe(true)
        expect(nextBtn.disabled).toBe(true)
    })
})
