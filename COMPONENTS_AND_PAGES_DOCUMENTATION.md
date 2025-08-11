# Financial Modeling Application - Components & Pages Documentation

## Overview

This document provides a comprehensive overview of all components and pages in the Financial Modeling Application, including their Storybook stories and parameters. The application contains **158 story files** across multiple categories.

## Table of Contents

1. [Design System Components](#design-system-components)
2. [Core Application Components](#core-application-components)
3. [Page Components](#page-components)
4. [Component Categories](#component-categories)
5. [Story Parameters Reference](#story-parameters-reference)

---

## Design System Components

### Foundations
- **Foundations.Colors.stories.tsx** - Color palette and theming system
- **Foundations.Radius.stories.tsx** - Border radius design tokens
- **Foundations.Shadows.stories.tsx** - Shadow and elevation system
- **Foundations.Spacing.stories.tsx** - Spacing and layout tokens
- **Foundations.Tokens.stories.tsx** - Design token system overview
- **Foundations.Transitions.stories.tsx** - Animation and transition tokens
- **Foundations.Typography.stories.tsx** - Typography system
- **Foundations.ZIndex.stories.tsx** - Z-index layering system

### Basic UI Components
- **Alert.stories.tsx** - Alert and notification components
- **AlertDialog.stories.tsx** - Confirmation dialogs
- **AspectRatio.stories.tsx** - Aspect ratio container
- **Avatar.stories.tsx** - User avatar component
- **Badge.stories.tsx** - Status and label badges
- **Breadcrumb.stories.tsx** - Navigation breadcrumbs
- **Button.stories.tsx** - Button variants and states
- **Calendar.stories.tsx** - Date picker calendar
- **Card.stories.tsx** - Card container component
- **Carousel.stories.tsx** - Image/content carousel
- **Checkbox.stories.tsx** - Checkbox input component
- **Collapsible.stories.tsx** - Expandable content sections
- **Command.stories.tsx** - Command palette component
- **ContextMenu.stories.tsx** - Right-click context menus
- **DatePicker.stories.tsx** - Date selection component
- **Dialog.stories.tsx** - Modal dialog components
- **Drawer.stories.tsx** - Slide-out drawer panels
- **DropdownMenu.stories.tsx** - Dropdown menu components
- **Form.stories.tsx** - Form components and validation
- **HoverCard.stories.tsx** - Hover-triggered cards
- **ImageWithFallback.stories.tsx** - Image with error handling
- **Input.stories.tsx** - Text input components
- **InputOTP.stories.tsx** - One-time password input
- **Label.stories.tsx** - Form labels
- **Menubar.stories.tsx** - Application menu bar
- **NavigationMenu.stories.tsx** - Navigation menu system
- **Pagination.stories.tsx** - Page navigation
- **Popover.stories.tsx** - Popover components
- **Progress.stories.tsx** - Progress indicators
- **RadioGroup.stories.tsx** - Radio button groups
- **Resizable.stories.tsx** - Resizable panels
- **ScrollArea.stories.tsx** - Custom scroll areas
- **Select.stories.tsx** - Dropdown select components
- **Separator.stories.tsx** - Visual separators
- **Sheet.stories.tsx** - Slide-out sheets
- **Sidebar.stories.tsx** - Sidebar navigation
- **Sidebar.Advanced.stories.tsx** - Advanced sidebar features
- **Skeleton.stories.tsx** - Loading skeleton components
- **Slider.stories.tsx** - Range slider components
- **Sonner.stories.tsx** - Toast notifications
- **Switch.stories.tsx** - Toggle switch components
- **Table.stories.tsx** - Data table components
- **Tabs.stories.tsx** - Tab navigation
- **Textarea.stories.tsx** - Multi-line text input
- **Toast.stories.tsx** - Toast notification system
- **Toggle.stories.tsx** - Toggle button components
- **ToggleGroup.stories.tsx** - Toggle button groups
- **Tooltip.stories.tsx** - Tooltip components

### Design System Documentation
- **Accessibility.stories.tsx** - Accessibility guidelines and examples
- **AdvancedTheming.stories.tsx** - Advanced theming capabilities
- **ComponentTemplate.stories.tsx** - Story creation template
- **DesignTokens.stories.tsx** - Design token documentation
- **GettingStarted.stories.tsx** - Getting started guide
- **Overview.stories.tsx** - Design system overview
- **Overview.Journey.stories.tsx** - User journey documentation
- **Performance.stories.tsx** - Performance guidelines
- **Providers.stories.tsx** - Context providers documentation

### Token Documentation
- **Tokens.Badge.stories.tsx** - Badge design tokens
- **Tokens.Index.stories.tsx** - Token index and reference
- **Tokens.Select.stories.tsx** - Select component tokens
- **Tokens.Tabs.stories.tsx** - Tab component tokens
- **Tokens.Tooltip.stories.tsx** - Tooltip design tokens

### Chart Helpers
- **Charts.Helpers.stories.tsx** - Chart utility components

---

## Core Application Components

### Admin Components
- **AdminDashboard.stories.tsx** - Main admin dashboard
- **DashboardCustomization.stories.tsx** - Dashboard customization tools
- **DataManagement.stories.tsx** - Data management interface
- **LogFilterForm.stories.tsx** - Log filtering and search
- **MaintenanceTools.stories.tsx** - System maintenance utilities
- **OverviewSection.stories.tsx** - Admin overview section
- **SystemMonitoring.stories.tsx** - System monitoring dashboard
- **UserManagement.stories.tsx** - User management interface

### Admin Dashboard Components
- **HealthTab.stories.tsx** - System health monitoring
- **LogsTab.stories.tsx** - Application logs viewer
- **OverviewTab.stories.tsx** - Admin overview tab

### Authentication Components
- **AdminGuard.stories.tsx** - Admin route protection
- **AuthGuard.stories.tsx** - Authentication guard
- **BiometricLogin.stories.tsx** - Biometric authentication
- **EmailVerification.stories.tsx** - Email verification flow
- **ForgotPasswordForm.stories.tsx** - Password recovery form
- **FormStatusAlert.stories.tsx** - Form status notifications
- **ResetPasswordForm.stories.tsx** - Password reset form

### Balance Sheet Components
- **AssetsBreakdown.stories.tsx** - Asset analysis charts
- **BalanceSheetSummary.stories.tsx** - Balance sheet overview
- **EquityTrend.stories.tsx** - Equity trend analysis
- **FinancialRatios.stories.tsx** - Financial ratio calculations
- **LiabilitiesAnalysis.stories.tsx** - Liability analysis charts

### Chart Components
- **BarChart.stories.tsx** - Bar chart component
- **BaseChart.stories.tsx** - Base chart configuration
- **CurrencyBarChart.stories.tsx** - Currency-specific bar charts
- **CustomTooltip.stories.tsx** - Custom chart tooltips
- **FinancialCharts.stories.tsx** - Financial chart collection
- **LineChart.stories.tsx** - Line chart component
- **PieChart.stories.tsx** - Pie chart component
- **RealtimeChart.stories.tsx** - Real-time chart updates
- **RealtimeLineChart.stories.tsx** - Real-time line charts
- **Theming.stories.tsx** - Chart theming system
- **WaterfallChart.stories.tsx** - Waterfall chart component

### Core Financial Modeling
- **CoreFinancialModeling.stories.tsx** - Core modeling engine
- **DCFValuation.stories.tsx** - DCF valuation calculations

### Dashboard Components
- **DashboardGrid.stories.tsx** - Dashboard grid layout
- **ErrorBoundary.stories.tsx** - Error handling components
- **FinancialDashboard.stories.tsx** - Financial dashboard
- **LoadingStates.stories.tsx** - Loading state components
- **RealtimeMetrics.stories.tsx** - Real-time metric display

### File Upload Components
- **ExcelProcessingWorkflow.stories.tsx** - Excel file processing
- **FileList.stories.tsx** - File list management
- **FilePreview.stories.tsx** - File preview component
- **FileUploadDropzone.stories.tsx** - File upload interface
- **ProcessingProgress.stories.tsx** - Upload progress tracking
- **StatementSelector.stories.tsx** - Financial statement selection

### Financial Statements
- **BalanceSheetView.stories.tsx** - Balance sheet display
- **CashFlowView.stories.tsx** - Cash flow statement view
- **DCFView.stories.tsx** - DCF analysis view
- **ProfitLossView.stories.tsx** - P&L statement view

### Layout Components
- **PageHeader.stories.tsx** - Page header component

### Parameter Components
- **BulkParameterEdit.stories.tsx** - Bulk parameter editing
- **ImpactAnalysis.stories.tsx** - Parameter impact analysis
- **LoadingState.stories.tsx** - Parameter loading states
- **ParameterControl.stories.tsx** - Individual parameter controls
- **ParameterEditor.stories.tsx** - Parameter editing interface
- **ParameterExport.stories.tsx** - Parameter export functionality
- **ParameterGroup.stories.tsx** - Parameter grouping
- **ParameterHistory.stories.tsx** - Parameter change history
- **ParameterList.stories.tsx** - Parameter list display
- **ParameterManager.stories.tsx** - Parameter management
- **ParameterPanel.stories.tsx** - Parameter panel interface
- **ParameterSearch.stories.tsx** - Parameter search functionality
- **ParameterTemplates.stories.tsx** - Parameter templates

### Scenario Components
- **DistributionChart.stories.tsx** - Distribution analysis charts
- **MonteCarloRunner.stories.tsx** - Monte Carlo simulation
- **ScatterPlot.stories.tsx** - Scatter plot analysis
- **ScenarioComparison.stories.tsx** - Scenario comparison tools
- **ScenarioManager.stories.tsx** - Scenario management
- **SimulationResults.stories.tsx** - Simulation result display
- **TornadoChart.stories.tsx** - Tornado chart analysis

### Tab Components
- **BalanceTabEnhanced.stories.tsx** - Enhanced balance sheet tab
- **CashFlowTabEnhanced.stories.tsx** - Enhanced cash flow tab
- **DCFTab.stories.tsx** - DCF analysis tab
- **ParametersTab.stories.tsx** - Parameters management tab
- **SalesTab.stories.tsx** - Sales analysis tab

### UI Components
- **ConfirmDialog.stories.tsx** - Confirmation dialogs
- **LoadingSkeleton.stories.tsx** - Loading skeleton components

### Utility Components
- **ErrorBoundary.stories.tsx** - Error boundary wrapper
- **ProtectedRoute.stories.tsx** - Route protection component
- **theme-toggle.stories.tsx** - Theme switching component

---

## Page Components

### Authentication Pages
- **Login.stories.tsx** - User login page

---

## Component Categories

### By Functionality

#### Financial Analysis
- Balance Sheet components
- Cash Flow components
- DCF Valuation components
- Financial Ratios components
- P&L components

#### Data Management
- File Upload components
- Parameter Management components
- Data Export/Import components

#### User Interface
- Design System components
- Layout components
- Navigation components
- Form components

#### Administration
- Admin Dashboard components
- User Management components
- System Monitoring components

#### Visualization
- Chart components
- Dashboard components
- Real-time components

### By Complexity

#### Simple Components
- Basic UI elements (Button, Input, Label)
- Utility components (ErrorBoundary, LoadingSkeleton)
- Layout components (Card, Separator)

#### Medium Complexity
- Form components (ParameterControl, FileUpload)
- Navigation components (Tabs, Sidebar)
- Display components (Table, Chart)

#### Complex Components
- Dashboard components (FinancialDashboard, AdminDashboard)
- Analysis components (DCFValuation, MonteCarloRunner)
- Management components (ParameterManager, UserManagement)

---

## Story Parameters Reference

### Common Parameters

#### Meta Configuration
```typescript
const meta: Meta<typeof Component> = {
  title: 'Category/ComponentName',
  component: Component,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded' | 'fullscreen',
    docs: {
      description: {
        component: 'Component description',
      },
    },
  },
  argTypes: {
    // Component props with controls
  },
};
```

#### Layout Options
- `'padded'` - Component with padding for isolated viewing
- `'fullscreen'` - Full-screen layout for pages and complex components
- `'centered'` - Centered layout for focused components

#### Common ArgTypes
```typescript
argTypes: {
  // Boolean controls
  disabled: {
    control: { type: 'boolean' },
    description: 'Component disabled state',
  },
  
  // Select controls
  variant: {
    control: { type: 'select' },
    options: ['default', 'outlined', 'elevated'],
    description: 'Visual variant',
  },
  
  // Number controls
  value: {
    control: { type: 'number' },
    description: 'Numeric value',
  },
  
  // Text controls
  label: {
    control: { type: 'text' },
    description: 'Component label',
  },
  
  // Object controls
  data: {
    control: { type: 'object' },
    description: 'Data object',
  },
  
  // Action handlers
  onChange: {
    action: 'changed',
    description: 'Change event handler',
  },
}
```

### Story Variants

#### Standard Variants
- **Default** - Basic component state
- **Loading** - Loading/processing state
- **Empty** - No data state
- **Error** - Error state
- **Disabled** - Disabled state

#### Component-Specific Variants
- **Interactive** - With user interactions
- **Complex** - Advanced usage examples
- **Accessibility** - Accessibility features
- **Performance** - Performance considerations
- **Usage Guidelines** - Best practices

### Story Configuration
```typescript
export const StoryName: Story = {
  args: {
    // Component props
  },
  parameters: {
    docs: {
      description: {
        story: 'Story description',
      },
    },
    // Additional parameters
  },
};
```

---

## Usage Guidelines

### Creating New Stories
1. Use the `ComponentTemplate.stories.tsx` as a reference
2. Include comprehensive `argTypes` for all props
3. Provide multiple story variants (Default, Loading, Error, etc.)
4. Add proper documentation in the `docs.description` section
5. Use appropriate layout parameters

### Story Organization
- Design System: `Design System/Category/Component`
- Components: `Components/Category/Component`
- Pages: `Pages/PageName`

### Best Practices
1. **Descriptive Titles**: Use clear, descriptive story titles
2. **Comprehensive Props**: Document all component props with controls
3. **Multiple Variants**: Show different states and configurations
4. **Real Examples**: Provide realistic usage examples
5. **Accessibility**: Document accessibility features
6. **Performance**: Include performance considerations where relevant

### Documentation Standards
- Component purpose and usage
- Props documentation with types and defaults
- Variants and states explanation
- Accessibility considerations
- Performance guidelines
- Usage examples and best practices

---

## File Structure

```
frontend/src/
├── components/
│   ├── Admin/           # Admin interface components
│   ├── AdminDashboard/  # Admin dashboard components
│   ├── auth/           # Authentication components
│   ├── BalanceSheet/   # Balance sheet components
│   ├── Charts/         # Chart and visualization components
│   ├── CoreFinancialModeling/ # Core modeling components
│   ├── Dashboard/      # Dashboard components
│   ├── FileUpload/     # File upload components
│   ├── FinancialStatements/ # Financial statement components
│   ├── Layout/         # Layout components
│   ├── Parameters/     # Parameter management components
│   ├── Scenarios/      # Scenario analysis components
│   ├── tabs/           # Tab components
│   └── ui/             # Utility UI components
├── design-system/
│   ├── components/     # Design system components
│   └── stories/        # Design system documentation
└── pages/              # Page components
```

---

*This documentation covers 158 story files across the entire application, providing a comprehensive reference for all components and their configurations.*
