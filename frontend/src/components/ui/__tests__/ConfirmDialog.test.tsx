import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

expect.extend(toHaveNoViolations);

describe('ConfirmDialog', () => {
  it('is accessible and handles confirmation', async () => {
    const onConfirm = vi.fn();
    const { container } = render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="Confirm Action"
        description="Are you sure?"
        onConfirm={onConfirm}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalled();
  });
});

