import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import * as AdminApi from '@/services/admin';
import AdminDashboard from '@/pages/AdminDashboard';

vi.mock('@/services/admin');

const mocked = AdminApi as unknown as Record<string, any>;

describe('AdminDashboard Audit filters', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    Object.assign(mocked, {
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
      getSecurityAudit: vi
        .fn()
        .mockResolvedValue({
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
        .mockResolvedValue({ items: [], skip: 0, limit: 10, total: 0 }),
    });
  });

  it('applies audit filters and calls service with correct params', async () => {
    render(<AdminDashboard />);

    const skipInput = await screen.findByPlaceholderText('Skip');
    const limitInput = await screen.findByPlaceholderText('Limit');
    const userIdInput = await screen.findByPlaceholderText('User ID');
    const actionInput = await screen.findByPlaceholderText('Action');
    // Skip date inputs to avoid jsdom date control quirks

    fireEvent.input(skipInput, { target: { value: '10' } });
    fireEvent.input(limitInput, { target: { value: '10' } });
    fireEvent.input(userIdInput, { target: { value: '42' } });
    fireEvent.input(actionInput, { target: { value: 'LOGIN' } });
    // Dates omitted in this test

    // Click the Refresh button within the Audit section (scope by input's container)
    const section = skipInput.closest('div')!.parentElement!
      .parentElement as HTMLElement;
    const refreshBtn = Array.from(section.querySelectorAll('button')).find(b =>
      /^\s*refresh\s*$/i.test(b.textContent || '')
    ) as HTMLButtonElement;
    await userEvent.click(refreshBtn);

    const calls = mocked.getAuditLogs.mock.calls;
    const last = calls[calls.length - 1];
    expect(last[0]).toBe(10);
    expect(last[1]).toBe(10);
    expect(last[2]).toBe(42);
    expect(last[3]).toBe('LOGIN');
    expect(last[4]).toMatchObject({ envelope: true });
  }, 15000);
});
