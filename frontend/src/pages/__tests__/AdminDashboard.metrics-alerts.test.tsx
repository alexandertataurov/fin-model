import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import * as AdminApi from '@/services/admin';
import AdminDashboard from '@/pages/AdminDashboard';

vi.mock('@/services/admin');

const mocked = AdminApi as unknown as Record<string, any>;

describe('AdminDashboard metrics alerts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    Object.assign(mocked, {
      getSystemStats: vi.fn().mockResolvedValue({
        users: { total: 1, active: 1, verified: 1, new_24h: 0 },
        files: { total: 1, completed: 1, processing: 0, failed: 0 },
        financial_data: { statements: 1, parameters: 1 },
        system: { database_size: '1 GB', timestamp: new Date().toISOString() },
        performance: { avg_file_size_mb: 1 },
      }),
      getUserActivity: vi.fn().mockResolvedValue([]),
      getSystemMetrics: vi.fn().mockResolvedValue({
        cpu_usage: 10,
        memory_usage: 95,
        disk_usage: 92,
        active_connections: 1,
        request_count_24h: 1,
        error_rate_24h: 0,
        avg_response_time: 1,
      }),
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
        .mockResolvedValue({ items: [], skip: 0, limit: 100, total: 0 }),
    });
  });

  it('shows High Memory Usage and Disk Usage alerts in Overview', async () => {
    render(<AdminDashboard />);
    expect(await screen.findByText(/High Memory Usage/i)).toBeInTheDocument();
    expect(await screen.findByText(/Disk Usage/i)).toBeInTheDocument();
  });
});
