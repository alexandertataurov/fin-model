import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import * as AdminApi from '@/services/adminApi';
import AdminDashboard from '@/pages/AdminDashboard';

vi.mock('@/services/adminApi');

const mocked = AdminApi as unknown as {
  default: any;
};

describe('AdminDashboard Maintenance schedules', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mocked.default = {
      getSystemStats: vi.fn().mockResolvedValue({
        users: {},
        files: {},
        financial_data: {},
        system: {},
        performance: {},
      }),
      getUserActivity: vi.fn().mockResolvedValue([]),
      getSystemMetrics: vi.fn().mockResolvedValue({ cpu_usage: 0 }),
      checkDataIntegrity: vi.fn().mockResolvedValue([]),
      getSecurityAudit: vi.fn().mockResolvedValue({
        failed_logins_24h: 0,
        suspicious_activities: [],
        rate_limit_violations: 0,
        password_policy_violations: 0,
        recommendations: [],
      }),
      getSystemHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
      getDatabaseHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
      getSystemLogs: vi.fn().mockResolvedValue([]),
      getUserPermissions: vi
        .fn()
        .mockResolvedValue({ permissions: [], roles: [], is_admin: true }),
      getAuditLogs: vi
        .fn()
        .mockResolvedValue({ items: [], skip: 0, limit: 100, total: 0 }),
    };
  });

  it('saves schedule edits (UI flow)', async () => {
    render(<AdminDashboard />);

    // Navigate to Maintenance tab
    const maintenanceTab = await screen.findByRole('tab', {
      name: /maintenance/i,
    });
    fireEvent.click(maintenanceTab);

    // Mock update call and existing schedules list
    mocked.default.getMaintenanceSchedules = vi.fn().mockResolvedValue({
      items: [
        {
          id: 'daily-cleanup',
          name: 'Daily Cleanup',
          task: 'cleanup',
          schedule: '0 2 * * *',
          enabled: true,
        },
      ],
    });
    mocked.default.updateMaintenanceSchedules = vi.fn().mockResolvedValue({
      items: [
        {
          id: 'daily-cleanup',
          name: 'Daily Cleanup',
          task: 'cleanup',
          schedule: '0 1 * * *',
          enabled: false,
        },
      ],
    });

    // Trigger a reload to fetch schedules
    await waitFor(() =>
      expect(mocked.default.getMaintenanceSchedules).toBeDefined()
    );

    // Toggle enabled, change schedule and task to simulate edits
    const checkbox = await screen.findByRole('checkbox');
    fireEvent.click(checkbox);
    const scheduleInput = await screen.findByDisplayValue('0 2 * * *');
    fireEvent.change(scheduleInput, { target: { value: '0 1 * * *' } });
    const taskSelect = await screen.findByDisplayValue('cleanup');
    fireEvent.change(taskSelect, { target: { value: 'backup' } });

    // Click Save Schedules button
    const saveBtn = await screen.findByRole('button', {
      name: /save schedules/i,
    });
    fireEvent.click(saveBtn);

    expect(mocked.default.updateMaintenanceSchedules).toHaveBeenCalled();
  });
});
