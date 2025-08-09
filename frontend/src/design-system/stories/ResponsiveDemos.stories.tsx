import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuTrigger,
  Separator
} from '@/design-system';

// Responsive Grid Component
const ResponsiveGrid = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Responsive Grid System</h3>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }, (_, i) => (
        <Card key={i} className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{i + 1}</div>
            <div className="text-xs text-muted-foreground">Item {i + 1}</div>
          </div>
        </Card>
      ))}
    </div>
    
    <div className="text-sm text-muted-foreground">
      <p><strong>Breakpoints:</strong></p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li><code>sm:</code> 640px+ (2 columns)</li>
        <li><code>md:</code> 768px+ (3 columns)</li>
        <li><code>lg:</code> 1024px+ (4 columns)</li>
        <li><code>xl:</code> 1280px+ (6 columns)</li>
      </ul>
    </div>
  </div>
);

// Responsive Navigation
const ResponsiveNavigation = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Responsive Navigation</h3>
    
    {/* Desktop Navigation */}
    <div className="hidden md:block">
      <NavigationMenu className="border rounded-lg p-4">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 w-[400px] lg:w-[500px]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Core Products</h4>
                    <ul className="space-y-1 text-sm">
                      <li><a href="#" className="hover:text-primary">Analytics</a></li>
                      <li><a href="#" className="hover:text-primary">Dashboard</a></li>
                      <li><a href="#" className="hover:text-primary">Reports</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Integrations</h4>
                    <ul className="space-y-1 text-sm">
                      <li><a href="#" className="hover:text-primary">API</a></li>
                      <li><a href="#" className="hover:text-primary">Webhooks</a></li>
                      <li><a href="#" className="hover:text-primary">SDK</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="px-4 py-2 hover:text-primary">
              Solutions
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="px-4 py-2 hover:text-primary">
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="px-4 py-2 hover:text-primary">
              Support
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
    
    {/* Mobile Navigation */}
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <Menu className="mr-2 h-4 w-4" />
            Open Navigation
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Browse our products and services</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Products</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="block py-2 hover:text-primary">Analytics</a></li>
                <li><a href="#" className="block py-2 hover:text-primary">Dashboard</a></li>
                <li><a href="#" className="block py-2 hover:text-primary">Reports</a></li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Company</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="block py-2 hover:text-primary">About</a></li>
                <li><a href="#" className="block py-2 hover:text-primary">Contact</a></li>
                <li><a href="#" className="block py-2 hover:text-primary">Careers</a></li>
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
    
    <div className="text-sm text-muted-foreground">
      <p><strong>Responsive Behavior:</strong></p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li><code>md:</code> Desktop navigation with dropdown menus</li>
        <li><code>mobile:</code> Hamburger menu with slide-out sheet</li>
      </ul>
    </div>
  </div>
);

// Responsive Forms
const ResponsiveForms = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Responsive Forms</h3>
    
    <Card>
      <CardHeader>
        <CardTitle>User Registration</CardTitle>
        <CardDescription>Form layout adapts to screen size</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter email address" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Enter full address" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Enter city" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input id="state" placeholder="Enter state" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input id="zipCode" placeholder="Enter ZIP code" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="flex-1">Create Account</Button>
            <Button type="button" variant="outline" className="flex-1">Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
    
    <div className="text-sm text-muted-foreground">
      <p><strong>Form Responsiveness:</strong></p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li><code>mobile:</code> Single column layout</li>
        <li><code>md:</code> Two-column layout for related fields</li>
        <li><code>lg:</code> Three-column layout for address fields</li>
        <li>Button layout adapts from stacked to inline</li>
      </ul>
    </div>
  </div>
);

// Responsive Tables
const ResponsiveTables = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Responsive Tables</h3>
    
    {/* Desktop Table */}
    <div className="hidden md:block">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Full table view on larger screens</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">User {i + 1}</TableCell>
                  <TableCell>user{i + 1}@example.com</TableCell>
                  <TableCell>
                    <Badge variant={i === 0 ? 'default' : 'secondary'}>
                      {i === 0 ? 'Admin' : 'User'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell>2024-01-{String(i + 15).padStart(2, '0')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    
    {/* Mobile Table */}
    <div className="md:hidden space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Card-based view on mobile devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">User {i + 1}</h4>
                      <p className="text-sm text-muted-foreground">user{i + 1}@example.com</p>
                    </div>
                    <Badge variant={i === 0 ? 'default' : 'secondary'}>
                      {i === 0 ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span>Status: <Badge variant="default" className="ml-1">Active</Badge></span>
                    <span>Last: 2024-01-{String(i + 15).padStart(2, '0')}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                    <Button size="sm" variant="destructive" className="flex-1">Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    
    <div className="text-sm text-muted-foreground">
      <p><strong>Table Responsiveness:</strong></p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li><code>md:</code> Full table with all columns</li>
        <li><code>mobile:</code> Card-based layout for better mobile UX</li>
        <li>Actions stack vertically on mobile</li>
        <li>Status badges remain visible on all screen sizes</li>
      </ul>
    </div>
  </div>
);

// Responsive Cards
const ResponsiveCards = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Responsive Cards</h3>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <Card key={i} className="group hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Card {i + 1}</CardTitle>
              <Badge variant="outline" className="text-xs">New</Badge>
            </div>
            <CardDescription className="text-sm">
              This is a responsive card that adapts to different screen sizes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="h-20 bg-muted rounded flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Image Placeholder</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Category {i % 3 + 1}</span>
                  <span>• {i + 1} min read</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">View</Button>
                <Button size="sm" variant="outline">Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    
    <div className="text-sm text-muted-foreground">
      <p><strong>Card Responsiveness:</strong></p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li><code>mobile:</code> Single column (1 card per row)</li>
        <li><code>sm:</code> Two columns (2 cards per row)</li>
        <li><code>lg:</code> Three columns (3 cards per row)</li>
        <li><code>xl:</code> Four columns (4 cards per row)</li>
        <li>Cards maintain consistent height and spacing</li>
      </ul>
    </div>
  </div>
);

// Responsive Tabs
const ResponsiveTabs = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Responsive Tabs</h3>
    
    <Card>
      <CardHeader>
        <CardTitle>Content Organization</CardTitle>
        <CardDescription>Tabs adapt to screen size and content</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview" className="space-y-4">
              <h4 className="text-lg font-medium">Product Overview</h4>
              <p className="text-muted-foreground">
                Our comprehensive solution provides everything you need to manage your business effectively.
                Built with modern technologies and designed for scalability.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Integrations</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <h4 className="text-lg font-medium">Key Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium">Analytics Dashboard</h5>
                  <p className="text-sm text-muted-foreground">Real-time insights and reporting</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">User Management</h5>
                  <p className="text-sm text-muted-foreground">Comprehensive user control</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">API Access</h5>
                  <p className="text-sm text-muted-foreground">RESTful API with documentation</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Security</h5>
                  <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-4">
              <h4 className="text-lg font-medium">Pricing Plans</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">Starter</CardTitle>
                    <CardDescription>Perfect for small teams</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$29<span className="text-sm text-muted-foreground">/month</span></div>
                    <Button className="w-full">Get Started</Button>
                  </CardContent>
                </Card>
                
                <Card className="text-center border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">Professional</CardTitle>
                    <CardDescription>Most popular choice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$99<span className="text-sm text-muted-foreground">/month</span></div>
                    <Button className="w-full">Get Started</Button>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">Enterprise</CardTitle>
                    <CardDescription>For large organizations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$299<span className="text-sm text-muted-foreground">/month</span></div>
                    <Button className="w-full">Contact Sales</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="docs" className="space-y-4">
              <h4 className="text-lg font-medium">Documentation</h4>
              <p className="text-muted-foreground">
                Comprehensive documentation with examples, tutorials, and API references.
              </p>
            </TabsContent>
            
            <TabsContent value="support" className="space-y-4">
              <h4 className="text-lg font-medium">Support</h4>
              <p className="text-muted-foreground">
                Get help from our support team via email, chat, or phone.
              </p>
            </TabsContent>
            
            <TabsContent value="changelog" className="space-y-4">
              <h4 className="text-lg font-medium">Changelog</h4>
              <p className="text-muted-foreground">
                Track the latest updates and improvements to our platform.
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
    
    <div className="text-sm text-muted-foreground">
      <p><strong>Tab Responsiveness:</strong></p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li><code>mobile:</code> 2 columns (Overview, Features)</li>
        <li><code>md:</code> 4 columns (adds Pricing, Documentation)</li>
        <li><code>lg:</code> 6 columns (adds Support, Changelog)</li>
        <li>Content adapts to available space</li>
        <li>Grid layouts adjust based on screen size</li>
      </ul>
    </div>
  </div>
);

// Main component
const ResponsiveDemosShowcase = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Responsive Design Demos</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive showcase of responsive design patterns and breakpoint behaviors
        </p>
      </div>
      
      <Separator />
      
      <ResponsiveGrid />
      <Separator />
      <ResponsiveNavigation />
      <Separator />
      <ResponsiveForms />
      <Separator />
      <ResponsiveTables />
      <Separator />
      <ResponsiveCards />
      <Separator />
      <ResponsiveTabs />
      
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Responsive Design Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Mobile-First Approach</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Start with mobile layout and scale up</li>
              <li>• Use progressive enhancement</li>
              <li>• Prioritize touch-friendly interactions</li>
              <li>• Optimize for vertical scrolling</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Breakpoint Strategy</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <code>sm:</code> 640px (small tablets)</li>
              <li>• <code>md:</code> 768px (tablets)</li>
              <li>• <code>lg:</code> 1024px (laptops)</li>
              <li>• <code>xl:</code> 1280px (desktops)</li>
              <li>• <code>2xl:</code> 1536px (large screens)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Design System/Responsive Demos',
  tags: ['autodocs'],
  parameters: {
    docs: { 
      description: { 
        component: 'Comprehensive responsive design showcase demonstrating mobile-first approach, breakpoint behaviors, and adaptive layouts for various UI components including grids, navigation, forms, tables, cards, and tabs.' 
      } 
    },
    layout: 'padded',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
        large: {
          name: 'Large Desktop',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },
  },
};

export default meta;
type StoryObj = StoryObj<typeof meta>;

export const ResponsiveGridDemo: StoryObj = {
  render: () => <ResponsiveGrid />,
  parameters: {
    docs: { description: { story: 'Responsive grid system that adapts from 1 column on mobile to 6 columns on large screens.' } }
  }
};

export const ResponsiveNavigationDemo: StoryObj = {
  render: () => <ResponsiveNavigation />,
  parameters: {
    docs: { description: { story: 'Navigation that switches between desktop dropdown menus and mobile slide-out sheet.' } }
  }
};

export const ResponsiveFormsDemo: StoryObj = {
  render: () => <ResponsiveForms />,
  parameters: {
    docs: { description: { story: 'Form layouts that adapt from single column on mobile to multi-column on larger screens.' } }
  }
};

export const ResponsiveTablesDemo: StoryObj = {
  render: () => <ResponsiveTables />,
  parameters: {
    docs: { description: { story: 'Tables that transform from full table view on desktop to card-based layout on mobile.' } }
  }
};

export const ResponsiveCardsDemo: StoryObj = {
  render: () => <ResponsiveCards />,
  parameters: {
    docs: { description: { story: 'Card grid that adapts from 1 column on mobile to 4 columns on large screens.' } }
  }
};

export const ResponsiveTabsDemo: StoryObj = {
  render: () => <ResponsiveTabs />,
  parameters: {
    docs: { description: { story: 'Tab navigation that adjusts column count based on available screen space.' } }
  }
};

export const CompleteResponsiveShowcase: StoryObj = {
  render: () => <ResponsiveDemosShowcase />,
  parameters: {
    docs: { description: { story: 'Complete responsive design showcase with all components and best practices.' } }
  }
};
