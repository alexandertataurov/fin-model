import { render, screen, waitFor } from '@testing-library/react';
import { ScrollArea } from './scroll-area';

describe('ScrollArea', () => {
  it('renders children correctly', () => {
    render(
      <ScrollArea>
        <div>Scroll content</div>
      </ScrollArea>
    );

    expect(screen.getByText('Scroll content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ScrollArea className="custom-class">
        <div>Content</div>
      </ScrollArea>
    );

    const root = screen
      .getByText('Content')
      .closest('[data-slot="scroll-area"]');
    expect(root).toHaveClass('custom-class');
  });

  it('maintains accessibility attributes', () => {
    render(
      <ScrollArea aria-label="Scrollable content">
        <div>Content</div>
      </ScrollArea>
    );

    const root = screen
      .getByText('Content')
      .closest('[data-slot="scroll-area"]');
    expect(root).toHaveAttribute('aria-label', 'Scrollable content');
  });

  it('renders viewport with correct classes', () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );

    const viewport = screen
      .getByText('Content')
      .closest('[data-slot="scroll-area-viewport"]');
    expect(viewport).toHaveClass('size-full', 'rounded-[inherit]');
  });

  it('renders scrollbar', async () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );

    await waitFor(() => {
      const scrollbar = document.querySelector(
        '[data-slot="scroll-area-scrollbar"]'
      );
      expect(scrollbar).toBeInTheDocument();
    });
  });
});
