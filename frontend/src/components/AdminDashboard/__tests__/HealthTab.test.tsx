import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HealthTab from '../HealthTab';
import { useAdminStore } from '@/stores/adminStore';

vi.mock('@/stores/adminStore');
const mockUseAdminStore = vi.mocked(useAdminStore);

describe('HealthTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows system and database health when present', () => {
    mockUseAdminStore.mockReturnValue({
      systemHealth: { data: { status: 'healthy' }, loading: false, error: null, lastUpdated: Date.now() },
      databaseHealth: { data: { status: 'ok' }, loading: false, error: null, lastUpdated: Date.now() },
    } as any);

    render(<HealthTab />);
    expect(screen.getByText(/System Health/i)).toBeInTheDocument();
    expect(screen.getByText(/Database Health/i)).toBeInTheDocument();
  });

  it('shows absent messages when health not available', () => {
    mockUseAdminStore.mockReturnValue({
      systemHealth: { data: null, loading: false, error: null, lastUpdated: null },
      databaseHealth: { data: null, loading: false, error: null, lastUpdated: null },
    } as any);

    render(<HealthTab />);
    expect(screen.getByText(/No system health data/i)).toBeInTheDocument();
    expect(screen.getByText(/No database health data/i)).toBeInTheDocument();
  });
});
