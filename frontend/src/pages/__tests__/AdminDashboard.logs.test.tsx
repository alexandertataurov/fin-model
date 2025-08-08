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
    const now = new Date().toISOString()
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
      getSystemLogs: vi
        .fn()
        .mockResolvedValueOnce({
          items: [
            { timestamp: now, level: 'ERROR', message: 'A', module: 'db', user_id: null },
            { timestamp: now, level: 'ERROR', message: 'B', module: 'db', user_id: null },
          ],
          skip: 0,
          limit: 2,
          total: 4,
        })
        .mockResolvedValueOnce({
          items: [
            { timestamp: now, level: 'ERROR', message: 'C', module: 'db', user_id: null },
            { timestamp: now, level: 'ERROR', message: 'D', module: 'db', user_id: null },
          ],
          skip: 2,
          limit: 2,
          total: 4,
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
    const prevBtn = screen.getByRole('button', { name: /prev/i }) as HTMLButtonElement
    const nextBtn = screen.getByRole('button', { name: /next/i }) as HTMLButtonElement
    expect(nextBtn).toBeInTheDocument();

    // Shows range text like "1-2 of 4" and Prev disabled initially
    const range = await screen.findByText(/of 4/i);
    expect(range.textContent).toMatch(/1-2 of 4/);
    expect(prevBtn.disabled).toBe(true)

    // Go next, expect new rows and Prev enabled and new range
    nextBtn.click()
    const rowC = await screen.findByText('C')
    const rowD = await screen.findByText('D')
    expect(rowC).toBeInTheDocument()
    expect(rowD).toBeInTheDocument()
    const range2 = await screen.findByText(/3-4 of 4/i)
    expect(range2).toBeInTheDocument()
    expect(prevBtn.disabled).toBe(false)
  });
});
