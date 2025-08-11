import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  ColorPalette,
  ColorScale,
  InteractiveState,
  SemanticColor,
  SurfaceColor,
  SectionHeader,
  FormField,
  StatusIndicator,
  Notification,
  DashboardHeader,
  MetricCard,
  ChartArea,
  QuickActions,
  ColorWheel,
  CharacteristicCard,
  PhilosophyItem,
  GuidelinesSection,
  GuidelinesCard
} from './components';

const meta: Meta = {
  title: 'Design System/Foundations/Colors',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Colors"
            subtitle="Complete color system with primary, secondary, accent, and semantic palettes. Includes interactive states, accessibility compliance, and real-world examples."
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// STORIES
// ============================================================================

export const Palette: Story = {
  render: () => (
    <div className="space-y-16">
      <ColorPalette
        title="Primary Palette"
        subtitle="Sophisticated indigo tones for primary actions and branding"
        colors={tokens.colors.primary}
        descriptionMap={{
          '500': 'Main brand color',
          '600': 'Hover states'
        }}
      />

      <ColorPalette
        title="Secondary Palette"
        subtitle="Elegant gray tones for secondary elements and text"
        colors={tokens.colors.secondary}
        descriptionMap={{
          '500': 'Main text color',
          '400': 'Muted text'
        }}
      />

      <ColorPalette
        title="Accent Palette"
        subtitle="Refined teal tones for success states and highlights"
        colors={tokens.colors.accent}
        descriptionMap={{
          '500': 'Success states',
          '600': 'Hover states'
        }}
      />

      <ColorPalette
        title="Destructive Palette"
        subtitle="Professional red tones for errors and destructive actions"
        colors={tokens.colors.destructive}
        descriptionMap={{
          '500': 'Error states',
          '600': 'Hover states'
        }}
      />
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Semantic Color Roles"
          subtitle="Predefined semantic colors for consistent UI patterns"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SemanticColor
            name="Success"
            value={tokens.colors.success}
            description="Sophisticated emerald for positive feedback"
          />
          <SemanticColor
            name="Warning"
            value={tokens.colors.warning}
            description="Warm amber for caution states"
          />
          <SemanticColor
            name="Info"
            value={tokens.colors.info}
            description="Trustworthy blue for information"
          />
          <SemanticColor
            name="Danger"
            value={tokens.colors.danger}
            description="Professional red for critical alerts"
          />
        </div>
      </div>

      <div>
        <SectionHeader
          title="Surface Colors"
          subtitle="Background and surface colors for layout hierarchy"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SurfaceColor
            name="Background"
            value={tokens.colors.background}
            fg={tokens.colors.foreground}
          />
          <SurfaceColor
            name="Surface"
            value={tokens.colors.surface}
            fg={tokens.colors.onSurface}
          />
          <SurfaceColor
            name="Input"
            value={tokens.colors.input}
            fg={tokens.colors.foreground}
          />
          <SurfaceColor
            name="Border"
            value={tokens.colors.border}
            fg={tokens.colors.foreground}
          />
        </div>
      </div>
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Interactive States"
        subtitle="Hover, active, and focus states for interactive elements"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InteractiveState
          name="primary"
          defaultColor={tokens.colors.primary[500]}
          hover={tokens.colors.hover.primary}
          active={tokens.colors.active.primary}
          focus={tokens.colors.focus.primary}
        />
        <InteractiveState
          name="secondary"
          defaultColor={tokens.colors.secondary[500]}
          hover={tokens.colors.hover.secondary}
          active={tokens.colors.active.secondary}
          focus={tokens.colors.focus.secondary}
        />
        <InteractiveState
          name="accent"
          defaultColor={tokens.colors.accent[500]}
          hover={tokens.colors.hover.accent}
          active={tokens.colors.active.accent}
          focus={tokens.colors.focus.accent}
        />
        <InteractiveState
          name="destructive"
          defaultColor={tokens.colors.destructive[500]}
          hover={tokens.colors.hover.destructive}
          active={tokens.colors.active.destructive}
          focus={tokens.colors.focus.destructive}
        />
      </div>
    </div>
  ),
};

export const ColorScales: Story = {
  render: () => (
    <div className="space-y-16">
      <ColorScale name="primary" colors={tokens.colors.primary} />
      <ColorScale name="secondary" colors={tokens.colors.secondary} />
      <ColorScale name="accent" colors={tokens.colors.accent} />
      <ColorScale name="destructive" colors={tokens.colors.destructive} />
      <ColorScale name="muted" colors={tokens.colors.muted} />
    </div>
  ),
};

export const ColorCharacteristics: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Color Characteristics"
          subtitle="Understanding the refined characteristics of our classy color palette"
        />

        <ColorWheel />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CharacteristicCard
            color={tokens.colors.primary[500]}
            title="Sophisticated Indigo"
            description="Our primary indigo conveys trust, professionalism, and luxury. Perfect for financial applications."
            details={[
              { label: "Main", value: tokens.colors.primary[500] },
              { label: "Hover", value: tokens.colors.primary[600] },
              { label: "Active", value: tokens.colors.primary[700] }
            ]}
          />

          <CharacteristicCard
            color={tokens.colors.secondary[500]}
            title="Elegant Neutrals"
            description="True neutral grays provide clean hierarchy without color bias. Professional and timeless."
            details={[
              { label: "Text", value: tokens.colors.secondary[500] },
              { label: "Muted", value: tokens.colors.secondary[400] },
              { label: "Border", value: tokens.colors.secondary[200] }
            ]}
          />

          <CharacteristicCard
            color={tokens.colors.accent[500]}
            title="Refined Teal"
            description="Sophisticated teal for success states. More elegant than traditional green."
            details={[
              { label: "Success", value: tokens.colors.accent[500] },
              { label: "Hover", value: tokens.colors.accent[600] },
              { label: "Active", value: tokens.colors.accent[700] }
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

export const FinancialDashboard: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Financial Dashboard Example"
          subtitle="Real-world application of our color system in financial interfaces"
        />

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
          <DashboardHeader
            title="FinVision Analytics"
            subtitle="Portfolio Dashboard"
            initials="FV"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard label="Total Assets" value="$2.4M" change="+12.3%" />
            <MetricCard label="Risk Score" value="Low" change="Optimal" />
            <MetricCard label="Performance" value="+8.7%" change="YTD" />
            <MetricCard label="Alerts" value="2" change="Review" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartArea
              title="Portfolio Performance"
              colors={[tokens.colors.primary[500], tokens.colors.accent[500], tokens.colors.secondary[400]]}
            />
            <QuickActions
              title="Quick Actions"
              actions={[
                { label: "Add Investment", variant: "primary" },
                { label: "Generate Report", variant: "secondary" },
                { label: "Risk Analysis", variant: "secondary" }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveExamples: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Interactive Examples"
          subtitle="See our colors in action across different UI patterns"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 break-words">Form Elements</h4>
            <div className="space-y-4">
              <FormField label="Email Address" type="email" placeholder="Enter your email" />
              <FormField label="Investment Amount" type="number" placeholder="$10,000" />
              <div className="flex gap-3 flex-wrap">
                <button className="flex-1 min-w-0 px-4 py-2 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 text-sm">
                  Submit
                </button>
                <button className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 break-words">Status Indicators</h4>
            <div className="space-y-4">
              <StatusIndicator color={tokens.colors.accent[500]} label="Transaction Successful" />
              <StatusIndicator color={tokens.colors.warning} label="Risk Level: Medium" />
              <StatusIndicator color={tokens.colors.danger} label="Account Locked" />
              <StatusIndicator color={tokens.colors.info} label="New Feature Available" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 break-words">Notification System</h4>
          <div className="space-y-3">
            <Notification type="success" title="Investment Completed" message="Your $5,000 investment has been successfully processed." color={tokens.colors.accent[500]} />
            <Notification type="warning" title="Security Alert" message="Unusual login activity detected. Please review your account." color={tokens.colors.warning} />
            <Notification type="error" title="Transaction Failed" message="Insufficient funds. Please check your account balance." color={tokens.colors.danger} />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Complete Color Documentation"
          subtitle="Comprehensive guide to our sophisticated color system"
        />

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 break-words">🌟 Design Philosophy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <PhilosophyItem
                color={tokens.colors.primary[500]}
                title="Sophisticated Indigo Primary"
                description="Represents trust, stability, and innovation in financial technology"
              />
              <PhilosophyItem
                color={tokens.colors.secondary[500]}
                title="Elegant Neutral Grays"
                description="Provide clean hierarchy without color bias"
              />
            </div>
            <div className="space-y-4">
              <PhilosophyItem
                color={tokens.colors.accent[500]}
                title="Refined Teal Accents"
                description="Sophisticated success states that feel premium"
              />
              <PhilosophyItem
                color={tokens.colors.danger}
                title="Professional Semantic Colors"
                description="Clear, accessible communication"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 break-words">🚀 Usage Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GuidelinesSection
              title="Primary Colors (Indigo)"
              items={[
                "• <strong>500</strong>: Main brand elements, primary buttons, links",
                "• <strong>600</strong>: Hover states, active interactions",
                "• <strong>700</strong>: Pressed states, focus indicators",
                "• <strong>400</strong>: Secondary actions, subtle highlights"
              ]}
            />
            <GuidelinesSection
              title="Secondary Colors (Neutral Grays)"
              items={[
                "• <strong>500</strong>: Primary text, headings",
                "• <strong>400</strong>: Secondary text, labels",
                "• <strong>300</strong>: Borders, dividers",
                "• <strong>200</strong>: Backgrounds, subtle surfaces"
              ]}
            />
            <GuidelinesSection
              title="Semantic Colors"
              items={[
                "• <strong>Success</strong>: Positive feedback, completed actions",
                "• <strong>Warning</strong>: Caution states, attention required",
                "• <strong>Info</strong>: Informational content, help text",
                "• <strong>Danger</strong>: Errors, destructive actions"
              ]}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 break-words">♿ Accessibility</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GuidelinesSection
              title="Contrast Requirements"
              items={[
                "• All colors meet WCAG 2.1 AA standards (4.5:1 contrast ratio)",
                "• Test all color combinations for compliance",
                "• Support high contrast mode preferences"
              ]}
            />
            <GuidelinesSection
              title="Best Practices"
              items={[
                "• Ensure color is not the only way to convey information",
                "• Consider color blindness in design decisions",
                "• Use semantic color roles consistently"
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const UsageGuidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Color Usage Guidelines"
          subtitle="Best practices for implementing our sophisticated color system"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <GuidelinesCard
              title="Primary Colors"
              items={[
                "• Sophisticated indigo for brand identity",
                "• Use 500 for main elements",
                "• Use 600 for hover states",
                "• Use 700 for active states"
              ]}
            />

            <GuidelinesCard
              title="Secondary Colors"
              items={[
                "• Elegant neutral grays for hierarchy",
                "• Use 500 for main text",
                "• Use 400 for muted text",
                "• Use 200-300 for refined borders"
              ]}
            />
          </div>

          <div className="space-y-4">
            <GuidelinesCard
              title="Semantic Colors"
              items={[
                "• Success: Sophisticated emerald",
                "• Warning: Warm amber",
                "• Info: Trustworthy blue",
                "• Danger: Professional red"
              ]}
            />

            <GuidelinesCard
              title="Accessibility"
              items={[
                "• Ensure 4.5:1 contrast ratio",
                "• Test with color blindness",
                "• Don't rely solely on color",
                "• Use semantic color roles"
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

// Add new unique real user case stories
export const ECommerceInterface: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="E-Commerce Interface Example"
          subtitle="Color system applied to product catalog and shopping experience"
        />

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 break-words">Premium Electronics Store</h3>
              <p className="text-gray-600 break-words">High-end gadgets and accessories</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">3</span>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold text-sm">!</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="w-full h-32 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-md mb-3"></div>
              <h4 className="font-semibold text-gray-900 mb-2 break-words">Wireless Headphones</h4>
              <p className="text-green-600 font-semibold mb-2">$299.99</p>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">(127 reviews)</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="w-full h-32 bg-gradient-to-br from-teal-100 to-teal-200 rounded-md mb-3"></div>
              <h4 className="font-semibold text-gray-900 mb-2 break-words">Smart Watch</h4>
              <p className="text-green-600 font-semibold mb-2">$199.99</p>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">(89 reviews)</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-3"></div>
              <h4 className="font-semibold text-gray-900 mb-2 break-words">Laptop Stand</h4>
              <p className="text-green-600 font-semibold mb-2">$79.99</p>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">(203 reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
              Add to Cart
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Wishlist
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const HealthcareDashboard: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Healthcare Dashboard Example"
          subtitle="Color system applied to medical monitoring and patient care interfaces"
        />

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 break-words">Patient Monitoring System</h3>
              <p className="text-gray-600 break-words">Real-time health metrics and alerts</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Stable</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Monitor</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium break-words">Heart Rate</p>
                  <p className="text-2xl font-bold text-green-800">72 BPM</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">❤️</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium break-words">Blood Pressure</p>
                  <p className="text-2xl font-bold text-blue-800">120/80</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">💓</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium break-words">Oxygen Level</p>
                  <p className="text-2xl font-bold text-purple-800">98%</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">🫁</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium break-words">Temperature</p>
                  <p className="text-2xl font-bold text-orange-800">98.6°F</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm">🌡️</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-800 break-words">Medication reminder due in 30 minutes</span>
              </div>
              <button className="text-sm text-yellow-700 hover:text-yellow-800">Dismiss</button>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800 break-words">Next appointment: Dr. Smith at 2:00 PM</span>
              </div>
              <button className="text-sm text-blue-700 hover:text-blue-800">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};