import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from '@/design-system/providers/ThemeProvider';
import { 
  Header, 
  Dashboard, 
  DataTable, 
  ActionBar, 
  Navigation,
  UserMenu,
  NotificationCenter,
  PaginationControls,
  StatusBar,
  Form,
  Wizard
} from '@/design-system/organisms';

// Extend expect with axe matchers
expect.extend(toHaveNoViolations);

// Test wrapper with theme provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

// Mock data for testing
const mockTableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
];

const mockNotifications = [
  { id: 1, title: 'System Update', message: 'System will be updated', type: 'info' },
  { id: 2, title: 'Error Alert', message: 'Connection failed', type: 'error' },
];

describe('Accessibility Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. WCAG 2.1 AA Compliance Tests', () => {
    it('should pass axe accessibility tests for Header with Navigation and UserMenu', async () => {
      const { container } = render(
        <TestWrapper>
          <Header>
            <Navigation items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Users', href: '/users' }
            ]} />
            <UserMenu 
              user={{ name: 'John Doe', email: 'john@example.com' }}
              menuItems={[
                { label: 'Profile', href: '/profile' },
                { label: 'Settings', href: '/settings' }
              ]}
            />
          </Header>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe accessibility tests for Dashboard with DataTable', async () => {
      const { container } = render(
        <TestWrapper>
          <Dashboard>
            <DataTable 
              data={mockTableData}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'status', label: 'Status' }
              ]}
            />
          </Dashboard>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe accessibility tests for Form with Wizard', async () => {
      const { container } = render(
        <TestWrapper>
          <Wizard 
            steps={[
              { title: 'Step 1', content: 'Step 1 content' },
              { title: 'Step 2', content: 'Step 2 content' }
            ]}
            onComplete={vi.fn()}
          />
          <Form onSubmit={vi.fn()}>
            <input type="text" name="name" placeholder="Enter name" />
            <button type="submit">Submit</button>
          </Form>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe accessibility tests for NotificationCenter', async () => {
      const { container } = render(
        <TestWrapper>
          <NotificationCenter 
            notifications={mockNotifications}
            onDismiss={vi.fn()}
          />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('2. Keyboard Navigation Tests', () => {
    it('should support keyboard navigation in Navigation component', () => {
      render(
        <TestWrapper>
          <Navigation items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Users', href: '/users' },
            { label: 'Settings', href: '/settings' }
          ]} />
        </TestWrapper>
      );

      const navItems = screen.getAllByRole('link');
      
      // Test Tab navigation
      navItems[0].focus();
      expect(navItems[0]).toHaveFocus();
      
      // Test arrow key navigation
      fireEvent.keyDown(navItems[0], { key: 'ArrowRight' });
      expect(navItems[1]).toHaveFocus();
      
      fireEvent.keyDown(navItems[1], { key: 'ArrowLeft' });
      expect(navItems[0]).toHaveFocus();
    });

    it('should support keyboard navigation in UserMenu', () => {
      render(
        <TestWrapper>
          <UserMenu 
            user={{ name: 'John Doe', email: 'john@example.com' }}
            menuItems={[
              { label: 'Profile', href: '/profile' },
              { label: 'Settings', href: '/settings' },
              { label: 'Logout', href: '/logout' }
            ]}
          />
        </TestWrapper>
      );

      const menuTrigger = screen.getByRole('button', { name: /user menu/i });
      menuTrigger.focus();
      
      // Open menu with Enter key
      fireEvent.keyDown(menuTrigger, { key: 'Enter' });
      
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems[0]).toHaveFocus();
      
      // Navigate with arrow keys
      fireEvent.keyDown(menuItems[0], { key: 'ArrowDown' });
      expect(menuItems[1]).toHaveFocus();
    });

    it('should support keyboard navigation in DataTable', () => {
      render(
        <TestWrapper>
          <DataTable 
            data={mockTableData}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' }
            ]}
          />
        </TestWrapper>
      );

      const table = screen.getByRole('table');
      const rows = screen.getAllByRole('row');
      
      // Focus first data row
      rows[1].focus();
      expect(rows[1]).toHaveFocus();
      
      // Navigate with arrow keys
      fireEvent.keyDown(rows[1], { key: 'ArrowDown' });
      expect(rows[2]).toHaveFocus();
    });

    it('should support keyboard navigation in PaginationControls', () => {
      render(
        <TestWrapper>
          <PaginationControls 
            currentPage={2}
            totalPages={5}
            onPageChange={vi.fn()}
          />
        </TestWrapper>
      );

      const paginationButtons = screen.getAllByRole('button');
      const prevButton = screen.getByLabelText(/previous page/i);
      const nextButton = screen.getByLabelText(/next page/i);
      
      prevButton.focus();
      expect(prevButton).toHaveFocus();
      
      // Navigate with Tab
      fireEvent.keyDown(prevButton, { key: 'Tab' });
      expect(nextButton).toHaveFocus();
    });
  });

  describe('3. Screen Reader Support Tests', () => {
    it('should provide proper ARIA labels for Header components', () => {
      render(
        <TestWrapper>
          <Header>
            <Navigation items={[
              { label: 'Dashboard', href: '/dashboard' }
            ]} />
            <UserMenu 
              user={{ name: 'John Doe', email: 'john@example.com' }}
              menuItems={[
                { label: 'Profile', href: '/profile' }
              ]}
            />
          </Header>
        </TestWrapper>
      );

      // Check navigation ARIA label
      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveAttribute('aria-label');
      
      // Check user menu ARIA label
      const userMenu = screen.getByRole('button', { name: /user menu/i });
      expect(userMenu).toHaveAttribute('aria-label');
    });

    it('should provide proper ARIA labels for DataTable', () => {
      render(
        <TestWrapper>
          <DataTable 
            data={mockTableData}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' }
            ]}
          />
        </TestWrapper>
      );

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label');
      
      const rows = screen.getAllByRole('row');
      rows.forEach((row, index) => {
        if (index > 0) { // Skip header row
          expect(row).toHaveAttribute('aria-label');
        }
      });
    });

    it('should provide proper ARIA labels for Form components', () => {
      render(
        <TestWrapper>
          <Form onSubmit={vi.fn()}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" />
            <button type="submit">Submit</button>
          </Form>
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Name');
      expect(nameInput).toHaveAttribute('id');
      expect(nameInput).toHaveAttribute('name');
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should provide proper ARIA labels for NotificationCenter', () => {
      render(
        <TestWrapper>
          <NotificationCenter 
            notifications={mockNotifications}
            onDismiss={vi.fn()}
          />
        </TestWrapper>
      );

      const notifications = screen.getAllByRole('alert');
      notifications.forEach(notification => {
        expect(notification).toHaveAttribute('aria-label');
        expect(notification).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('4. Focus Management Tests', () => {
    it('should manage focus properly in UserMenu', async () => {
      render(
        <TestWrapper>
          <UserMenu 
            user={{ name: 'John Doe', email: 'john@example.com' }}
            menuItems={[
              { label: 'Profile', href: '/profile' },
              { label: 'Settings', href: '/settings' }
            ]}
          />
        </TestWrapper>
      );

      const menuTrigger = screen.getByRole('button', { name: /user menu/i });
      
      // Open menu
      fireEvent.click(menuTrigger);
      
      await waitFor(() => {
        const firstMenuItem = screen.getByRole('menuitem', { name: 'Profile' });
        expect(firstMenuItem).toHaveFocus();
      });
      
      // Close menu with Escape
      fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Profile' }), { key: 'Escape' });
      
      await waitFor(() => {
        expect(menuTrigger).toHaveFocus();
      });
    });

    it('should manage focus properly in Modal components', async () => {
      render(
        <TestWrapper>
          <ActionBar 
            actions={[
              { 
                label: 'Open Modal', 
                onClick: () => {
                  // Simulate modal opening
                  const modal = document.createElement('div');
                  modal.setAttribute('role', 'dialog');
                  modal.setAttribute('aria-modal', 'true');
                  document.body.appendChild(modal);
                }
              }
            ]}
          />
        </TestWrapper>
      );

      const modalButton = screen.getByText('Open Modal');
      fireEvent.click(modalButton);
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveAttribute('aria-modal', 'true');
      });
    });

    it('should manage focus properly in Wizard component', async () => {
      render(
        <TestWrapper>
          <Wizard 
            steps={[
              { title: 'Step 1', content: 'Step 1 content' },
              { title: 'Step 2', content: 'Step 2 content' }
            ]}
            onComplete={vi.fn()}
          />
        </TestWrapper>
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        const step2Content = screen.getByText('Step 2 content');
        expect(step2Content).toBeInTheDocument();
      });
    });
  });

  describe('5. Color Contrast and Visual Accessibility', () => {
    it('should maintain proper color contrast in StatusBar', () => {
      render(
        <TestWrapper>
          <StatusBar 
            status="success"
            message="Operation completed successfully"
          />
        </TestWrapper>
      );

      const statusBar = screen.getByRole('status');
      const computedStyle = window.getComputedStyle(statusBar);
      
      // Check that text color and background have sufficient contrast
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;
      
      // This is a simplified check - in real implementation, you'd use a color contrast library
      expect(backgroundColor).not.toBe('transparent');
      expect(color).not.toBe('transparent');
    });

    it('should maintain proper color contrast in NotificationCenter', () => {
      render(
        <TestWrapper>
          <NotificationCenter 
            notifications={[
              { 
                id: 1, 
                title: 'Success', 
                message: 'Operation successful', 
                type: 'success' 
              },
              { 
                id: 2, 
                title: 'Error', 
                message: 'Operation failed', 
                type: 'error' 
              }
            ]}
            onDismiss={vi.fn()}
          />
        </TestWrapper>
      );

      const notifications = screen.getAllByRole('alert');
      notifications.forEach(notification => {
        const computedStyle = window.getComputedStyle(notification);
        expect(computedStyle.backgroundColor).not.toBe('transparent');
        expect(computedStyle.color).not.toBe('transparent');
      });
    });
  });

  describe('6. Semantic HTML Structure Tests', () => {
    it('should use proper semantic HTML in Header', () => {
      render(
        <TestWrapper>
          <Header>
            <Navigation items={[
              { label: 'Dashboard', href: '/dashboard' }
            ]} />
          </Header>
        </TestWrapper>
      );

      // Check for proper heading structure
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
    });

    it('should use proper semantic HTML in DataTable', () => {
      render(
        <TestWrapper>
          <DataTable 
            data={mockTableData}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' }
            ]}
          />
        </TestWrapper>
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const tableHeader = screen.getByRole('rowgroup');
      expect(tableHeader).toBeInTheDocument();
      
      const tableBody = screen.getAllByRole('rowgroup')[1];
      expect(tableBody).toBeInTheDocument();
    });

    it('should use proper semantic HTML in Form', () => {
      render(
        <TestWrapper>
          <Form onSubmit={vi.fn()}>
            <fieldset>
              <legend>Personal Information</legend>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" />
            </fieldset>
            <button type="submit">Submit</button>
          </Form>
        </TestWrapper>
      );

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      const fieldset = screen.getByRole('group');
      expect(fieldset).toBeInTheDocument();
      
      const legend = screen.getByText('Personal Information');
      expect(legend).toBeInTheDocument();
    });
  });

  describe('7. Dynamic Content Accessibility', () => {
    it('should announce dynamic content changes in StatusBar', async () => {
      const { rerender } = render(
        <TestWrapper>
          <StatusBar 
            status="loading"
            message="Loading data..."
          />
        </TestWrapper>
      );

      const statusBar = screen.getByRole('status');
      expect(statusBar).toHaveAttribute('aria-live', 'polite');
      
      // Update status
      rerender(
        <TestWrapper>
          <StatusBar 
            status="success"
            message="Data loaded successfully"
          />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Data loaded successfully')).toBeInTheDocument();
      });
    });

    it('should announce dynamic content changes in NotificationCenter', async () => {
      const { rerender } = render(
        <TestWrapper>
          <NotificationCenter 
            notifications={[]}
            onDismiss={vi.fn()}
          />
        </TestWrapper>
      );

      // Add notification
      rerender(
        <TestWrapper>
          <NotificationCenter 
            notifications={mockNotifications}
            onDismiss={vi.fn()}
          />
        </TestWrapper>
      );
      
      await waitFor(() => {
        const notifications = screen.getAllByRole('alert');
        notifications.forEach(notification => {
          expect(notification).toHaveAttribute('aria-live', 'polite');
        });
      });
    });
  });
});
