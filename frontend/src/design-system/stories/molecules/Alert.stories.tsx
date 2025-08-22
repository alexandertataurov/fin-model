import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '../../molecules/Alert/Alert';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle, Info as InfoIcon, XCircle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Alert> = {
  title: 'Molecules / Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: Alert"
            subtitle="A flexible alert component for displaying important messages with different variants and styles."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'success', 'warning', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================ // STORIES // ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Alert Variants"
        subtitle="Different alert configurations and message types."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Alert</h4>
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert with a title and description.
            </AlertDescription>
          </Alert>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Alert</h4>
          <Alert variant="success">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your changes have been saved successfully.
            </AlertDescription>
          </Alert>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Warning Alert</h4>
          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please review your input before proceeding.
            </AlertDescription>
          </Alert>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Error Alert</h4>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error processing your request.
            </AlertDescription>
          </Alert>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Info Alert</h4>
          <Alert variant="info">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Here's some helpful information about this feature.
            </AlertDescription>
          </Alert>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Title Only</h4>
          <Alert variant="success">
            <AlertTitle>Operation completed successfully</AlertTitle>
          </Alert>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: (
      <>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with a title and description.
        </AlertDescription>
      </>
    ),
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: (
      <>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </>
    ),
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: (
      <>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please review your input before proceeding.
        </AlertDescription>
      </>
    ),
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was an error processing your request. Please try again.
        </AlertDescription>
      </>
    ),
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: (
      <>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Here's some helpful information about this feature.
        </AlertDescription>
      </>
    ),
  },
};

export const TitleOnly: Story = {
  args: {
    variant: 'success',
    children: <AlertTitle>Operation completed successfully</AlertTitle>,
  },
};

export const DescriptionOnly: Story = {
  args: {
    variant: 'info',
    children: (
      <AlertDescription>
        This is an alert with only a description and no title.
      </AlertDescription>
    ),
  },
};

export const CustomIcon: Story = {
  args: {
    variant: 'default',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    children: (
      <>
        <AlertTitle>Custom Icon</AlertTitle>
        <AlertDescription>
          This alert uses a custom icon instead of the default variant icon.
        </AlertDescription>
      </>
    ),
  },
};

export const LongContent: Story = {
  args: {
    variant: 'warning',
    children: (
      <>
        <AlertTitle>
          This is a very long alert title that might wrap to multiple lines
        </AlertTitle>
        <AlertDescription>
          <p>
            This is a detailed description that contains multiple paragraphs.
          </p>
          <p>
            It demonstrates how the alert handles longer content gracefully.
          </p>
          <p>The alert should maintain proper spacing and readability.</p>
        </AlertDescription>
      </>
    ),
  },
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <GuidelinesSection title="Usage Guidelines">
        <GuidelinesCard
          title="Do"
          variant="success"
          icon={<Check />}
          items={[
            'Use alerts for <strong>important messages</strong> that require user attention.',
            'Choose appropriate <strong>variants</strong> to match the message type.',
            'Keep alert content <strong>concise and actionable</strong>.',
            'Use clear, descriptive titles and descriptions.',
          ]}
        />
        <GuidelinesCard
          title="Don't"
          variant="warning"
          icon={<AlertTriangle />}
          items={[
            'Don\'t use alerts for general information (use regular text).',
            'Avoid using alerts for navigation or primary actions.',
            'Don\'t overuse alerts; they should be reserved for important messages.',
          ]}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Use appropriate ARIA roles and attributes for screen readers.',
          'Ensure sufficient color contrast for all variants.',
          'Provide clear, descriptive content for assistive technologies.',
          'Use semantic HTML structure for better accessibility.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    variant: 'default',
  },
  render: args => {
    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Alert"
          subtitle="Experiment with different alert configurations using the controls."
        />
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Preview</h3>
            <Alert variant={args.variant}>
              <AlertTitle>Interactive Alert</AlertTitle>
              <AlertDescription>
                This alert demonstrates the current variant configuration. Use the controls to experiment with different alert types.
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Variant: {args.variant}</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Success confirmations</li>
                <li>• Error notifications</li>
                <li>• Warning messages</li>
                <li>• Information updates</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Examples:</h4>
              <div className="space-y-3">
                <Alert variant="success" className="text-sm">
                  <AlertTitle>Profile Updated</AlertTitle>
                  <AlertDescription>Your profile information has been saved successfully.</AlertDescription>
                </Alert>
                <Alert variant="warning" className="text-sm">
                  <AlertTitle>Session Expiring</AlertTitle>
                  <AlertDescription>Your session will expire in 5 minutes.</AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive alert with configurable props. Use the controls to experiment with different alert configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Alert Documentation"
        subtitle="Comprehensive guide to using the Alert component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use <code>variant</code> to match the message type: success, warning, destructive, info.
          </li>
          <li>
            Include both <code>AlertTitle</code> and <code>AlertDescription</code> for comprehensive messaging.
          </li>
          <li>
            Keep alert content concise and actionable for better user experience.
          </li>
          <li>
            Use appropriate ARIA attributes and semantic HTML for accessibility.
          </li>
          <li>
            Consider the alert's placement and timing in the user flow.
          </li>
        </ul>
      </div>
    </div>
  ),
};
