import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import * as AdminApi from '@/services/adminApi';
import AdminDashboard from '@/pages/AdminDashboard';

vi.mock('@/services/adminApi');

const mocked = AdminApi as unknown as {
    default: any;
};

const baseStats = {
    users: { total: 1000, active: 800, verified: 700, new_24h: 25 },
    files: { total: 5000, completed: 4800, processing: 50, failed: 5 },
    financial_data: { statements: 1200, parameters: 3400 },
    system: { database_size: '12 GB' },
    performance: { avg_file_size_mb: 2.3 },
};

const baseMetricsLow = {
    cpu_usage: 34,
    memory_usage: 41,
    disk_usage: 55,
    active_connections: 12,
    request_count_24h: 12345,
};

const baseMetricsHighCpu = {
    ...baseMetricsLow,
    cpu_usage: 95,
};

const baseSecurity = {
    failed_logins_24h: 0,
    suspicious_activities: [],
    rate_limit_violations: 0,
    password_policy_violations: 0,
    recommendations: [],
};

const nowIso = new Date().toISOString();

describe('AdminDashboard Overview and Maintenance', () => {
    beforeEach(() => {
        vi.resetAllMocks();

        mocked.default = {
            getSystemStats: vi.fn().mockResolvedValue(baseStats),
            getUserActivity: vi.fn().mockResolvedValue([
                {
                    user_id: 1,
                    username: 'Alice',
                    files_uploaded: 3,
                    models_created: 1,
                    login_count: 5,
                    is_active: true,
                    last_login: nowIso,
                },
            ]),
            getSystemMetrics: vi.fn().mockResolvedValue(baseMetricsLow),
            checkDataIntegrity: vi.fn().mockResolvedValue([]),
            getSecurityAudit: vi.fn().mockResolvedValue(baseSecurity),
            getSystemHealth: vi.fn().mockResolvedValue({ status: 'healthy' }),
            getDatabaseHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
            getSystemLogs: vi.fn().mockResolvedValue({ items: [], total: 0, skip: 0, limit: 100 }),
            getUserPermissions: vi.fn().mockResolvedValue({ user_id: 1, roles: ['admin'], permissions: ['all'], is_admin: true }),
            getAuditLogs: vi.fn().mockResolvedValue({ items: [], total: 0, skip: 0, limit: 100 }),
            cleanupFiles: vi.fn().mockResolvedValue({ message: 'Cleanup done', orphaned_files: 0, failed_files: 0 }),
            clearRateLimits: vi.fn().mockResolvedValue({ message: 'Cleared', cleared_records: 1 }),
        };
    });

    it('renders healthy overview with no critical alerts', async () => {
        render(<AdminDashboard />);

        // Overview tab is default and should show System Performance
        expect(await screen.findByText(/System Performance/i)).toBeInTheDocument();
        // When below thresholds, shows "All Systems Healthy"
        expect(await screen.findByText(/All Systems Healthy/i)).toBeInTheDocument();
    });

    it('shows High CPU Usage alert when cpu_usage > 90', async () => {
        mocked.default.getSystemMetrics = vi.fn().mockResolvedValue(baseMetricsHighCpu);

        render(<AdminDashboard />);

        expect(await screen.findByText(/System Performance/i)).toBeInTheDocument();
        expect(await screen.findByText(/High CPU Usage/i)).toBeInTheDocument();
    });

    it('runs maintenance: preview cleanup and run cleanup', async () => {
        render(<AdminDashboard />);

        // Go to Maintenance tab
        const maintenanceTab = await screen.findByRole('tab', { name: /maintenance/i });
        await userEvent.click(maintenanceTab);

        // Preview Cleanup
        const previewBtn = await screen.findByRole('button', { name: /preview cleanup/i });
        await userEvent.click(previewBtn);
        expect(mocked.default.cleanupFiles).toHaveBeenCalledWith(true);

        // Run Cleanup
        const runBtn = await screen.findByRole('button', { name: /run cleanup/i });
        await userEvent.click(runBtn);
        expect(mocked.default.cleanupFiles).toHaveBeenCalledWith(false);
    });
});


