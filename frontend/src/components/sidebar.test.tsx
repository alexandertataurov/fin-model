import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Home, Settings } from 'lucide-react';

const mockItems = [
  {
    title: 'Home',
    href: '/',
    icon: <Home data-testid="home-icon" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings data-testid="settings-icon" />,
  },
];

describe('Sidebar', () => {
  const renderSidebar = () =>
    render(
      <BrowserRouter>
        <Sidebar items={mockItems} />
      </BrowserRouter>
    );

  it('renders all navigation items', () => {
    renderSidebar();

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders icons correctly', () => {
    renderSidebar();

    const homeIcon = document.querySelector('[data-testid="home-icon"]');
    expect(homeIcon).not.toBeNull();

    const settingsIcon = document.querySelector('[data-testid="settings-icon"]');
    expect(settingsIcon).not.toBeNull();
  });

  it('renders correct links', () => {
    renderSidebar();

    const homeLink = screen.getByText('Home').closest('a');
    const settingsLink = screen.getByText('Settings').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('renders the app title', () => {
    renderSidebar();

    expect(screen.getByText('FinVision')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <BrowserRouter>
        <Sidebar items={mockItems} className="custom-sidebar" data-testid="sidebar" />
      </BrowserRouter>
    );

    const sidebar = screen.getByText('FinVision').closest('div')?.parentElement;

    expect(sidebar).toHaveClass('custom-sidebar');
  });

  it('spreads additional props to the root element', () => {
    render(
      <BrowserRouter>
        <Sidebar items={mockItems} data-testid="sidebar" />
      </BrowserRouter>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });
});
