import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogFilterForm from '../LogFilterForm';

(Element.prototype as any).scrollIntoView = vi.fn();
(Element.prototype as any).hasPointerCapture = () => false;
(Element.prototype as any).releasePointerCapture = vi.fn();

describe('LogFilterForm', () => {
  it('triggers callbacks on user interactions', async () => {
    const onChange = vi.fn();
    const onRefresh = vi.fn();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(
      <LogFilterForm
        level="ERROR"
        limit={100}
        from=""
        to=""
        search=""
        skip={50}
        total={200}
        onChange={onChange}
        onRefresh={onRefresh}
        onPrev={onPrev}
        onNext={onNext}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search');
    await userEvent.type(searchInput, 't');
    expect(onChange).toHaveBeenLastCalledWith({ search: 't', skip: 0 });

    const refreshBtn = screen.getByRole('button', { name: /refresh logs/i });
    await userEvent.click(refreshBtn);
    expect(onRefresh).toHaveBeenCalled();

    const prevBtn = screen.getByRole('button', { name: /prev/i });
    await userEvent.click(prevBtn);
    expect(onPrev).toHaveBeenCalled();

    const nextBtn = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalled();
  });
});
