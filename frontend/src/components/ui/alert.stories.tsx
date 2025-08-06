import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertTriangle, CheckCircle, Info, XCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Alert Component

The Alert component provides contextual feedback messages with semantic styling. Built on design tokens for consistent theming across the FinVision platform.

## Key Features

- **Semantic Variants**: Success, warning, error, info, and default states
- **Accessibility**: Proper ARIA roles and attributes
- **Icon Integration**: Built-in support for status icons
- **Design System Integration**: Uses semantic colors from design tokens
- **Responsive**: Adapts to container width

## Usage in FinVision

- **Authentication**: Login/logout status messages
- **Data Processing**: Import/export status updates
- **Model Validation**: Parameter validation feedback
- **System Notifications**: General system status messages
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
      description: 'Visual style variant',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert with neutral styling.
      </AlertDescription>
    </Alert>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with neutral styling.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your operation completed successfully.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please review the following before proceeding.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while processing your request.
        </AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Here's some helpful information for you.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available alert variants with their semantic styling.',
      },
    },
  },
};

export const WithoutTitle: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Model calculations completed successfully.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Some parameters may need adjustment for optimal results.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Connection to the data source failed. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alerts without titles for simpler messaging.',
      },
    },
  },
};

export const AuthenticationExamples: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Login Successful</AlertTitle>
        <AlertDescription>
          Welcome back! You have been successfully logged in.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Login Failed</AlertTitle>
        <AlertDescription>
          Invalid email or password. Please check your credentials and try again.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Session Expiring</AlertTitle>
        <AlertDescription>
          Your session will expire in 5 minutes. Please save your work.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert examples from authentication flows.',
      },
    },
  },
};

export const DataProcessingExamples: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Data Import In Progress</AlertTitle>
        <AlertDescription>
          Processing 1,247 financial records. This may take a few minutes.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Export Complete</AlertTitle>
        <AlertDescription>
          Your financial report has been exported successfully. Check your downloads folder.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Data Quality Issues</AlertTitle>
        <AlertDescription>
          23 records contain missing or invalid data. Review before proceeding.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Import Failed</AlertTitle>
        <AlertDescription>
          Unable to process the uploaded file. Please check the format and try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert examples from data import/export processes.',
      },
    },
  },
};

export const ModelValidationExamples: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert variant="success">
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Model Validation Passed</AlertTitle>
        <AlertDescription>
          All parameters are within acceptable ranges. Model is ready for analysis.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Parameter Warning</AlertTitle>
        <AlertDescription>
          Growth rate of 45% seems unusually high. Please verify this assumption.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Validation Error</AlertTitle>
        <AlertDescription>
          Discount rate cannot be higher than growth rate. Please adjust parameters.
        </AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <DollarSign className="h-4 w-4" />
        <AlertTitle>Calculation Note</AlertTitle>
        <AlertDescription>
          Using industry average EBITDA margin of 15% for missing data points.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert examples from financial model validation.',
      },
    },
  },
};

export const InteractiveAlerts: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Unsaved Changes</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>You have unsaved changes in your financial model.</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Save Changes
            </Button>
            <Button size="sm" variant="ghost">
              Discard
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>New Feature Available</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>Try our new Monte Carlo simulation feature for risk analysis.</span>
          <Button size="sm" variant="outline">
            Learn More
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alerts with interactive elements like buttons.',
      },
    },
  },
};

export const InContextUsage: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Financial Model Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="info">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Enter your financial assumptions below. All values should be in USD.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Revenue Growth Rate (%)</label>
          <input className="w-full px-3 py-2 border rounded-md" placeholder="15.0" />
        </div>
        
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Growth rates above 30% should be carefully justified.
          </AlertDescription>
        </Alert>
        
        <Button className="w-full">Calculate Model</Button>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert used in context within a form interface.',
      },
    },
  },
};

export const CompactVariant: Story = {
  render: () => (
    <div className="space-y-2 w-96">
      <Alert className="py-2">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Data saved successfully
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning" className="py-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Connection unstable
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive" className="py-2">
        <XCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Processing failed
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact alerts for toast-like notifications.',
      },
    },
  },
};