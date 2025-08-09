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

  it('clears rate limits via Maintenance > Security action', async () => {
    mocked.default.clearRateLimits = vi.fn().mockResolvedValue({
      message: 'Cleared',
      cleared_records: 3,
    });

    render(<AdminDashboard />);

    // Navigate to Security tab (ensure audit data loads to reveal buttons)
    mocked.default.getSecurityAudit = vi.fn().mockResolvedValue({
      failed_logins_24h: 0,
      suspicious_activities: [],
      rate_limit_violations: 0,
      password_policy_violations: 0,
      recommendations: [],
    });

    const securityTab = await screen.findByRole('tab', { name: /security/i });
    await userEvent.click(securityTab);

    // Click Clear Rate Limits
    const clearBtn = await screen.findByRole('button', { name: /clear rate limits/i });
    await userEvent.click(clearBtn);

    expect(mocked.default.clearRateLimits).toHaveBeenCalled();
  });
});
