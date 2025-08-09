import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import * as AdminApi from '@/services/admin';
import AdminDashboard from '@/pages/AdminDashboard';

vi.mock('@/services/admin');

const mocked = AdminApi as unknown as Record<string, any>;

describe('AdminDashboard Logs pagination', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Minimal stubs for initial loadAdminData()
    const now = new Date().toISOString()
    Object.assign(mocked, {
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
    });
  });

  it('renders logs list and paging controls', async () => {
    // Ensure predictable logs response for all calls
    const now = new Date().toISOString();
    mocked.getSystemLogs = vi.fn().mockResolvedValue({
      items: [
        { timestamp: now, level: 'ERROR', message: 'A', module: 'db', user_id: null },
        { timestamp: now, level: 'ERROR', message: 'B', module: 'db', user_id: null },
      ],
      skip: 0,
      limit: 2,
      total: 4,
    });

    render(<AdminDashboard />);

    // Open Logs tab to view logs
    const logsTab = await screen.findByRole('tab', { name: /logs/i });
    await userEvent.click(logsTab);

    // Force refresh to ensure the mocked getSystemLogs is used after switching tab
    const refreshBtn = await screen.findByRole('button', { name: /refresh logs/i });
    await userEvent.click(refreshBtn);

    // Wait for logs content to populate
    const rowA = await screen.findByText('A');
    const rowB = await screen.findByText('B');
    expect(rowA).toBeInTheDocument();
    expect(rowB).toBeInTheDocument();

    // Prev/Next buttons should exist in Logs tab area
    // Scope to Logs card to avoid matching Audit controls
    const logsCardTitle = await screen.findByText(/System Logs/i)
    const logsSection = logsCardTitle.closest('div')!.parentElement!.parentElement as HTMLElement
    const prevBtn = Array.from(logsSection.querySelectorAll('button')).find(b => /prev/i.test(b.textContent || '')) as HTMLButtonElement
    const nextBtn = Array.from(logsSection.querySelectorAll('button')).find(b => /next/i.test(b.textContent || '')) as HTMLButtonElement
    expect(nextBtn).toBeInTheDocument();

    // Shows range text and Prev disabled initially (range can be full if limit=100 default)
    const range = await screen.findByText((content) => /of 4/i.test(content));
    expect(range.textContent).toMatch(/of 4/);
    expect(prevBtn.disabled).toBe(true)

    // With default limit=100 and total=4, Next remains disabled and range shows full set
    expect(nextBtn.disabled).toBe(true)
  });
});
