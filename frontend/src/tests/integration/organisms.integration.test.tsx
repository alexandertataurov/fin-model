import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/design-system/providers/ThemeProvider';
import { 
  Header, 
  Dashboard, 
  DataTable, 
  ActionBar, 
  Navigation,
  UserMenu,
  NotificationCenter,
  SearchBar,
  FilterPanel,
  PaginationControls,
  StatusBar,
  Form,
  Wizard
} from '@/design-system/organisms';

// Mock performance measurement
const mockPerformanceObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
};
global.PerformanceObserver = vi.fn().mockImplementation(() => mockPerformanceObserver);

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

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
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
];

const mockNotifications = [
  { id: 1, title: 'System Update', message: 'System will be updated', type: 'info' },
  { id: 2, title: 'Error Alert', message: 'Connection failed', type: 'error' },
];

describe('Organisms Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Cross-Component Compatibility Tests', () => {
    it('should integrate Header with Navigation and UserMenu', async () => {
      render(
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

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should integrate Dashboard with DataTable and ActionBar', async () => {
      render(
        <TestWrapper>
          <Dashboard>
            <ActionBar 
              actions={[
                { label: 'Add User', onClick: vi.fn() },
                { label: 'Export', onClick: vi.fn() }
              ]}
            />
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

      expect(screen.getByText('Add User')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should integrate SearchBar with FilterPanel and DataTable', async () => {
      const mockOnSearch = vi.fn();
      const mockOnFilter = vi.fn();

      render(
        <TestWrapper>
          <SearchBar onSearch={mockOnSearch} placeholder="Search users..." />
          <FilterPanel 
            filters={[
              { key: 'status', label: 'Status', options: ['active', 'inactive'] }
            ]}
            onFilter={mockOnFilter}
          />
          <DataTable 
            data={mockTableData}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' }
            ]}
          />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search users...');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      expect(mockOnSearch).toHaveBeenCalledWith('John');
    });
  });

  describe('2. Accessibility Testing for Organism Combinations', () => {
    it('should maintain accessibility when Header, Navigation, and UserMenu are combined', () => {
      render(
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

      // Check for proper ARIA labels
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label');
      
      // Check for keyboard navigation
      const navItems = screen.getAllByRole('link');
      navItems.forEach(item => {
        expect(item).toHaveAttribute('tabindex');
      });
    });

    it('should maintain accessibility in Dashboard with DataTable and PaginationControls', () => {
      render(
        <TestWrapper>
          <Dashboard>
            <DataTable 
              data={mockTableData}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' }
              ]}
            />
            <PaginationControls 
              currentPage={1}
              totalPages={5}
              onPageChange={vi.fn()}
            />
          </Dashboard>
        </TestWrapper>
      );

      // Check table accessibility
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Check pagination accessibility
      const pagination = screen.getByRole('navigation', { name: /pagination/i });
      expect(pagination).toBeInTheDocument();
    });

    it('should maintain accessibility in Form with Wizard and StatusBar', () => {
      render(
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
          <StatusBar 
            status="processing"
            message="Processing your request..."
          />
        </TestWrapper>
      );

      // Check form accessibility
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      // Check wizard accessibility
      const wizard = screen.getByRole('navigation', { name: /wizard/i });
      expect(wizard).toBeInTheDocument();
    });
  });

  describe('3. Performance Benchmarks for Organism Workflows', () => {
    it('should render Dashboard with DataTable efficiently', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <Dashboard>
            <DataTable 
              data={Array.from({ length: 100 }, (_, i) => ({
                id: i,
                name: `User ${i}`,
                email: `user${i}@example.com`,
                status: i % 2 === 0 ? 'active' : 'inactive'
              }))}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'status', label: 'Status' }
              ]}
            />
          </Dashboard>
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render 100 rows in under 100ms
      expect(renderTime).toBeLessThan(100);
      
      await waitFor(() => {
        expect(screen.getAllByRole('row')).toHaveLength(101); // 100 data rows + 1 header
      });
    });

    it('should handle SearchBar and FilterPanel interactions efficiently', async () => {
      const mockOnSearch = vi.fn();
      const mockOnFilter = vi.fn();

      render(
        <TestWrapper>
          <SearchBar onSearch={mockOnSearch} placeholder="Search..." />
          <FilterPanel 
            filters={[
              { key: 'status', label: 'Status', options: ['active', 'inactive'] },
              { key: 'role', label: 'Role', options: ['admin', 'user'] }
            ]}
            onFilter={mockOnFilter}
          />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      
      // Test rapid typing performance
      const startTime = performance.now();
      for (let i = 0; i < 10; i++) {
        fireEvent.change(searchInput, { target: { value: `search${i}` } });
      }
      const endTime = performance.now();
      
      // Should handle 10 rapid changes in under 50ms
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should handle NotificationCenter with multiple notifications efficiently', async () => {
      const manyNotifications = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        title: `Notification ${i}`,
        message: `Message ${i}`,
        type: i % 3 === 0 ? 'error' : i % 3 === 1 ? 'warning' : 'info'
      }));

      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <NotificationCenter 
            notifications={manyNotifications}
            onDismiss={vi.fn()}
          />
        </TestWrapper>
      );

      const endTime = performance.now();
      
      // Should render 50 notifications in under 200ms
      expect(endTime - startTime).toBeLessThan(200);
      
      await waitFor(() => {
        expect(screen.getAllByRole('alert')).toHaveLength(50);
      });
    });
  });

  describe('4. End-to-End Organism Workflow Tests', () => {
    it('should complete full user management workflow', async () => {
      const mockOnAddUser = vi.fn();
      const mockOnSearch = vi.fn();
      const mockOnFilter = vi.fn();
      const mockOnPageChange = vi.fn();

      render(
        <TestWrapper>
          <Header>
            <Navigation items={[
              { label: 'Users', href: '/users' }
            ]} />
            <UserMenu 
              user={{ name: 'Admin', email: 'admin@example.com' }}
              menuItems={[
                { label: 'Settings', href: '/settings' }
              ]}
            />
          </Header>
          
          <Dashboard>
            <ActionBar 
              actions={[
                { label: 'Add User', onClick: mockOnAddUser }
              ]}
            />
            
            <SearchBar onSearch={mockOnSearch} placeholder="Search users..." />
            
            <FilterPanel 
              filters={[
                { key: 'status', label: 'Status', options: ['active', 'inactive'] }
              ]}
              onFilter={mockOnFilter}
            />
            
            <DataTable 
              data={mockTableData}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'status', label: 'Status' }
              ]}
            />
            
            <PaginationControls 
              currentPage={1}
              totalPages={3}
              onPageChange={mockOnPageChange}
            />
          </Dashboard>
          
          <StatusBar 
            status="ready"
            message="Ready to manage users"
          />
        </TestWrapper>
      );

      // Test workflow steps
      const addUserButton = screen.getByText('Add User');
      fireEvent.click(addUserButton);
      expect(mockOnAddUser).toHaveBeenCalled();

      const searchInput = screen.getByPlaceholderText('Search users...');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      expect(mockOnSearch).toHaveBeenCalledWith('John');

      const nextPageButton = screen.getByLabelText(/next page/i);
      fireEvent.click(nextPageButton);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should complete form submission workflow with Wizard', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnComplete = vi.fn();

      render(
        <TestWrapper>
          <Wizard 
            steps={[
              { title: 'Personal Info', content: 'Step 1' },
              { title: 'Contact Info', content: 'Step 2' },
              { title: 'Review', content: 'Step 3' }
            ]}
            onComplete={mockOnComplete}
          />
          
          <Form onSubmit={mockOnSubmit}>
            <input type="text" name="firstName" placeholder="First Name" />
            <input type="text" name="lastName" placeholder="Last Name" />
            <input type="email" name="email" placeholder="Email" />
            <button type="submit">Submit</button>
          </Form>
          
          <StatusBar 
            status="processing"
            message="Processing form..."
          />
        </TestWrapper>
      );

      // Fill form
      const firstNameInput = screen.getByPlaceholderText('First Name');
      const lastNameInput = screen.getByPlaceholderText('Last Name');
      const emailInput = screen.getByPlaceholderText('Email');
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      // Submit form
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should handle notification workflow with user interactions', async () => {
      const mockOnDismiss = vi.fn();
      const mockOnAction = vi.fn();

      render(
        <TestWrapper>
          <NotificationCenter 
            notifications={mockNotifications}
            onDismiss={mockOnDismiss}
            onAction={mockOnAction}
          />
          
          <StatusBar 
            status="notifications"
            message="You have 2 notifications"
          />
        </TestWrapper>
      );

      // Check notifications are displayed
      expect(screen.getByText('System Update')).toBeInTheDocument();
      expect(screen.getByText('Error Alert')).toBeInTheDocument();

      // Dismiss a notification
      const dismissButtons = screen.getAllByLabelText(/dismiss/i);
      fireEvent.click(dismissButtons[0]);
      expect(mockOnDismiss).toHaveBeenCalledWith(1);
    });
  });

  describe('5. Error Handling and Edge Cases', () => {
    it('should handle empty data gracefully in DataTable', () => {
      render(
        <TestWrapper>
          <DataTable 
            data={[]}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' }
            ]}
          />
        </TestWrapper>
      );

      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it('should handle loading states in Dashboard', () => {
      render(
        <TestWrapper>
          <Dashboard loading={true}>
            <DataTable 
              data={mockTableData}
              columns={[
                { key: 'name', label: 'Name' }
              ]}
            />
          </Dashboard>
        </TestWrapper>
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle network errors in NotificationCenter', () => {
      render(
        <TestWrapper>
          <NotificationCenter 
            notifications={[
              { 
                id: 1, 
                title: 'Network Error', 
                message: 'Failed to connect', 
                type: 'error' 
              }
            ]}
            onDismiss={vi.fn()}
          />
        </TestWrapper>
      );

      const errorNotification = screen.getByText('Network Error');
      expect(errorNotification).toBeInTheDocument();
      expect(errorNotification.closest('[role="alert"]')).toHaveClass('error');
    });
  });
});
