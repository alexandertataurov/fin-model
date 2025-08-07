import type { Meta, StoryObj } from '@storybook/react';
// import Layout from './Layout';
// import Sidebar from './Sidebar';
// import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Upload, 
  BarChart3, 
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Bell
} from 'lucide-react';

const meta: Meta = {
  title: '🏗️ Application Structure',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Layout components and page structures that define the overall application architecture and user experience flow.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const SampleSidebarContent = () => (
  <div className="w-64 h-screen bg-card border-r">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold">FinVision</h2>
      <p className="text-sm text-muted-foreground">Financial Modeling</p>
    </div>
    
    <nav className="p-4 space-y-2">
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Main
        </h3>
        <Button variant="ghost" className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Reports
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Upload className="mr-2 h-4 w-4" />
          Upload Data
        </Button>
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Analysis
        </h3>
        <Button variant="ghost" className="w-full justify-start">
          <BarChart3 className="mr-2 h-4 w-4" />
          Financial Charts
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <TrendingUp className="mr-2 h-4 w-4" />
          Scenarios
        </Button>
        <Button variant="secondary" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Parameters
        </Button>
      </div>
    </nav>
  </div>
);

const SampleHeader = () => (
  <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <h1 className="text-xl font-semibold">Parameter Dashboard</h1>
      <Badge variant="secondary">Active Model</Badge>
    </div>
    
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon">
        <Bell className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
          JD
        </div>
        <span className="text-sm font-medium">John Doe</span>
      </div>
    </div>
  </header>
);

const SampleDashboardContent = () => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* KPI Cards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,234,567</div>
          <div className="text-xs text-muted-foreground">
            <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
            +12.5% from last month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Active Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <div className="text-xs text-muted-foreground">
            3 modified today
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Model Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Calculation</span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Parameter Changes</CardTitle>
          <CardDescription>
            Parameters modified in the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Revenue Growth Rate', old: '12%', new: '15%', time: '2 hours ago' },
              { name: 'Discount Rate', old: '10%', new: '8%', time: '4 hours ago' },
              { name: 'COGS Margin', old: '65%', new: '60%', time: '6 hours ago' },
            ].map((change, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{change.name}</p>
                  <p className="text-xs text-muted-foreground">{change.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="text-muted-foreground">{change.old}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{change.new}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
          <CardDescription>
            Key metrics and validation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Calculation Status</span>
              <Badge variant="default">Complete</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Validation Errors</span>
              <Badge variant="destructive">2</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Updated</span>
              <span className="text-sm text-muted-foreground">5 minutes ago</span>
            </div>
            <div className="pt-4 border-t">
              <Button className="w-full">
                Recalculate Model
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const FullApplicationLayout: Story = {
  render: () => (
    <div className="flex h-screen bg-background">
      <SampleSidebarContent />
      <div className="flex-1 flex flex-col">
        <SampleHeader />
        <main className="flex-1 overflow-auto">
          <SampleDashboardContent />
        </main>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete application layout with sidebar, header, and dashboard content.',
      },
    },
  },
};

export const DashboardLayoutExample: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <SampleHeader />
      <div className="flex">
        <SampleSidebarContent />
        <main className="flex-1">
          <SampleDashboardContent />
        </main>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard-specific layout optimized for data visualization and widgets.',
      },
    },
  },
};

export const SidebarOnly: Story = {
  render: () => (
    <div className="flex h-screen">
      <SampleSidebarContent />
      <div className="flex-1 bg-muted/20 flex items-center justify-center">
        <p className="text-muted-foreground">Main content area</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar navigation component with menu structure.',
      },
    },
  },
};

export const HeaderOnly: Story = {
  render: () => (
    <div className="h-screen bg-background">
      <SampleHeader />
      <div className="h-full bg-muted/20 flex items-center justify-center">
        <p className="text-muted-foreground">Content area below header</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Application header with user actions and navigation.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      {/* Mobile/Tablet Header */}
      <header className="lg:hidden h-16 border-b bg-background px-4 flex items-center justify-between">
        <Button variant="ghost" size="icon">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
        <h1 className="text-lg font-semibold">FinVision</h1>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <SampleSidebarContent />
        </div>
        
        {/* Main Content */}
        <main className="flex-1">
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <SampleHeader />
          </div>
          
          {/* Content */}
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl lg:text-2xl font-bold">$1.2M</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl lg:text-2xl font-bold">24</div>
                </CardContent>
              </Card>
              
              <Card className="sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="default">Active</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
    docs: {
      description: {
        story: 'Responsive layout that adapts to different screen sizes with mobile-first approach.',
      },
    },
  },
};

export const CenteredFormLayout: Story = {
  render: () => (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:block w-64">
        <SampleSidebarContent />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Create New Parameter</CardTitle>
            <CardDescription>
              Add a new financial parameter to your model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Parameter Name</label>
              <input 
                className="w-full px-3 py-2 border rounded-md" 
                placeholder="e.g., Revenue Growth Rate"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Revenue</option>
                <option>Costs</option>
                <option>Valuation</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Value</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border rounded-md" 
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Value</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border rounded-md" 
                  placeholder="1"
                />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button className="w-full">Create Parameter</Button>
              <Button variant="outline" className="w-full">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Centered form layout with sidebar navigation for focused input tasks.',
      },
    },
  },
};