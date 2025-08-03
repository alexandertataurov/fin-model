import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';

describe('Card', () => {
  it('renders all card components with correct data-slots', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    // Check that all components are rendered
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();

    // Check data-slots
    expect(screen.getByText('Card Title')).toHaveAttribute('data-slot', 'card-title');
    expect(screen.getByText('Card Description')).toHaveAttribute('data-slot', 'card-description');
    expect(screen.getByText('Card Content').closest('[data-slot="card-content"]')).toBeInTheDocument();
    expect(screen.getByText('Card Footer').closest('[data-slot="card-footer"]')).toBeInTheDocument();
  });

  it('handles interactive card behavior', async () => {
    const handleClick = vi.fn();
    render(
      <Card interactive onClick={handleClick}>
        <CardContent>Interactive Card</CardContent>
      </Card>
    );

    const card = screen
      .getByText('Interactive Card')
      .closest('[data-slot="card"]');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');

    if (card) {
      await userEvent.click(card);
      expect(handleClick).toHaveBeenCalled();

      // Test keyboard interaction
      await userEvent.tab();
      await userEvent.keyboard('{enter}');
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('supports different heading levels for CardTitle', () => {
    render(
      <>
        <CardTitle as="h1">Heading 1</CardTitle>
        <CardTitle as="h2">Heading 2</CardTitle>
        <CardTitle as="h3">Heading 3</CardTitle>
      </>
    );

    expect(screen.getByText('Heading 1').tagName).toBe('H1');
    expect(screen.getByText('Heading 2').tagName).toBe('H2');
    expect(screen.getByText('Heading 3').tagName).toBe('H3');
  });

  it('applies hover styles correctly', () => {
    render(
      <Card hover>
        <CardContent>Hover Card</CardContent>
      </Card>
    );

    const card = screen.getByText('Hover Card').closest('[data-slot="card"]');
    expect(card).toHaveClass('hover:-translate-y-0.5', 'hover:shadow-md');
  });

  it('maintains ARIA attributes', () => {
    render(
      <Card aria-label="Example card">
        <CardHeader>
          <CardTitle aria-level={2}>Accessible Title</CardTitle>
          <CardDescription aria-label="Card description">
            Description
          </CardDescription>
        </CardHeader>
      </Card>
    );

    expect(screen.getByLabelText('Example card')).toBeInTheDocument();
    expect(screen.getByText('Accessible Title')).toHaveAttribute('aria-level', '2');
    expect(screen.getByLabelText('Card description')).toBeInTheDocument();
  });

  it('renders header actions in correct slot', () => {
    render(
      <Card>
        <CardHeader actions={<button>Action</button>}>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const actionsContainer = screen
      .getByRole('button')
      .closest('[data-slot="card-actions"]');
    expect(actionsContainer).toBeInTheDocument();
  });

  it('forwards refs to all components', () => {
    const refs = {
      card: React.createRef<HTMLDivElement>(),
      header: React.createRef<HTMLDivElement>(),
      title: React.createRef<HTMLHeadingElement>(),
      description: React.createRef<HTMLParagraphElement>(),
      content: React.createRef<HTMLDivElement>(),
      footer: React.createRef<HTMLDivElement>(),
    };

    render(
      <Card ref={refs.card}>
        <CardHeader ref={refs.header}>
          <CardTitle ref={refs.title}>Title</CardTitle>
          <CardDescription ref={refs.description}>Description</CardDescription>
        </CardHeader>
        <CardContent ref={refs.content}>Content</CardContent>
        <CardFooter ref={refs.footer}>Footer</CardFooter>
      </Card>
    );

    // Check that refs are properly set
    expect(refs.card.current).toBeInstanceOf(HTMLDivElement);
    expect(refs.header.current).toBeInstanceOf(HTMLDivElement);
    expect(refs.title.current).toBeInstanceOf(HTMLHeadingElement);
    expect(refs.description.current).toBeInstanceOf(HTMLParagraphElement);
    expect(refs.content.current).toBeInstanceOf(HTMLDivElement);
    expect(refs.footer.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom classes through className prop', () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">Header</CardHeader>
        <CardContent className="custom-content">Content</CardContent>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>
    );
    const footer = screen.getByText('Footer');
    expect(footer).toHaveClass('custom-footer');
  });
});
