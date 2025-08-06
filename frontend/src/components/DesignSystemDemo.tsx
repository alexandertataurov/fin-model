import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import {
  EnhancedCard,
  MetricCard,
  FeatureCard,
  EnhancedButton,
  ActionButton,
  IconButton,
  LoadingButton,
  componentStyles,
} from '@/components/ui';

/**
 * Design System Demo Component
 *
 * This component showcases all the enhanced design system components
 * and demonstrates how they integrate with the existing application.
 */
export const DesignSystemDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className={componentStyles.container}>
          <div className={`${componentStyles.flexBetween} py-6`}>
            <div>
              <h1 className={componentStyles.heading.h1}>Design System Demo</h1>
              <p className="text-muted-foreground mt-2">
                Showcasing the enhanced design system components
              </p>
            </div>
            <div className="flex items-center gap-3">
              <IconButton
                icon={<Settings className="h-4 w-4" />}
                onClick={() => console.log('Settings clicked')}
                variant="outline"
                tooltip="Settings"
              />
              <EnhancedButton variant="gradient" leftIcon={<Plus />}>
                Create New
              </EnhancedButton>
            </div>
          </div>
        </div>
      </header>

      <main className={`${componentStyles.container} py-8`}>
        {/* Metric Cards Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Metric Cards</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Display key metrics with trends and visual indicators
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value="$125,000"
              subtitle="This month"
              trend={{ value: 12, isPositive: true }}
              icon={<TrendingUp />}
              variant="success"
            />
            <MetricCard
              title="Total Expenses"
              value="$85,000"
              subtitle="This month"
              trend={{ value: 8, isPositive: false }}
              icon={<TrendingDown />}
              variant="warning"
            />
            <MetricCard
              title="Net Profit"
              value="$40,000"
              subtitle="This month"
              trend={{ value: 15, isPositive: true }}
              icon={<DollarSign />}
              variant="info"
            />
            <MetricCard
              title="Growth Rate"
              value="23.5%"
              subtitle="Year over year"
              trend={{ value: 5, isPositive: true }}
              icon={<BarChart3 />}
              variant="default"
            />
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Feature Cards</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Interactive cards for navigation and feature discovery
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Analytics Dashboard"
              description="Advanced analytics and reporting tools with real-time data visualization"
              icon={<BarChart3 />}
              action={
                <EnhancedButton variant="outline" size="sm">
                  Explore
                </EnhancedButton>
              }
              variant="highlight"
            />
            <FeatureCard
              title="File Management"
              description="Upload, organize, and manage your financial documents securely"
              icon={<Upload />}
              action={
                <EnhancedButton variant="outline" size="sm">
                  Upload Files
                </EnhancedButton>
              }
            />
            <FeatureCard
              title="Report Generation"
              description="Create comprehensive financial reports with custom templates"
              icon={<Download />}
              action={
                <EnhancedButton variant="outline" size="sm">
                  Generate Report
                </EnhancedButton>
              }
            />
          </div>
        </section>

        {/* Enhanced Cards Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Enhanced Cards</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Various card variants with different interactive states
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedCard
              variant="default"
              padding="lg"
              header={
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Default Card</h3>
                  <IconButton
                    icon={<Eye />}
                    variant="ghost"
                    size="sm"
                    tooltip="View details"
                  />
                </div>
              }
            >
              <p className="text-muted-foreground">
                This is a default card with header and content. It demonstrates
                the basic styling and layout capabilities.
              </p>
            </EnhancedCard>

            <EnhancedCard
              variant="outline"
              padding="lg"
              hover={true}
              onClick={() => console.log('Interactive card clicked')}
            >
              <h3 className="font-semibold mb-2">Interactive Card</h3>
              <p className="text-muted-foreground">
                This card has hover effects and is clickable. Try hovering over
                it!
              </p>
            </EnhancedCard>

            <EnhancedCard
              variant="filled"
              className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
              padding="lg"
            >
              <h3 className="font-semibold mb-2">Gradient Card</h3>
              <p className="text-muted-foreground">
                This card uses a gradient background and custom styling to
                create visual hierarchy and emphasis.
              </p>
            </EnhancedCard>

            <EnhancedCard variant="outline" padding="lg" selected={true}>
              <h3 className="font-semibold mb-2">Selected Card</h3>
              <p className="text-muted-foreground">
                This card shows the selected state with a ring and background
                highlight.
              </p>
            </EnhancedCard>
          </div>
        </section>

        {/* Button Variants Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Button Variants</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Different button styles and states for various use cases
          </p>

          {/* Basic Variants */}
          <div className="mb-8">
            <h3 className={componentStyles.heading.h3}>Basic Variants</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <EnhancedButton variant="default">Default</EnhancedButton>
              <EnhancedButton variant="secondary">Secondary</EnhancedButton>
              <EnhancedButton variant="outline">Outline</EnhancedButton>
              <EnhancedButton variant="ghost">Ghost</EnhancedButton>
              <EnhancedButton variant="link">Link</EnhancedButton>
            </div>
          </div>

          {/* Status Variants */}
          <div className="mb-8">
            <h3 className={componentStyles.heading.h3}>Status Variants</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <EnhancedButton variant="success">Success</EnhancedButton>
              <EnhancedButton variant="warning">Warning</EnhancedButton>
              <EnhancedButton variant="destructive">Destructive</EnhancedButton>
              <EnhancedButton variant="info">Info</EnhancedButton>
            </div>
          </div>

          {/* Special Variants */}
          <div className="mb-8">
            <h3 className={componentStyles.heading.h3}>Special Variants</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <EnhancedButton variant="gradient">Gradient</EnhancedButton>
              <EnhancedButton variant="glass">Glass</EnhancedButton>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className={componentStyles.heading.h3}>Sizes</h3>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <EnhancedButton size="sm">Small</EnhancedButton>
              <EnhancedButton size="default">Default</EnhancedButton>
              <EnhancedButton size="lg">Large</EnhancedButton>
              <EnhancedButton size="xl">Extra Large</EnhancedButton>
            </div>
          </div>

          {/* With Icons */}
          <div className="mb-8">
            <h3 className={componentStyles.heading.h3}>With Icons</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <EnhancedButton leftIcon={<Plus />}>Add Item</EnhancedButton>
              <EnhancedButton rightIcon={<Download />}>Download</EnhancedButton>
              <EnhancedButton leftIcon={<Upload />} rightIcon={<ArrowRight />}>
                Upload & Continue
              </EnhancedButton>
            </div>
          </div>

          {/* Loading States */}
          <div className="mb-8">
            <h3 className={componentStyles.heading.h3}>Loading States</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <LoadingButton
                loading={isLoading}
                onClick={handleLoadingClick}
                variant="success"
              >
                Save Changes
              </LoadingButton>
              <LoadingButton
                loading={isLoading}
                onClick={handleLoadingClick}
                variant="outline"
              >
                Processing...
              </LoadingButton>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8">
            <h3 className={componentStyles.heading.h3}>Action Buttons</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <ActionButton
                icon={<Upload />}
                label="Upload File"
                onClick={() => console.log('Upload clicked')}
                variant="success"
              />
              <ActionButton
                icon={<Download />}
                label="Export Data"
                onClick={() => console.log('Export clicked')}
                variant="info"
              />
              <ActionButton
                icon={<Trash2 />}
                label="Delete Item"
                onClick={() => console.log('Delete clicked')}
                variant="destructive"
              />
            </div>
          </div>

          {/* Icon Buttons */}
          <div className="mb-8">
            <h3 className={componentStyles.heading.h3}>Icon Buttons</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <IconButton
                icon={<Settings />}
                onClick={() => console.log('Settings clicked')}
                variant="ghost"
                tooltip="Settings"
              />
              <IconButton
                icon={<Edit />}
                onClick={() => console.log('Edit clicked')}
                variant="outline"
                tooltip="Edit"
              />
              <IconButton
                icon={<Eye />}
                onClick={() => console.log('View clicked')}
                variant="default"
                tooltip="View"
              />
              <IconButton
                icon={<Trash2 />}
                onClick={() => console.log('Delete clicked')}
                variant="destructive"
                tooltip="Delete"
              />
            </div>
          </div>
        </section>

        {/* Layout Patterns Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Layout Patterns</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Common layout patterns using design system utilities
          </p>

          <EnhancedCard variant="outline" className="mb-6">
            <h3 className={componentStyles.heading.h3}>Container Pattern</h3>
            <p className="text-muted-foreground">
              This card uses the container pattern with consistent spacing and
              typography.
            </p>
          </EnhancedCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedCard variant="default">
              <h4 className={componentStyles.heading.h4}>Responsive Grid</h4>
              <p className="text-muted-foreground">
                This demonstrates responsive grid layouts using design system
                utilities.
              </p>
            </EnhancedCard>

            <EnhancedCard variant="default">
              <h4 className={componentStyles.heading.h4}>Flexbox Patterns</h4>
              <p className="text-muted-foreground">
                Common flexbox patterns for alignment and spacing.
              </p>
            </EnhancedCard>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DesignSystemDemo;
