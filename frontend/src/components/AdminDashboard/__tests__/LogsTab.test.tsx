import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import LogsTab from '../LogsTab';
import { useAdminStore } from '@/stores/adminStore';

vi.mock('@/stores/adminStore');
const mockUseAdminStore = vi.mocked(useAdminStore);

describe('LogsTab', () => {
  const now = new Date().toISOString();
  const updateLogsFilters = vi.fn();
  const fetchLogsData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminStore.mockReturnValue({
      logs: {
        items: [
          {
            timestamp: now,
            level: 'ERROR',
            message: 'A',
            module: 'db',
            user_id: null,
          },
          {
            timestamp: now,
            level: 'ERROR',
            message: 'B',
            module: 'db',
            user_id: null,
          },
        ],
        total: 4,
        skip: 0,
        limit: 2,
        level: 'ERROR',
        search: '',
        from: '',
        to: '',
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      },
      updateLogsFilters,
      fetchLogsData,
    } as any);
  });

  it('renders logs and paging controls', async () => {
    render(<LogsTab />);

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();

    const range = screen.getByText(/of 4/);
    expect(range).toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /prev/i });
    const nextBtn = screen.getByRole('button', { name: /next/i });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    await userEvent.click(nextBtn);
    expect(updateLogsFilters).toHaveBeenCalledWith({ skip: 2 });
  });
});
