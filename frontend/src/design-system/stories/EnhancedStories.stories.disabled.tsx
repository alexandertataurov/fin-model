import type { Meta } from '@storybook/react'; // Only import what is necessary
import { useState } from 'react';
import {
    Button,
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Alert,
    AlertDescription,
    Progress,
    Skeleton,
    Separator,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/design-system';

// Mock data for realistic previews
const mockUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', avatar: 'AJ' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Inactive', avatar: 'BS' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Manager', status: 'Active', avatar: 'CD' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', role: 'User', status: 'Pending', avatar: 'DW' },
];

const mockProducts = [
    { id: 1, name: 'Premium Widget', price: 99.99, stock: 45, category: 'Electronics', rating: 4.8 },
    { id: 2, name: 'Basic Widget', price: 29.99, stock: 120, category: 'Electronics', rating: 4.2 },
    { id: 3, name: 'Deluxe Widget', price: 199.99, stock: 12, category: 'Electronics', rating: 4.9 },
];

const mockOrders = [
    { id: 'ORD-001', customer: 'Alice Johnson', total: 299.97, status: 'Delivered', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Bob Smith', total: 89.98, status: 'Processing', date: '2024-01-16' },
    { id: 'ORD-003', customer: 'Carol Davis', total: 199.99, status: 'Shipped', date: '2024-01-17' },
];

// ATOMS - Basic building blocks
const AtomComponents = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Atoms - Basic Building Blocks</h3>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Button Variants</Label>
                <div className="flex gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Badge Variants</Label>
                <div className="flex gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Input States</Label>
                <div className="space-y-2">
                    <Input placeholder="Normal input" />
                    <Input placeholder="Disabled input" disabled />
                    <Input placeholder="Error input" className="border-red-500" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Avatar Examples</Label>
                <div className="flex gap-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                        <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    </div>
);

// MOLECULES - Simple combinations of atoms
const MoleculeComponents = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Molecules - Simple Combinations</h3>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Form Field with Label</Label>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Select with Label</Label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Card with Header</Label>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>Basic user information card</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">This is a simple card component.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-2">
                <Label>Alert with Icon</Label>
                <Alert>
                    <AlertDescription>This is an informational alert message.</AlertDescription>
                </Alert>
            </div>
        </div>
    </div>
);

// ORGANISMS - Complex combinations of molecules
const OrganismComponents = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Organisms - Complex Combinations</h3>

        <div className="space-y-4">
            <div>
                <Label>User Management Table</Label>
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage system users and their roles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarFallback>{user.avatar}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.status === 'Active' ? 'default' :
                                                        user.status === 'Inactive' ? 'destructive' : 'outline'
                                                }
                                            >
                                                {user.status}
                                            </Badge>
                                        </TableCell>
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

            <div>
                <Label>Product Catalog with Filters</Label>
                <Card>
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>Browse and filter available products</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <Label htmlFor="search">Search</Label>
                                <Input id="search" placeholder="Search products..." />
                            </div>
                            <div className="w-48">
                                <Label htmlFor="category">Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="clothing">Clothing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {mockProducts.map((product) => (
                                <Card key={product.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{product.name}</CardTitle>
                                        <CardDescription>{product.category}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-2xl font-bold">${product.price}</span>
                                                <Badge variant={product.stock > 20 ? 'default' : 'destructive'}>
                                                    {product.stock} in stock
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">Rating:</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-medium">{product.rating}</span>
                                                    <span className="text-yellow-500">★</span>
                                                </div>
                                            </div>
                                            <Button className="w-full">Add to Cart</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

// PAGES - Complete page layouts
const PageComponents = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pages - Complete Page Layouts</h3>

        <div className="space-y-4">
            <div>
                <Label>Dashboard Page</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Badge variant="outline">+12%</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2,350</div>
                            <p className="text-xs text-muted-foreground">+180 from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <Badge variant="outline">+8%</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231</div>
                            <p className="text-xs text-muted-foreground">+$2,500 from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                            <Badge variant="outline">+5%</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-xs text-muted-foreground">+50 from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                            <Badge variant="outline">+2%</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3.2%</div>
                            <p className="text-xs text-muted-foreground">+0.1% from last month</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest customer orders and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell>${order.total}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.status === 'Delivered' ? 'default' :
                                                        order.status === 'Shipped' ? 'secondary' : 'outline'
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{order.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

// FLOWS - User journey sequences
const FlowComponents = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        department: ''
    });

    const steps = [
        { id: 1, title: 'Basic Information', description: 'Enter user details' },
        { id: 2, title: 'Role Assignment', description: 'Set user permissions' },
        { id: 3, title: 'Review & Confirm', description: 'Verify information' },
        { id: 4, title: 'Success', description: 'User created successfully' }
    ];

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Flows - User Journey Sequences</h3>

            <div>
                <Label>User Onboarding Flow</Label>
                <Card>
                    <CardHeader>
                        <CardTitle>Create New User</CardTitle>
                        <CardDescription>Step-by-step user creation process</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Progress Steps */}
                        <div className="flex items-center justify-between mb-6">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step.id <= currentStep
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {step.id < currentStep ? '✓' : step.id}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-16 h-0.5 mx-2 ${step.id < currentStep ? 'bg-primary' : 'bg-muted'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        <div className="space-y-4">
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="role">User Role</Label>
                                        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Administrator</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="user">Regular User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="department">Department</Label>
                                        <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="engineering">Engineering</SelectItem>
                                                <SelectItem value="marketing">Marketing</SelectItem>
                                                <SelectItem value="sales">Sales</SelectItem>
                                                <SelectItem value="hr">Human Resources</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg bg-muted/50">
                                        <h4 className="font-medium mb-2">Review Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><strong>Name:</strong> {formData.name}</div>
                                            <div><strong>Email:</strong> {formData.email}</div>
                                            <div><strong>Role:</strong> {formData.role}</div>
                                            <div><strong>Department:</strong> {formData.department}</div>
                                        </div>
                                    </div>
                                    <Alert>
                                        <AlertDescription>
                                            Please review the information above. Click "Create User" to proceed or "Back" to make changes.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <span className="text-2xl text-green-600">✓</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-green-600">User Created Successfully!</h4>
                                        <p className="text-sm text-muted-foreground">
                                            The new user account has been created and an invitation email has been sent.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between pt-4">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                            >
                                Back
                            </Button>

                            {currentStep < 4 ? (
                                <Button onClick={handleNext}>
                                    {currentStep === 3 ? 'Create User' : 'Next'}
                                </Button>
                            ) : (
                                <Button onClick={() => setCurrentStep(1)}>
                                    Create Another User
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// EDGE CASES - Error, loading, and empty states
const EdgeCaseComponents = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Edge Cases - Error, Loading & Empty States</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label>Loading States</Label>
                <Card>
                    <CardHeader>
                        <CardTitle>Loading User Profile</CardTitle>
                        <CardDescription>Show while data is being fetched</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-[75%]" />
                        </div>
                        <div className="flex space-x-2">
                            <Skeleton className="h-10 w-[100px]" />
                            <Skeleton className="h-10 w-[100px]" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Label>Empty States</Label>
                <Card>
                    <CardHeader>
                        <CardTitle>No Results Found</CardTitle>
                        <CardDescription>When search returns no data</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-muted-foreground">🔍</span>
                        </div>
                        <h4 className="text-lg font-medium mb-2">No users found</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Try adjusting your search criteria or create a new user.
                        </p>
                        <Button>Create New User</Button>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Label>Error States</Label>
                <Card>
                    <CardHeader>
                        <CardTitle>Failed to Load Data</CardTitle>
                        <CardDescription>When API calls fail</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-red-600">⚠️</span>
                        </div>
                        <h4 className="text-lg font-medium mb-2 text-red-600">Something went wrong</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            We couldn't load the user data. Please try again.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button variant="outline">Go Back</Button>
                            <Button>Try Again</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Label>Progress Indicators</Label>
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Progress</CardTitle>
                        <CardDescription>Show progress for long-running operations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Uploading files...</span>
                                <span>75%</span>
                            </div>
                            <Progress value={75} className="w-full" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Processing data...</span>
                                <span>45%</span>
                            </div>
                            <Progress value={45} className="w-full" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Finalizing...</span>
                                <span>90%</span>
                            </div>
                            <Progress value={90} className="w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

const meta: Meta = {
    title: 'Design System/Enhanced Stories',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Comprehensive showcase of atomic design pattern implementation with real data mocks and edge-case scenarios. Demonstrates Atoms → Molecules → Organisms → Pages → Flows hierarchy with realistic examples.'
            }
        },
        layout: 'padded',
    },
};

export default meta;
type StoryObj = StoryObj<typeof meta>;

export const Atoms: StoryObj = {
    render: () => <AtomComponents />,
    parameters: {
        docs: { description: { story: 'Basic building blocks (buttons, badges, inputs, avatars) that form the foundation of the design system.' } }
    }
};

export const Molecules: StoryObj = {
    render: () => <MoleculeComponents />,
    parameters: {
        docs: { description: { story: 'Simple combinations of atoms (form fields, labeled inputs, basic cards) that provide more functionality while maintaining simplicity.' } }
    }
};

export const Organisms: StoryObj = {
    render: () => <OrganismComponents />,
    parameters: {
        docs: { description: { story: 'Complex combinations of molecules (data tables, product catalogs) that form distinct sections of an interface.' } }
    }
};

export const Pages: StoryObj = {
    render: () => <PageComponents />,
    parameters: {
        docs: { description: { story: 'Complete page layouts (dashboard, user management) that combine multiple organisms into full user interfaces.' } }
    }
};

export const Flows: StoryObj = {
    render: () => <FlowComponents />,
    parameters: {
        docs: { description: { story: 'User journey sequences (onboarding flow) that guide users through multi-step processes with clear progression and feedback.' } }
    }
};

export const EdgeCases: StoryObj = {
    render: () => <EdgeCaseComponents />,
    parameters: {
        docs: { description: { story: 'Error states, loading indicators, empty states, and progress bars that handle various edge cases gracefully.' } }
    }
};

export const CompleteShowcase: StoryObj = {
    render: () => (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Enhanced Stories Showcase</h1>
                <p className="text-lg text-muted-foreground">
                    Complete atomic design pattern implementation with real-world examples
                </p>
            </div>

            <Separator />

            <AtomComponents />
            <Separator />
            <MoleculeComponents />
            <Separator />
            <OrganismComponents />
            <Separator />
            <PageComponents />
            <Separator />
            <FlowComponents />
            <Separator />
            <EdgeCaseComponents />
        </div>
    ),
    parameters: {
        docs: { description: { story: 'Complete showcase of all atomic design levels with comprehensive examples, real data mocks, and edge-case handling.' } }
    }
};
