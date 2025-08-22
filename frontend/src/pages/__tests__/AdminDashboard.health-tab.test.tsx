import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import * as AdminApi from '@/services/admin';
import AdminDashboard from '@/pages/AdminDashboard';

vi.mock('@/services/admin');

const mocked = AdminApi as unknown as Record<string, any>;

describe('AdminDashboard Health tab states', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    Object.assign(mocked, {
      getSystemStats: vi
        .fn()
        .mockResolvedValue({
          users: {},
          files: {},
          financial_data: {},
          system: {},
          performance: {},
        }),
      getUserActivity: vi.fn().mockResolvedValue([]),
      getSystemMetrics: vi.fn().mockResolvedValue({}),
      checkDataIntegrity: vi.fn().mockResolvedValue([]),
      getSecurityAudit: vi
        .fn()
        .mockResolvedValue({
          failed_logins_24h: 0,
          suspicious_activities: [],
          rate_limit_violations: 0,
          password_policy_violations: 0,
          recommendations: [],
        }),
      getSystemHealth: vi.fn().mockResolvedValue({ status: 'healthy' }),
      getDatabaseHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
      getSystemLogs: vi.fn().mockResolvedValue([]),
      getUserPermissions: vi
        .fn()
        .mockResolvedValue({ permissions: [], roles: [], is_admin: true }),
      getAuditLogs: vi
        .fn()
        .mockResolvedValue({ items: [], skip: 0, limit: 100, total: 0 }),
    });
  });

  it('shows system and database health when present', async () => {
    render(<AdminDashboard />);
    const healthTab = await screen.findByRole('tab', { name: /health/i });
    healthTab.click();
    expect(await screen.findByText(/System Health/i)).toBeInTheDocument();
    expect(await screen.findByText(/Database Health/i)).toBeInTheDocument();
  });

  it('shows absent messages when health not available', async () => {
    mocked.getSystemHealth = vi.fn().mockResolvedValue(null);
    mocked.getDatabaseHealth = vi.fn().mockResolvedValue(null);
    render(<AdminDashboard />);
    const healthTab = await screen.findByRole('tab', { name: /health/i });
    healthTab.click();
    expect(
      await screen.findByText(/No system health data/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/No database health data/i)
    ).toBeInTheDocument();
  });
});
