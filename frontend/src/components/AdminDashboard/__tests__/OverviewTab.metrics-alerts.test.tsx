import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OverviewTab from '../OverviewTab';
import { useAdminStore } from '@/stores/adminStore';

vi.mock('@/stores/adminStore');
const mockUseAdminStore = vi.mocked(useAdminStore);

describe('OverviewTab metrics alerts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminStore.mockReturnValue({
      systemStats: { data: { users: {}, files: {}, financial_data: {}, system: {}, performance: {} }, loading: false, error: null, lastUpdated: Date.now() },
      userActivity: { data: [], loading: false, error: null, lastUpdated: Date.now() },
      systemMetrics: {
        data: {
          cpu_usage: 10,
          memory_usage: 95,
          disk_usage: 92,
          active_connections: 1,
          request_count_24h: 1,
          error_rate_24h: 0,
          avg_response_time: 1,
        },
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      },
      systemHealth: { data: { status: 'ok' }, loading: false, error: null, lastUpdated: Date.now() },
    } as any);
  });

  it('shows High Memory Usage and Disk Usage alerts', () => {
    render(<OverviewTab />);
    expect(screen.getByText(/High Memory Usage/i)).toBeInTheDocument();
    expect(screen.getByText(/Disk Usage/i)).toBeInTheDocument();
  });
});
