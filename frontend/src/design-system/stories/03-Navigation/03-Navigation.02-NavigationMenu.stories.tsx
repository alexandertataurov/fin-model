import React from 'react';
import type { StoryObj } from '@storybook/react';
import { Title, Stories } from '@storybook/blocks';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from '../../components/NavigationMenu';
import {
  AnimatedBanner,
  SectionHeader,
  GuidelinesSection,
  GuidelinesCard,
  PhilosophyItem,
  CharacteristicCard
} from '../components';
import {
  BarChart3,
  Calculator,
  FileText,
  Settings,
  Users,
  TrendingUp,
  Shield,
  Database,
  PieChart,
  Target,
  Zap,
  Globe,
  Building,
  CreditCard,
  PieChart as AnalyticsIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';

const meta = {
  title: 'Design System/3 - Navigation/NavigationMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Navigation Menu"
            subtitle="Sophisticated navigation system with dropdown menus, mega menus, and interactive states. Built for complex financial applications and enterprise interfaces."
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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

export const BasicNavigation: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Basic Navigation Menu"
          subtitle="Simple navigation with dropdown menus and smooth interactions"
        />

        <Card className="p-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64">
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Analytics
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Monitoring
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Reporting
                    </a>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className="px-4 py-2">
                  Docs
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className="px-4 py-2">
                  Support
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Card>
      </div>
    </div>
  ),
};

export const FinancialApplication: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Financial Application Navigation"
          subtitle="Complex navigation structure for financial modeling and analysis tools"
        />

        <Card className="p-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Models</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 w-96">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          Valuation Models
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            DCF Analysis
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Comparable Companies
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Precedent Transactions
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Scenario Analysis
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Monte Carlo
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Sensitivity Analysis
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Stress Testing
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64">
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Executive Summary
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Detailed Analysis
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Charts & Graphs
                    </a>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className="px-4 py-2">
                  Settings
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Card>
      </div>
    </div>
  ),
};

export const EnterpriseDashboard: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Enterprise Dashboard Navigation"
          subtitle="Comprehensive navigation for enterprise-level financial dashboards"
        />

        <Card className="p-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 w-[500px]">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Performance
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Portfolio Returns
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Risk Metrics
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Benchmark Analysis
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Database className="w-4 h-4" />
                          Data Management
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Market Data
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Client Records
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Transaction History
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Compliance
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Regulatory Reports
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Audit Trails
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Risk Assessments
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Clients</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64">
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Client Directory
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Account Management
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Communication Log
                    </a>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className="px-4 py-2">
                  Admin
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Card>
      </div>
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Interactive States"
          subtitle="Demonstration of hover, focus, and active states"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Hover States</CardTitle>
            </CardHeader>
            <CardContent>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Hover Me</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-48">
                        <a className="block rounded-md p-2 hover:bg-accent" href="#">
                          Hover Effect
                        </a>
                        <a className="block rounded-md p-2 hover:bg-accent" href="#">
                          Smooth Transition
                        </a>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Focus States</CardTitle>
            </CardHeader>
            <CardContent>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Focus Me</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-48">
                        <a className="block rounded-md p-2 hover:bg-accent focus:bg-accent" href="#">
                          Focus Effect
                        </a>
                        <a className="block rounded-md p-2 hover:bg-accent focus:bg-accent" href="#">
                          Keyboard Navigation
                        </a>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const NavigationCharacteristics: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Navigation Characteristics"
          subtitle="Understanding the sophisticated characteristics of our navigation system"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CharacteristicCard
            color="#6366f1"
            title="Accessible Design"
            description="Built with ARIA attributes and keyboard navigation support for inclusive user experience."
            details={[
              { label: "Keyboard", value: "Full support" },
              { label: "Screen Reader", value: "Compatible" },
              { label: "Focus", value: "Visible indicators" }
            ]}
          />

          <CharacteristicCard
            color="#64748b"
            title="Responsive Layout"
            description="Adapts seamlessly across desktop, tablet, and mobile devices with intelligent breakpoints."
            details={[
              { label: "Desktop", value: "Full menu" },
              { label: "Tablet", value: "Adaptive" },
              { label: "Mobile", value: "Collapsible" }
            ]}
          />

          <CharacteristicCard
            color="#14b8a6"
            title="Smooth Animations"
            description="Fluid transitions and micro-interactions that enhance user experience without distraction."
            details={[
              { label: "Duration", value: "200ms" },
              { label: "Easing", value: "In-out" },
              { label: "Performance", value: "Optimized" }
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

export const ECommerceInterface: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="E-Commerce Navigation"
          subtitle="Navigation system applied to online retail and shopping experiences"
        />

        <Card className="p-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 w-[600px]">
                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Electronics
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Smartphones
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Laptops
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Accessories
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Home & Garden
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Furniture
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Decor
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Tools
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Fashion
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Clothing
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Shoes
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Jewelry
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Sports
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Equipment
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Apparel
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Fitness
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Deals</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64">
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Flash Sales
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Clearance
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Daily Deals
                    </a>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className="px-4 py-2">
                  Customer Service
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Card>
      </div>
    </div>
  ),
};

export const HealthcareDashboard: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Healthcare Navigation"
          subtitle="Navigation system applied to medical and healthcare interfaces"
        />

        <Card className="p-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Patient Care</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 w-[500px]">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Patient Management
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Patient Records
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Appointments
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Medical History
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Clinical Data
                        </h4>
                        <div className="space-y-2">
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Vital Signs
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Lab Results
                          </a>
                          <a className="block rounded-md p-2 hover:bg-accent" href="#">
                            Medications
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64">
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Population Health
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Quality Metrics
                    </a>
                    <a className="block rounded-md p-2 hover:bg-accent" href="#">
                      Outcomes Analysis
                    </a>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className="px-4 py-2">
                  Administration
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Card>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Complete Navigation Documentation"
          subtitle="Comprehensive guide to our sophisticated navigation system"
        />

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 break-words">🌟 Design Philosophy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <PhilosophyItem
                color="#6366f1"
                title="Accessible by Design"
                description="Built with ARIA attributes and keyboard navigation for inclusive user experience"
              />
              <PhilosophyItem
                color="#64748b"
                title="Responsive Architecture"
                description="Adapts seamlessly across all device sizes with intelligent breakpoints"
              />
            </div>
            <div className="space-y-4">
              <PhilosophyItem
                color="#14b8a6"
                title="Smooth Interactions"
                description="Fluid animations and micro-interactions that enhance usability"
              />
              <PhilosophyItem
                color="#ef4444"
                title="Performance Optimized"
                description="Lightweight implementation with minimal bundle impact"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 break-words">🚀 Usage Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GuidelinesSection
              title="Menu Structure"
              items={[
                "• <strong>Primary</strong>: Main navigation items",
                "• <strong>Secondary</strong>: Dropdown menus",
                "• <strong>Tertiary</strong>: Nested submenus",
                "• <strong>Actions</strong>: Direct links"
              ]}
            />
            <GuidelinesSection
              title="Interaction Patterns"
              items={[
                "• <strong>Hover</strong>: Reveal dropdown content",
                "• <strong>Focus</strong>: Keyboard navigation",
                "• <strong>Click</strong>: Activate menu items",
                "• <strong>Escape</strong>: Close menus"
              ]}
            />
            <GuidelinesSection
              title="Accessibility"
              items={[
                "• <strong>ARIA</strong>: Proper labeling",
                "• <strong>Keyboard</strong>: Full navigation",
                "• <strong>Screen Reader</strong>: Compatible",
                "• <strong>Focus</strong>: Visible indicators"
              ]}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 break-words">♿ Accessibility</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GuidelinesSection
              title="WCAG Compliance"
              items={[
                "• Meets WCAG 2.1 AA standards",
                "• Proper ARIA attributes",
                "• Keyboard navigation support",
                "• Focus management"
              ]}
            />
            <GuidelinesSection
              title="Best Practices"
              items={[
                "• Logical tab order",
                "• Clear visual indicators",
                "• Screen reader announcements",
                "• Error prevention"
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
          title="Navigation Usage Guidelines"
          subtitle="Best practices for implementing our sophisticated navigation system"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <GuidelinesCard
              title="Menu Structure"
              items={[
                "• Use clear, descriptive labels",
                "• Limit to 7±2 items per menu",
                "• Group related items together",
                "• Maintain consistent hierarchy"
              ]}
            />

            <GuidelinesCard
              title="Interaction Design"
              items={[
                "• Provide hover feedback",
                "• Use smooth transitions",
                "• Support keyboard navigation",
                "• Include loading states"
              ]}
            />
          </div>

          <div className="space-y-4">
            <GuidelinesCard
              title="Accessibility"
              items={[
                "• Implement ARIA attributes",
                "• Ensure keyboard support",
                "• Provide focus indicators",
                "• Test with screen readers"
              ]}
            />

            <GuidelinesCard
              title="Performance"
              items={[
                "• Optimize bundle size",
                "• Use efficient animations",
                "• Implement lazy loading",
                "• Monitor performance metrics"
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
