import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';

describe('Card', () => {
  it('renders basic card correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies hover effect when hover prop is true', () => {
    render(<Card hover>Card content</Card>);
    const card = screen.getByText('Card content').parentElement;
    expect(card).toHaveClass('hover:-translate-y-0.5', 'hover:shadow-md');
  });

  it('renders card header with title and description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  it('renders header actions correctly', () => {
    render(
      <Card>
        <CardHeader actions={<button>Action</button>}>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders card content with proper padding', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );

    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveClass('p-6', 'pt-0');
  });

  it('renders card footer with proper alignment', () => {
    render(
      <Card>
        <CardFooter>
          <button>Cancel</button>
          <button>Submit</button>
        </CardFooter>
      </Card>
    );

    const footer = screen.getByRole('button', { name: 'Cancel' }).parentElement;
    expect(footer).toHaveClass('flex', 'items-center');
  });

  it('forwards refs correctly', () => {
    const ref = jest.fn();
    render(<Card ref={ref}>Card content</Card>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('allows custom className to be passed to all components', () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Title</CardTitle>
          <CardDescription className="custom-description">
            Description
          </CardDescription>
        </CardHeader>
        <CardContent className="custom-content">Content</CardContent>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>
    );

    expect(
      screen.getByText('Title').parentElement?.parentElement?.parentElement
    ).toHaveClass('custom-header');
    expect(screen.getByText('Title')).toHaveClass('custom-title');
    expect(screen.getByText('Description')).toHaveClass('custom-description');
    expect(screen.getByText('Content').parentElement).toHaveClass(
      'custom-content'
    );
    expect(screen.getByText('Footer').parentElement).toHaveClass(
      'custom-footer'
    );
  });
});
