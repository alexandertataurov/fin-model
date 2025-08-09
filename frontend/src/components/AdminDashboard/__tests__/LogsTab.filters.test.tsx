import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogsTab from '../LogsTab';
import { useAdminStore } from '@/stores/adminStore';

vi.mock('@/stores/adminStore');
const mockUseAdminStore = vi.mocked(useAdminStore);

describe('LogsTab filters', () => {
  const updateLogsFilters = vi.fn();
  const fetchLogsData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    updateLogsFilters.mockClear();
    fetchLogsData.mockClear();
    mockUseAdminStore.mockReturnValue({
      logs: {
        items: [],
        total: 2,
        skip: 0,
        limit: 50,
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

  it('applies filters and refreshes logs', async () => {
    render(<LogsTab />);

    const selects = screen.getAllByRole('combobox');
    await userEvent.selectOptions(selects[0], 'INFO');
    await userEvent.selectOptions(selects[1], '50');

    const dateInputs = screen.getAllByDisplayValue('');
    await userEvent.type(dateInputs[0], '2025-01-01');
    await userEvent.type(dateInputs[1], '2025-01-31');

    const searchInput = screen.getByPlaceholderText('Search');
    await userEvent.type(searchInput, 'timeout');

    const refreshBtn = screen.getByRole('button', { name: /refresh logs/i });
    await userEvent.click(refreshBtn);

    expect(updateLogsFilters).toHaveBeenLastCalledWith({
      search: 'timeout',
      to: '2025-01-31',
      from: '2025-01-01',
      limit: 50,
      level: 'INFO',
      skip: 0,
    });
    expect(fetchLogsData).toHaveBeenCalled();

    const prevBtn = screen.getByRole('button', { name: /prev/i });
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeDisabled();
  });
});
