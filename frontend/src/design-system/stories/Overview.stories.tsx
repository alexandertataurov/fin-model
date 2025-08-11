import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/Avatar';
import {
  Settings,
  Eye,
  Edit,
  Search
} from 'lucide-react';

const meta: Meta = {
  title: 'Design System/Overview',
  component: React.Fragment,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Overview of the Financial Modeling Design System with all core components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Theme setting',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Color Palette
export const ColorPalette: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-16 bg-primary rounded-lg"></div>
            <p className="text-sm font-medium">Primary</p>
            <p className="text-xs text-muted-foreground">#0f172a</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-secondary rounded-lg"></div>
            <p className="text-sm font-medium">Secondary</p>
            <p className="text-xs text-muted-foreground">#f1f5f9</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-accent rounded-lg"></div>
            <p className="text-sm font-medium">Accent</p>
            <p className="text-xs text-muted-foreground">#f8fafc</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-destructive rounded-lg"></div>
            <p className="text-sm font-medium">Destructive</p>
            <p className="text-xs text-muted-foreground">#ef4444</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Typography
export const Typography: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Heading 1 - 4xl Bold</h1>
            <p className="text-sm text-muted-foreground">Used for page titles and main headings</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Heading 2 - 2xl Semibold</h2>
            <p className="text-sm text-muted-foreground">Used for section headings</p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Heading 3 - xl Medium</h3>
            <p className="text-sm text-muted-foreground">Used for subsection headings</p>
          </div>
          <div>
            <p className="text-base">Body text - base size for general content</p>
            <p className="text-sm text-muted-foreground">Small text for captions and secondary information</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Core Components
export const CoreComponents: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Core Components</h2>

        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Buttons</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Settings className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Inputs</h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Input</label>
                <Input placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">With Icon</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Disabled</label>
                <Input disabled placeholder="Disabled input" />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>Simple card with header and content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is the card content area where you can put any content.</p>
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Card with multiple actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This card demonstrates multiple action buttons.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Avatars */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Avatars</h3>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Financial Components
export const FinancialComponents: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Financial-Specific Components</h2>

        <div className="space-y-6">
          {/* Financial Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Financial Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,345.67</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,901.23</div>
                  <p className="text-xs text-muted-foreground">+8.7% from last month</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Status Indicators */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Status Indicators</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Profitable
              </Badge>
              <Badge variant="destructive">
                Loss
              </Badge>
              <Badge variant="secondary">
                Break-even
              </Badge>
              <Badge variant="outline">
                Projected
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Usage Guidelines
export const UsageGuidelines: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>

        <div className="space-y-6">
          {/* Spacing */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Spacing System</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-blue-200 rounded"></div>
                <p className="text-sm">space-1 (4px)</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-blue-200 rounded"></div>
                <p className="text-sm">space-2 (8px)</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-blue-200 rounded"></div>
                <p className="text-sm">space-3 (12px)</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-blue-200 rounded"></div>
                <p className="text-sm">space-4 (16px)</p>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Layout Grid</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm">Grid Item 1</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm">Grid Item 2</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm">Grid Item 3</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Accessibility Features</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Proper ARIA labels and roles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Keyboard navigation support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Focus management</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Color contrast compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Screen reader support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
