import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
    BreadcrumbNav,
    Wizard
} from '@/design-system/organisms';

// Test wrapper with theme provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
        {children}
    </ThemeProvider>
);

// Mock data for workflows
const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', role: 'user' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', role: 'manager' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'pending', role: 'user' },
];

const mockProducts = [
    { id: 1, name: 'Product A', category: 'Electronics', price: 299.99, stock: 50 },
    { id: 2, name: 'Product B', category: 'Clothing', price: 89.99, stock: 25 },
    { id: 3, name: 'Product C', category: 'Electronics', price: 199.99, stock: 0 },
    { id: 4, name: 'Product D', category: 'Books', price: 29.99, stock: 100 },
];

describe('End-to-End Workflow Integration Tests', () => {
    let workflowLog: string[] = [];

    beforeAll(() => {
        workflowLog = [];
    });

    afterAll(() => {
        console.log('Workflow Test Log:', workflowLog);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        workflowLog = [];
    });

    const logStep = (step: string) => {
        workflowLog.push(step);
        console.log(`Workflow Step: ${step}`);
    };

    describe('1. User Management Workflow', () => {
        it('should complete full user onboarding workflow', async () => {
            logStep('Starting user onboarding workflow');

            const mockOnUserCreate = vi.fn();
            const mockOnUserUpdate = vi.fn();
            const mockOnUserDelete = vi.fn();
            const mockOnSearch = vi.fn();
            const mockOnFilter = vi.fn();

            render(
                <TestWrapper>
                    <Header>
                        <Navigation items={[
                            { label: 'Dashboard', href: '/dashboard' },
                            { label: 'Users', href: '/users' },
                            { label: 'Settings', href: '/settings' }
                        ]} />
                        <UserMenu
                            user={{ name: 'Admin User', email: 'admin@example.com' }}
                            menuItems={[
                                { label: 'Profile', href: '/profile' },
                                { label: 'Settings', href: '/settings' },
                                { label: 'Logout', href: '/logout' }
                            ]}
                        />
                    </Header>

                    <Dashboard>
                        <BreadcrumbNav items={[
                            { label: 'Home', href: '/' },
                            { label: 'Users', href: '/users' },
                            { label: 'User Management', href: '/users/manage' }
                        ]} />

                        <ActionBar
                            actions={[
                                { label: 'Add User', onClick: mockOnUserCreate },
                                { label: 'Bulk Import', onClick: vi.fn() },
                                { label: 'Export Users', onClick: vi.fn() }
                            ]}
                        />

                        <SearchBar
                            onSearch={mockOnSearch}
                            placeholder="Search users by name, email, or role..."
                        />

                        <FilterPanel
                            filters={[
                                { key: 'status', label: 'Status', options: ['All', 'Active', 'Inactive', 'Pending'] },
                                { key: 'role', label: 'Role', options: ['All', 'Admin', 'User', 'Manager'] },
                                { key: 'department', label: 'Department', options: ['All', 'Engineering', 'Sales', 'Marketing'] }
                            ]}
                            onFilter={mockOnFilter}
                        />

                        <DataTable
                            data={mockUsers}
                            columns={[
                                { key: 'name', label: 'Name', sortable: true },
                                { key: 'email', label: 'Email', sortable: true },
                                { key: 'status', label: 'Status', sortable: true },
                                { key: 'role', label: 'Role', sortable: true }
                            ]}
                        />

                        <PaginationControls
                            currentPage={1}
                            totalPages={5}
                            onPageChange={vi.fn()}
                        />
                    </Dashboard>

                    <StatusBar
                        status="ready"
                        message="User management system ready"
                    />
                </TestWrapper>
            );

            logStep('Rendered user management interface');

            // Step 1: Navigate to Users section
            const usersLink = screen.getByText('Users');
            fireEvent.click(usersLink);
            logStep('Clicked on Users navigation');

            // Step 2: Search for a specific user
            const searchInput = screen.getByPlaceholderText('Search users by name, email, or role...');
            fireEvent.change(searchInput, { target: { value: 'John' } });
            expect(mockOnSearch).toHaveBeenCalledWith('John');
            logStep('Searched for user "John"');

            // Step 3: Filter by status
            const statusFilter = screen.getByText('Status');
            fireEvent.click(statusFilter);
            const activeFilter = screen.getByText('Active');
            fireEvent.click(activeFilter);
            expect(mockOnFilter).toHaveBeenCalled();
            logStep('Filtered by Active status');

            // Step 4: Add new user
            const addUserButton = screen.getByText('Add User');
            fireEvent.click(addUserButton);
            expect(mockOnUserCreate).toHaveBeenCalled();
            logStep('Clicked Add User button');

            // Step 5: Verify table data
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('jane@example.com')).toBeInTheDocument();
            expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
            logStep('Verified user data in table');

            // Step 6: Sort by name
            const nameHeader = screen.getByText('Name');
            fireEvent.click(nameHeader);
            logStep('Sorted table by name');

            // Step 7: Navigate to next page
            const nextPageButton = screen.getByLabelText(/next page/i);
            fireEvent.click(nextPageButton);
            logStep('Navigated to next page');

            expect(workflowLog).toHaveLength(7);
        });

        it('should complete user profile editing workflow', async () => {
            logStep('Starting user profile editing workflow');

            const mockOnSubmit = vi.fn();
            const mockOnCancel = vi.fn();

            render(
                <TestWrapper>
                    <Header>
                        <Navigation items={[
                            { label: 'Dashboard', href: '/dashboard' },
                            { label: 'Profile', href: '/profile' }
                        ]} />
                        <UserMenu
                            user={{ name: 'John Doe', email: 'john@example.com' }}
                            menuItems={[
                                { label: 'Profile', href: '/profile' },
                                { label: 'Settings', href: '/settings' }
                            ]}
                        />
                    </Header>

                    <Dashboard>
                        <BreadcrumbNav items={[
                            { label: 'Home', href: '/' },
                            { label: 'Profile', href: '/profile' },
                            { label: 'Edit Profile', href: '/profile/edit' }
                        ]} />

                        <Form onSubmit={mockOnSubmit}>
                            <fieldset>
                                <legend>Personal Information</legend>
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" defaultValue="John" />

                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" defaultValue="Doe" />

                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" defaultValue="john@example.com" />

                                <label htmlFor="phone">Phone</label>
                                <input type="tel" id="phone" name="phone" defaultValue="+1-555-0123" />
                            </fieldset>

                            <fieldset>
                                <legend>Preferences</legend>
                                <label htmlFor="timezone">Timezone</label>
                                <select id="timezone" name="timezone" defaultValue="UTC">
                                    <option value="UTC">UTC</option>
                                    <option value="EST">Eastern Time</option>
                                    <option value="PST">Pacific Time</option>
                                </select>

                                <label htmlFor="language">Language</label>
                                <select id="language" name="language" defaultValue="en">
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                </select>
                            </fieldset>

                            <div>
                                <button type="submit">Save Changes</button>
                                <button type="button" onClick={mockOnCancel}>Cancel</button>
                            </div>
                        </Form>
                    </Dashboard>

                    <StatusBar
                        status="editing"
                        message="Editing profile information"
                    />
                </TestWrapper>
            );

            logStep('Rendered profile editing form');

            // Step 1: Update first name
            const firstNameInput = screen.getByLabelText('First Name');
            fireEvent.change(firstNameInput, { target: { value: 'Jonathan' } });
            logStep('Updated first name to Jonathan');

            // Step 2: Update phone number
            const phoneInput = screen.getByLabelText('Phone');
            fireEvent.change(phoneInput, { target: { value: '+1-555-9999' } });
            logStep('Updated phone number');

            // Step 3: Change timezone
            const timezoneSelect = screen.getByLabelText('Timezone');
            fireEvent.change(timezoneSelect, { target: { value: 'EST' } });
            logStep('Changed timezone to EST');

            // Step 4: Submit form
            const saveButton = screen.getByText('Save Changes');
            fireEvent.click(saveButton);
            expect(mockOnSubmit).toHaveBeenCalled();
            logStep('Submitted profile changes');

            expect(workflowLog).toHaveLength(5);
        });
    });

    describe('2. Product Management Workflow', () => {
        it('should complete product catalog management workflow', async () => {
            logStep('Starting product catalog management workflow');

            const mockOnProductCreate = vi.fn();
            const mockOnProductUpdate = vi.fn();
            const mockOnProductDelete = vi.fn();
            const mockOnSearch = vi.fn();
            const mockOnFilter = vi.fn();

            render(
                <TestWrapper>
                    <Header>
                        <Navigation items={[
                            { label: 'Dashboard', href: '/dashboard' },
                            { label: 'Products', href: '/products' },
                            { label: 'Categories', href: '/categories' }
                        ]} />
                        <UserMenu
                            user={{ name: 'Product Manager', email: 'pm@example.com' }}
                            menuItems={[
                                { label: 'Profile', href: '/profile' },
                                { label: 'Settings', href: '/settings' }
                            ]}
                        />
                    </Header>

                    <Dashboard>
                        <BreadcrumbNav items={[
                            { label: 'Home', href: '/' },
                            { label: 'Products', href: '/products' },
                            { label: 'Catalog', href: '/products/catalog' }
                        ]} />

                        <ActionBar
                            actions={[
                                { label: 'Add Product', onClick: mockOnProductCreate },
                                { label: 'Bulk Edit', onClick: vi.fn() },
                                { label: 'Export Catalog', onClick: vi.fn() },
                                { label: 'Import Products', onClick: vi.fn() }
                            ]}
                        />

                        <SearchBar
                            onSearch={mockOnSearch}
                            placeholder="Search products by name, category, or SKU..."
                        />

                        <FilterPanel
                            filters={[
                                { key: 'category', label: 'Category', options: ['All', 'Electronics', 'Clothing', 'Books'] },
                                { key: 'stock', label: 'Stock Status', options: ['All', 'In Stock', 'Out of Stock', 'Low Stock'] },
                                { key: 'price', label: 'Price Range', options: ['All', 'Under $50', '$50-$100', 'Over $100'] }
                            ]}
                            onFilter={mockOnFilter}
                        />

                        <DataTable
                            data={mockProducts}
                            columns={[
                                { key: 'name', label: 'Product Name', sortable: true },
                                { key: 'category', label: 'Category', sortable: true },
                                { key: 'price', label: 'Price', sortable: true },
                                { key: 'stock', label: 'Stock', sortable: true }
                            ]}
                        />

                        <PaginationControls
                            currentPage={1}
                            totalPages={3}
                            onPageChange={vi.fn()}
                        />
                    </Dashboard>

                    <StatusBar
                        status="ready"
                        message="Product catalog loaded successfully"
                    />
                </TestWrapper>
            );

            logStep('Rendered product catalog interface');

            // Step 1: Search for electronics
            const searchInput = screen.getByPlaceholderText('Search products by name, category, or SKU...');
            fireEvent.change(searchInput, { target: { value: 'Electronics' } });
            expect(mockOnSearch).toHaveBeenCalledWith('Electronics');
            logStep('Searched for Electronics category');

            // Step 2: Filter by category
            const categoryFilter = screen.getByText('Category');
            fireEvent.click(categoryFilter);
            const electronicsFilter = screen.getByText('Electronics');
            fireEvent.click(electronicsFilter);
            expect(mockOnFilter).toHaveBeenCalled();
            logStep('Filtered by Electronics category');

            // Step 3: Add new product
            const addProductButton = screen.getByText('Add Product');
            fireEvent.click(addProductButton);
            expect(mockOnProductCreate).toHaveBeenCalled();
            logStep('Clicked Add Product button');

            // Step 4: Sort by price
            const priceHeader = screen.getByText('Price');
            fireEvent.click(priceHeader);
            logStep('Sorted by price');

            // Step 5: Check stock status
            expect(screen.getByText('Product C')).toBeInTheDocument();
            expect(screen.getByText('0')).toBeInTheDocument(); // Out of stock
            logStep('Verified out-of-stock product');

            expect(workflowLog).toHaveLength(5);
        });
    });

    describe('3. Multi-Step Form Workflow', () => {
        it('should complete complex multi-step form workflow', async () => {
            logStep('Starting multi-step form workflow');

            const mockOnComplete = vi.fn();
            const mockOnStepChange = vi.fn();

            render(
                <TestWrapper>
                    <Header>
                        <Navigation items={[
                            { label: 'Dashboard', href: '/dashboard' },
                            { label: 'Forms', href: '/forms' }
                        ]} />
                    </Header>

                    <Dashboard>
                        <BreadcrumbNav items={[
                            { label: 'Home', href: '/' },
                            { label: 'Forms', href: '/forms' },
                            { label: 'New Application', href: '/forms/new' }
                        ]} />

                        <Wizard
                            steps={[
                                {
                                    title: 'Personal Information',
                                    content: (
                                        <Form onSubmit={vi.fn()}>
                                            <fieldset>
                                                <legend>Personal Details</legend>
                                                <label htmlFor="fullName">Full Name</label>
                                                <input type="text" id="fullName" name="fullName" required />

                                                <label htmlFor="email">Email Address</label>
                                                <input type="email" id="email" name="email" required />

                                                <label htmlFor="phone">Phone Number</label>
                                                <input type="tel" id="phone" name="phone" required />

                                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                                <input type="date" id="dateOfBirth" name="dateOfBirth" required />
                                            </fieldset>
                                        </Form>
                                    )
                                },
                                {
                                    title: 'Address Information',
                                    content: (
                                        <Form onSubmit={vi.fn()}>
                                            <fieldset>
                                                <legend>Address Details</legend>
                                                <label htmlFor="street">Street Address</label>
                                                <input type="text" id="street" name="street" required />

                                                <label htmlFor="city">City</label>
                                                <input type="text" id="city" name="city" required />

                                                <label htmlFor="state">State/Province</label>
                                                <input type="text" id="state" name="state" required />

                                                <label htmlFor="zipCode">ZIP/Postal Code</label>
                                                <input type="text" id="zipCode" name="zipCode" required />

                                                <label htmlFor="country">Country</label>
                                                <select id="country" name="country" required>
                                                    <option value="">Select Country</option>
                                                    <option value="US">United States</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="UK">United Kingdom</option>
                                                </select>
                                            </fieldset>
                                        </Form>
                                    )
                                },
                                {
                                    title: 'Professional Information',
                                    content: (
                                        <Form onSubmit={vi.fn()}>
                                            <fieldset>
                                                <legend>Professional Details</legend>
                                                <label htmlFor="company">Company Name</label>
                                                <input type="text" id="company" name="company" />

                                                <label htmlFor="jobTitle">Job Title</label>
                                                <input type="text" id="jobTitle" name="jobTitle" />

                                                <label htmlFor="industry">Industry</label>
                                                <select id="industry" name="industry">
                                                    <option value="">Select Industry</option>
                                                    <option value="tech">Technology</option>
                                                    <option value="finance">Finance</option>
                                                    <option value="healthcare">Healthcare</option>
                                                    <option value="education">Education</option>
                                                </select>

                                                <label htmlFor="experience">Years of Experience</label>
                                                <input type="number" id="experience" name="experience" min="0" max="50" />
                                            </fieldset>
                                        </Form>
                                    )
                                },
                                {
                                    title: 'Review & Submit',
                                    content: (
                                        <div>
                                            <h3>Review Your Information</h3>
                                            <p>Please review all the information you've provided before submitting.</p>
                                            <div>
                                                <strong>Personal Information:</strong>
                                                <p>Name: <span id="review-name">John Doe</span></p>
                                                <p>Email: <span id="review-email">john@example.com</span></p>
                                            </div>
                                            <div>
                                                <strong>Address:</strong>
                                                <p>123 Main St, Anytown, ST 12345, USA</p>
                                            </div>
                                            <div>
                                                <strong>Professional:</strong>
                                                <p>Software Engineer at Tech Corp</p>
                                            </div>
                                        </div>
                                    )
                                }
                            ]}
                            onComplete={mockOnComplete}
                            onStepChange={mockOnStepChange}
                        />

                        <StatusBar
                            status="form-filling"
                            message="Step 1 of 4: Personal Information"
                        />
                    </Dashboard>
                </TestWrapper>
            );

            logStep('Rendered multi-step form');

            // Step 1: Fill personal information
            const fullNameInput = screen.getByLabelText('Full Name');
            fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

            const emailInput = screen.getByLabelText('Email Address');
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

            const phoneInput = screen.getByLabelText('Phone Number');
            fireEvent.change(phoneInput, { target: { value: '+1-555-0123' } });

            const dobInput = screen.getByLabelText('Date of Birth');
            fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
            logStep('Filled personal information');

            // Step 2: Navigate to next step
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
            expect(mockOnStepChange).toHaveBeenCalled();
            logStep('Navigated to address step');

            // Step 3: Fill address information
            const streetInput = screen.getByLabelText('Street Address');
            fireEvent.change(streetInput, { target: { value: '123 Main Street' } });

            const cityInput = screen.getByLabelText('City');
            fireEvent.change(cityInput, { target: { value: 'Anytown' } });

            const stateInput = screen.getByLabelText('State/Province');
            fireEvent.change(stateInput, { target: { value: 'CA' } });

            const zipInput = screen.getByLabelText('ZIP/Postal Code');
            fireEvent.change(zipInput, { target: { value: '12345' } });

            const countrySelect = screen.getByLabelText('Country');
            fireEvent.change(countrySelect, { target: { value: 'US' } });
            logStep('Filled address information');

            // Step 4: Navigate to next step
            fireEvent.click(nextButton);
            logStep('Navigated to professional step');

            // Step 5: Fill professional information
            const companyInput = screen.getByLabelText('Company Name');
            fireEvent.change(companyInput, { target: { value: 'Tech Corp' } });

            const jobTitleInput = screen.getByLabelText('Job Title');
            fireEvent.change(jobTitleInput, { target: { value: 'Software Engineer' } });

            const industrySelect = screen.getByLabelText('Industry');
            fireEvent.change(industrySelect, { target: { value: 'tech' } });

            const experienceInput = screen.getByLabelText('Years of Experience');
            fireEvent.change(experienceInput, { target: { value: '5' } });
            logStep('Filled professional information');

            // Step 6: Navigate to review step
            fireEvent.click(nextButton);
            logStep('Navigated to review step');

            // Step 7: Submit form
            const submitButton = screen.getByText('Submit');
            fireEvent.click(submitButton);
            expect(mockOnComplete).toHaveBeenCalled();
            logStep('Submitted form');

            expect(workflowLog).toHaveLength(7);
        });
    });

    describe('4. Notification Management Workflow', () => {
        it('should complete notification management workflow', async () => {
            logStep('Starting notification management workflow');

            const mockNotifications = [
                { id: 1, title: 'System Update', message: 'System will be updated at 2 AM', type: 'info', timestamp: '2024-01-15T10:00:00Z' },
                { id: 2, title: 'Security Alert', message: 'New login detected from unknown device', type: 'warning', timestamp: '2024-01-15T09:30:00Z' },
                { id: 3, title: 'Task Completed', message: 'Data export completed successfully', type: 'success', timestamp: '2024-01-15T09:00:00Z' },
                { id: 4, title: 'Error Occurred', message: 'Failed to connect to database', type: 'error', timestamp: '2024-01-15T08:45:00Z' },
            ];

            const mockOnDismiss = vi.fn();
            const mockOnAction = vi.fn();

            render(
                <TestWrapper>
                    <Header>
                        <Navigation items={[
                            { label: 'Dashboard', href: '/dashboard' },
                            { label: 'Notifications', href: '/notifications' }
                        ]} />
                        <UserMenu
                            user={{ name: 'User', email: 'user@example.com' }}
                            menuItems={[
                                { label: 'Profile', href: '/profile' },
                                { label: 'Settings', href: '/settings' }
                            ]}
                        />
                    </Header>

                    <Dashboard>
                        <BreadcrumbNav items={[
                            { label: 'Home', href: '/' },
                            { label: 'Notifications', href: '/notifications' }
                        ]} />

                        <ActionBar
                            actions={[
                                { label: 'Mark All Read', onClick: vi.fn() },
                                { label: 'Clear All', onClick: vi.fn() },
                                { label: 'Settings', onClick: vi.fn() }
                            ]}
                        />

                        <NotificationCenter
                            notifications={mockNotifications}
                            onDismiss={mockOnDismiss}
                            onAction={mockOnAction}
                        />

                        <StatusBar
                            status="notifications"
                            message={`You have ${mockNotifications.length} notifications`}
                        />
                    </Dashboard>
                </TestWrapper>
            );

            logStep('Rendered notification center');

            // Step 1: Check notification count
            expect(screen.getByText('System Update')).toBeInTheDocument();
            expect(screen.getByText('Security Alert')).toBeInTheDocument();
            expect(screen.getByText('Task Completed')).toBeInTheDocument();
            expect(screen.getByText('Error Occurred')).toBeInTheDocument();
            logStep('Verified all notifications are displayed');

            // Step 2: Dismiss a notification
            const dismissButtons = screen.getAllByLabelText(/dismiss/i);
            fireEvent.click(dismissButtons[0]);
            expect(mockOnDismiss).toHaveBeenCalledWith(1);
            logStep('Dismissed first notification');

            // Step 3: Take action on security alert
            const securityAlert = screen.getByText('Security Alert');
            const actionButton = within(securityAlert.closest('[role="alert"]')!).getByText('Review');
            fireEvent.click(actionButton);
            expect(mockOnAction).toHaveBeenCalledWith(2, 'review');
            logStep('Took action on security alert');

            // Step 4: Mark all as read
            const markAllReadButton = screen.getByText('Mark All Read');
            fireEvent.click(markAllReadButton);
            logStep('Marked all notifications as read');

            // Step 5: Check notification types
            const errorNotification = screen.getByText('Error Occurred');
            expect(errorNotification.closest('[role="alert"]')).toHaveClass('error');

            const successNotification = screen.getByText('Task Completed');
            expect(successNotification.closest('[role="alert"]')).toHaveClass('success');
            logStep('Verified notification type styling');

            expect(workflowLog).toHaveLength(5);
        });
    });

    describe('5. Dashboard Analytics Workflow', () => {
        it('should complete dashboard analytics workflow', async () => {
            logStep('Starting dashboard analytics workflow');

            const mockOnDateRangeChange = vi.fn();
            const mockOnMetricSelect = vi.fn();
            const mockOnExport = vi.fn();

            render(
                <TestWrapper>
                    <Header>
                        <Navigation items={[
                            { label: 'Dashboard', href: '/dashboard' },
                            { label: 'Analytics', href: '/analytics' },
                            { label: 'Reports', href: '/reports' }
                        ]} />
                        <UserMenu
                            user={{ name: 'Analyst', email: 'analyst@example.com' }}
                            menuItems={[
                                { label: 'Profile', href: '/profile' },
                                { label: 'Settings', href: '/settings' }
                            ]}
                        />
                    </Header>

                    <Dashboard>
                        <BreadcrumbNav items={[
                            { label: 'Home', href: '/' },
                            { label: 'Analytics', href: '/analytics' },
                            { label: 'Dashboard', href: '/analytics/dashboard' }
                        ]} />

                        <ActionBar
                            actions={[
                                { label: 'Export Report', onClick: mockOnExport },
                                { label: 'Schedule Report', onClick: vi.fn() },
                                { label: 'Share Dashboard', onClick: vi.fn() }
                            ]}
                        />

                        <SearchBar
                            onSearch={vi.fn()}
                            placeholder="Search metrics, KPIs, or reports..."
                        />

                        <FilterPanel
                            filters={[
                                { key: 'dateRange', label: 'Date Range', options: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom'] },
                                { key: 'metric', label: 'Metrics', options: ['Revenue', 'Users', 'Orders', 'Conversion Rate'] },
                                { key: 'segment', label: 'Segment', options: ['All', 'New Users', 'Returning Users', 'Premium Users'] }
                            ]}
                            onFilter={mockOnMetricSelect}
                        />

                        <DataTable
                            data={[
                                { metric: 'Total Revenue', value: '$125,000', change: '+12.5%', trend: 'up' },
                                { metric: 'Active Users', value: '2,450', change: '+8.2%', trend: 'up' },
                                { metric: 'Conversion Rate', value: '3.2%', change: '-0.5%', trend: 'down' },
                                { metric: 'Average Order Value', value: '$89.50', change: '+15.3%', trend: 'up' }
                            ]}
                            columns={[
                                { key: 'metric', label: 'Metric' },
                                { key: 'value', label: 'Current Value' },
                                { key: 'change', label: 'Change' },
                                { key: 'trend', label: 'Trend' }
                            ]}
                        />

                        <PaginationControls
                            currentPage={1}
                            totalPages={1}
                            onPageChange={vi.fn()}
                        />

                        <StatusBar
                            status="analytics"
                            message="Analytics dashboard updated successfully"
                        />
                    </Dashboard>
                </TestWrapper>
            );

            logStep('Rendered analytics dashboard');

            // Step 1: Search for specific metrics
            const searchInput = screen.getByPlaceholderText('Search metrics, KPIs, or reports...');
            fireEvent.change(searchInput, { target: { value: 'Revenue' } });
            logStep('Searched for Revenue metrics');

            // Step 2: Filter by date range
            const dateRangeFilter = screen.getByText('Date Range');
            fireEvent.click(dateRangeFilter);
            const last30Days = screen.getByText('Last 30 days');
            fireEvent.click(last30Days);
            expect(mockOnMetricSelect).toHaveBeenCalled();
            logStep('Filtered by Last 30 days');

            // Step 3: Filter by metric type
            const metricFilter = screen.getByText('Metrics');
            fireEvent.click(metricFilter);
            const revenueMetric = screen.getByText('Revenue');
            fireEvent.click(revenueMetric);
            logStep('Filtered by Revenue metric');

            // Step 4: Export report
            const exportButton = screen.getByText('Export Report');
            fireEvent.click(exportButton);
            expect(mockOnExport).toHaveBeenCalled();
            logStep('Exported analytics report');

            // Step 5: Verify metrics display
            expect(screen.getByText('Total Revenue')).toBeInTheDocument();
            expect(screen.getByText('$125,000')).toBeInTheDocument();
            expect(screen.getByText('+12.5%')).toBeInTheDocument();
            logStep('Verified metrics are displayed correctly');

            expect(workflowLog).toHaveLength(5);
        });
    });
});
