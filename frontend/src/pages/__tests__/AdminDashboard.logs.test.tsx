import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import * as AdminApi from '@/services/adminApi';
import AdminDashboard from '@/pages/AdminDashboard';

vi.mock('@/services/adminApi');

const mocked = AdminApi as unknown as {
  default: any;
};

describe('AdminDashboard Logs pagination', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Minimal stubs for initial loadAdminData()
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
      getSystemLogs: vi.fn().mockResolvedValue({
        items: [
          {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            message: 'A',
            module: 'db',
            user_id: null,
          },
          {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            message: 'B',
            module: 'db',
            user_id: null,
          },
        ],
        skip: 0,
        limit: 2,
        total: 3,
      }),
      getUserPermissions: vi
        .fn()
        .mockResolvedValue({ permissions: [], roles: [], is_admin: true }),
      getAuditLogs: vi
        .fn()
        .mockResolvedValue({ items: [], skip: 0, limit: 100, total: 0 }),
    };
  });

  it('renders logs list and paging controls', async () => {
    render(<AdminDashboard />);

    // Tabs: click System
    const systemTab = await screen.findByRole('tab', { name: /system/i });
    fireEvent.click(systemTab);

    // Expect first page rows
    const rowA = await screen.findByText('A');
    const rowB = await screen.findByText('B');
    expect(rowA).toBeInTheDocument();
    expect(rowB).toBeInTheDocument();

    // Prev/Next buttons should exist in Logs tab area
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeInTheDocument();

    // Shows range text like "1-2 of 3"
    const range = await screen.findByText(/of 3/i);
    expect(range.textContent).toMatch(/1-2 of 3/);
  });
});
