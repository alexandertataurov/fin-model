import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card';
import userEvent from '@testing-library/user-event';

describe('HoverCard', () => {
  it('renders trigger and shows content on hover', async () => {
    render(
      <HoverCard>
        <HoverCardTrigger tabIndex={0}>Hover me</HoverCardTrigger>
        <HoverCardContent>Hover content</HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Hover me');
    expect(trigger).toBeInTheDocument();

    // Content should not be visible initially
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        // Hover over trigger
    await userEvent.hover(trigger);

    // Content should be visible
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    // Unhover
    await userEvent.unhover(trigger);

    // Content should not be visible
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    render(
      <HoverCard>
        <HoverCardTrigger tabIndex={0}>Hover me</HoverCardTrigger>
        <HoverCardContent>Hover content</HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Hover me');

    // Focus the trigger
    await userEvent.tab();
    expect(trigger).toHaveFocus();

    // Press Enter
    fireEvent.keyDown(trigger, { key: 'Enter' });

    // Content should be visible
    await waitFor(() => {
      expect(screen.getByText('Hover content')).toBeVisible();
    });

    // Press Escape
    fireEvent.keyDown(trigger, { key: 'Escape' });

    // Content should not be visible
    await waitFor(() => {
      const content = screen.queryByText('Hover content');
      expect(content).not.toBeVisible();
    });
  });

  it('applies custom className to content', async () => {
    render(
      <HoverCard>
        <HoverCardTrigger tabIndex={0}>Hover me</HoverCardTrigger>
        <HoverCardContent className="custom-content">
          Hover content
        </HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Hover me');
    await userEvent.hover(trigger);

    await waitFor(() => {
      const content = screen.getByText('Hover content');
      expect(content.closest('[data-slot="hover-card-content"]')).toHaveClass(
        'custom-content'
      );
    });
  });

  it('maintains ARIA attributes', () => {
    render(
      <HoverCard>
        <HoverCardTrigger aria-label="More information" tabIndex={0}>
          Hover me
        </HoverCardTrigger>
        <HoverCardContent>Hover content</HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Hover me');
    expect(trigger).toHaveAttribute('aria-label', 'More information');
  });
});
