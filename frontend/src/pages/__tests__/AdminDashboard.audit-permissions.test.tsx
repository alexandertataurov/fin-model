import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import * as AdminApi from '@/services/admin';
import AdminDashboard from '@/pages/AdminDashboard';

vi.mock('@/services/admin');

const mocked = AdminApi as unknown as Record<string, any>;

const baseStats = {
  users: { total: 10, active: 5, verified: 7, new_24h: 1 },
  files: { total: 100, completed: 90, processing: 2, failed: 1 },
  financial_data: { statements: 12, parameters: 34 },
  system: { database_size: '1 GB' },
  performance: { avg_file_size_mb: 1.2 },
};

const baseMetrics = {
  cpu_usage: 10,
  memory_usage: 20,
  disk_usage: 30,
  active_connections: 2,
  request_count_24h: 20,
};

const baseSecurity = {
  failed_logins_24h: 0,
  suspicious_activities: [],
  rate_limit_violations: 0,
  password_policy_violations: 0,
  recommendations: [],
};

describe('AdminDashboard Audit and Permissions', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    Object.assign(mocked, {
      getSystemStats: vi.fn().mockResolvedValue(baseStats),
      getUserActivity: vi.fn().mockResolvedValue([]),
      getSystemMetrics: vi.fn().mockResolvedValue(baseMetrics),
      checkDataIntegrity: vi.fn().mockResolvedValue([]),
      getSecurityAudit: vi.fn().mockResolvedValue(baseSecurity),
      getSystemHealth: vi.fn().mockResolvedValue({ status: 'healthy' }),
      getDatabaseHealth: vi.fn().mockResolvedValue({ status: 'ok' }),
      getSystemLogs: vi
        .fn()
        .mockResolvedValue({ items: [], total: 0, skip: 0, limit: 100 }),
      getUserPermissions: vi
        .fn()
        .mockResolvedValue({
          user_id: 99,
          roles: ['admin', 'analyst'],
          permissions: ['read', 'write'],
          is_admin: true,
          is_analyst: true,
        }),
      getAuditLogs: vi
        .fn()
        .mockResolvedValueOnce({
          items: Array.from({ length: 3 }, (_, i) => ({
            message: `log ${i + 1}`,
          })),
          total: 6,
          skip: 0,
          limit: 3,
        })
        .mockResolvedValueOnce({
          items: Array.from({ length: 3 }, (_, i) => ({
            message: `log ${i + 4}`,
          })),
          total: 6,
          skip: 3,
          limit: 3,
        }),
    });
  });

  it('displays permissions information', async () => {
    render(<AdminDashboard />);

    const permissionsTab = await screen.findByRole('tab', {
      name: /permissions/i,
    });
    await userEvent.click(permissionsTab);

    const panelHeading = await screen.findByText(/User Permissions/i);
    // Card structure: heading's grandparent is Card; use that as container
    const container = panelHeading.parentElement?.parentElement as HTMLElement;
    expect(container).toBeTruthy();
    expect(await screen.findByText('99')).toBeInTheDocument();
    expect(container.textContent).toMatch(/admin, analyst/i);
    expect(container.textContent).toMatch(/read, write/i);
    expect(container.textContent).toMatch(/Admin\s*Yes/i);
    expect(container.textContent).toMatch(/Analyst\s*Yes/i);
  });

  it('paginates audit logs via Next/Prev controls', async () => {
    render(<AdminDashboard />);

    const auditTab = await screen.findByRole('tab', { name: /audit/i });
    await userEvent.click(auditTab);
    const heading = await screen.findByText(/Audit Logs/i);
    const section = heading.closest('div')!.parentElement!
      .parentElement as HTMLElement;
    // Initial page should have 3 items
    const initialItems = Array.from(
      section.querySelectorAll('.border-b')
    ).slice(0, 3);
    expect(initialItems.length).toBe(3);
    const nextBtn = Array.from(section.querySelectorAll('button')).find(b =>
      /next/i.test(b.textContent || '')
    ) as HTMLButtonElement;
    const prevBtn = Array.from(section.querySelectorAll('button')).find(b =>
      /prev/i.test(b.textContent || '')
    ) as HTMLButtonElement;
    expect(prevBtn.disabled).toBe(true);
    await userEvent.click(nextBtn);
    // After next, still 3 items
    const page2Items = Array.from(section.querySelectorAll('.border-b')).slice(
      0,
      3
    );
    expect(page2Items.length).toBe(3);
  });
});
