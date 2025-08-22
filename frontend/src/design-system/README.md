# Atomic Design System

A comprehensive, production-ready design system built using Atomic Design methodology. This system provides a complete set of reusable components organized into Atoms, Molecules, Organisms, Templates, and Pages.

## 🏗️ Architecture

The design system follows the Atomic Design methodology with five distinct levels:

```
design-system/
├── atoms/          # Basic building blocks (Button, Input, Icon, etc.)
├── molecules/      # Simple combinations of atoms (FormField, Select, etc.)
├── organisms/      # Complex UI sections (Header, Footer, DataTable, etc.)
├── templates/      # Page layouts (DashboardLayout, FormLayout, etc.)
├── pages/          # Complete pages (Dashboard, UserProfile, etc.)
├── tokens/         # Design tokens (colors, spacing, typography, etc.)
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
└── providers/      # Context providers
```

## 🚀 Quick Start

### Installation

```bash
npm install @your-org/design-system
```

### Basic Usage

```tsx
import { Button, Input, Card, DashboardLayout } from '@your-org/design-system';

function App() {
  return (
    <DashboardLayout title="My App" subtitle="Welcome to the application">
      <Card>
        <Input placeholder="Enter your name" />
        <Button variant="primary">Submit</Button>
      </Card>
    </DashboardLayout>
  );
}
```

## 📚 Component Library

### Atoms (Basic Building Blocks)

The foundation of the design system - the smallest, most basic components.

```tsx
import { Button, Input, Icon, Label, Badge, Text } from '@your-org/design-system';

// Button with variants
<Button variant="primary" size="md">Click me</Button>
<Button variant="outline" size="sm">Secondary</Button>

// Input with states
<Input placeholder="Enter text" />
<Input variant="error" error="This field is required" />

// Icon with sizes
<Icon name="user" size="sm" />
<Icon name="settings" size="lg" />

// Label with required state
<Label required>Email Address</Label>

// Badge with variants
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>

// Text with typography variants
<Text variant="h1">Heading 1</Text>
<Text variant="body" size="lg">Large body text</Text>
```

### Molecules (Simple Combinations)

Components that combine atoms to create more complex, reusable pieces.

```tsx
import { FormField, SearchInput, Select, Accordion, Tooltip, Calendar, DatePicker, InputOTP } from '@your-org/design-system';

// FormField combines Label + Input + validation
<FormField
  label="Email"
  required
  error="Invalid email address"
>
  <Input type="email" placeholder="Enter email" />
</FormField>

// SearchInput with search functionality
<SearchInput
  placeholder="Search..."
  onSearch={(query) => console.log(query)}
/>

// Select with options
<Select
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  placeholder="Choose an option"
/>

// Accordion with collapsible content
<Accordion>
  <Accordion.Item title="Section 1">
    <p>Content for section 1</p>
  </Accordion.Item>
  <Accordion.Item title="Section 2">
    <p>Content for section 2</p>
  </Accordion.Item>
</Accordion>

// Tooltip with positioning
<Tooltip content="Helpful information" position="top">
  <Button>Hover me</Button>
</Tooltip>

// Calendar with date selection
<Calendar
  mode="single"
  onSelect={(date) => console.log(date)}
/>

// DatePicker with input field
<DatePicker
  placeholder="Select date"
  onSelect={(date) => console.log(date)}
/>

// InputOTP for verification codes
<InputOTP
  length={6}
  onComplete={(code) => console.log(code)}
/>
```

### Organisms (Complex UI Sections)

Large, complex components that combine molecules and atoms.

```tsx
import {
  Header,
  Footer,
  SearchBar,
  DataTable,
  Form,
  Wizard,
  Dashboard,
  FilterPanel,
  ActionBar,
  StatusBar,
  NotificationCenter,
  UserMenu,
  BreadcrumbNav,
  PaginationControls
} from '@your-org/design-system';

// Header with navigation and user menu
<Header
  logo="logo.svg"
  logoText="My App"
  navigationItems={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Users', href: '/users' }
  ]}
  user={userData}
/>

// DataTable with sorting and pagination
<DataTable
  data={tableData}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status' }
  ]}
  selectable
  onSort={(key, direction) => console.log(key, direction)}
/>

// Form with dynamic fields
<Form
  fields={[
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', options: roleOptions }
  ]}
  onSubmit={(data) => console.log(data)}
/>

// Wizard with multi-step flow
<Wizard
  steps={[
    { title: 'Step 1', content: <Step1Content /> },
    { title: 'Step 2', content: <Step2Content /> },
    { title: 'Step 3', content: <Step3Content /> }
  ]}
  onComplete={(data) => console.log(data)}
/>

// SearchBar with filters
<SearchBar
  placeholder="Search..."
  filters={[
    { id: 'status', label: 'Status', type: 'select', options: statusOptions },
    { id: 'date', label: 'Date', type: 'date-range' }
  ]}
  onSearch={(query) => console.log(query)}
  onFilterChange={(filters) => console.log(filters)}
/>

// NotificationCenter with notifications
<NotificationCenter
  notifications={[
    { id: '1', title: 'Success', message: 'Operation completed', type: 'success' },
    { id: '2', title: 'Warning', message: 'Please review', type: 'warning' }
  ]}
  onNotificationClick={(notification) => console.log(notification)}
/>

// PaginationControls with navigation
<PaginationControls
  currentPage={1}
  totalPages={10}
  totalItems={100}
  onPageChange={(page) => console.log(page)}
/>
```

### Templates (Page Layouts)

Complete page layouts that combine organisms and molecules.

```tsx
import {
  DashboardLayout,
  FormLayout,
  ListLayout,
  DetailLayout,
  AuthLayout,
  AdminLayout,
  ReportLayout
} from '@your-org/design-system';

// DashboardLayout for dashboard pages
<DashboardLayout
  title="Dashboard"
  subtitle="Overview of your application"
  navigationItems={navigationItems}
  user={userData}
  notifications={notifications}
  statusItems={statusItems}
  actions={actions}
  breadcrumbItems={breadcrumbItems}
>
  {/* Dashboard content */}
</DashboardLayout>

// FormLayout for form pages
<FormLayout
  title="Create User"
  subtitle="Add a new user to the system"
  breadcrumbItems={breadcrumbItems}
  actions={actions}
>
  <Form fields={formFields} onSubmit={handleSubmit} />
</FormLayout>

// ListLayout for list pages
<ListLayout
  title="Users"
  subtitle="Manage system users"
  breadcrumbItems={breadcrumbItems}
  actions={actions}
>
  <DataTable data={users} columns={columns} />
</ListLayout>

// DetailLayout for detail pages
<DetailLayout
  title="User Profile"
  subtitle="View and edit user information"
  breadcrumbItems={breadcrumbItems}
  actions={actions}
>
  {/* User profile content */}
</DetailLayout>

// AuthLayout for authentication pages
<AuthLayout
  title="Sign In"
  subtitle="Welcome back! Please sign in to your account"
  logo="logo.svg"
  logoText="My App"
>
  <Form fields={loginFields} onSubmit={handleLogin} />
</AuthLayout>

// AdminLayout for admin interfaces
<AdminLayout
  title="Admin Dashboard"
  navigationItems={adminNavigation}
  user={adminUser}
  notifications={adminNotifications}
  statusItems={statusItems}
  actions={adminActions}
>
  {/* Admin content */}
</AdminLayout>

// ReportLayout for reports and analytics
<ReportLayout
  title="Sales Report"
  subtitle="Monthly sales performance"
  breadcrumbItems={breadcrumbItems}
  filterItems={filterItems}
  actions={reportActions}
  pagination={paginationData}
>
  {/* Report content */}
</ReportLayout>
```

### Pages (Complete Pages)

Fully functional pages that demonstrate the complete system.

```tsx
import { Dashboard, UserProfile } from '@your-org/design-system';

// Complete Dashboard page
<Dashboard
  title="Dashboard"
  subtitle="Overview of your application"
/>

// Complete User Profile page
<UserProfile
  userId="123"
  title="User Profile"
  subtitle="Manage user information and settings"
/>
```

## 🎨 Design Tokens

The design system uses a comprehensive token system for consistent theming:

```tsx
import { getToken } from '@your-org/design-system/tokens';

// Colors
getToken('colors.primary'); // Primary brand color
getToken('colors.primary.foreground'); // Primary text color
getToken('colors.muted'); // Muted background color
getToken('colors.muted.foreground'); // Muted text color

// Spacing
getToken('spacing.1'); // 4px
getToken('spacing.2'); // 8px
getToken('spacing.4'); // 16px
getToken('spacing.8'); // 32px

// Typography
getToken('typography.fontSize.sm'); // Small font size
getToken('typography.fontSize.base'); // Base font size
getToken('typography.fontSize.lg'); // Large font size

// Border radius
getToken('borderRadius.sm'); // Small border radius
getToken('borderRadius.md'); // Medium border radius
getToken('borderRadius.lg'); // Large border radius

// Shadows
getToken('shadows.sm'); // Small shadow
getToken('shadows.md'); // Medium shadow
getToken('shadows.lg'); // Large shadow
```

## 🔧 Customization

### Theme Customization

```tsx
import { ThemeProvider } from '@your-org/design-system/providers';

const customTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    // ... other colors
  },
  spacing: {
    1: '4px',
    2: '8px',
    // ... other spacing values
  },
};

<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>;
```

### Component Variants

Most components support multiple variants:

```tsx
// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Size variants
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## ♿ Accessibility

All components are built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## 📱 Responsive Design

Components are responsive by default and work across all device sizes:

```tsx
// Responsive grid layout
<DashboardLayout>
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: getToken('spacing.4'),
    }}
  >
    <Card>Content 1</Card>
    <Card>Content 2</Card>
    <Card>Content 3</Card>
  </div>
</DashboardLayout>
```

## 🧪 Testing

The design system includes comprehensive testing:

```bash
# Run unit tests
npm test

# Run visual regression tests
npm run test:visual

# Run accessibility tests
npm run test:a11y

# Run performance tests
npm run test:performance
```

## 📖 Storybook

View all components in Storybook:

```bash
npm run storybook
```

Visit `http://localhost:6006` to explore:

- Component documentation
- Interactive examples
- Design tokens
- Accessibility guidelines
- Usage patterns

## 🤝 Contributing

### Adding New Components

1. Create the component in the appropriate atomic level
2. Add TypeScript types
3. Create Storybook stories
4. Add unit tests
5. Update documentation

### Component Structure

```
atoms/Button/
├── Button.tsx           # Main component
├── Button.types.ts      # TypeScript types
├── Button.variants.ts   # Styling variants
├── Button.stories.tsx   # Storybook stories
└── index.ts            # Exports
```

### Development Guidelines

- Use design tokens for all styling
- Follow the established naming conventions
- Ensure accessibility compliance
- Write comprehensive tests
- Document with JSDoc comments
- Create Storybook stories

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For questions and support:

- 📧 Email: design-system@your-org.com
- 💬 Slack: #design-system
- 📖 Documentation: https://design-system.your-org.com
- 🐛 Issues: https://github.com/your-org/design-system/issues
