import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Progress,
  Skeleton,
  Separator,
  Textarea,
  Checkbox,
  Slider,
  Switch,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Calendar,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './components/ui';
import { 
  Plus, 
  Download, 
  Trash2, 
  Edit, 
  User, 
  Settings, 
  Bell, 
  Search,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Star,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  RotateCcw,
  Save,
  Upload,
  Copy,
  ExternalLink,
  Maximize2,
  Minimize2,
  Move,
  Grid,
  List,
  Layout,
  Palette,
  Type,
  Image,
  Video,
  FileText,
  Folder,
  Database,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Headphones,
  Speaker,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Printer,
  Scanner,
  Keyboard,
  Mouse,
  HardDrive,
  Cpu,
  Memory,
  Network,
  Globe,
  Map,
  Navigation,
  Compass,
  Flag,
  Home,
  Building,
  Store,
  Factory,
  Warehouse,
  Office,
  School,
  Hospital,
  Bank,
  Restaurant,
  Coffee,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Package,
  Truck,
  Plane,
  Train,
  Bus,
  Car,
  Bike,
  Walk,
  Run,
  Swim,
  Gamepad2,
  Music,
  Film,
  Tv,
  Radio,
  Newspaper,
  Book,
  Library,
  GraduationCap,
  Briefcase,
  Workflow,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Code,
  Terminal,
  Database,
  Layers,
  Box,
  Cube,
  Package,
  Archive,
  File,
  FolderOpen,
  FolderPlus,
  FilePlus,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  FilePresentation,
  FileDocument,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileZip,
  FileCsv,
  FileJson,
  FileXml,
  FileYaml,
  FileMarkdown,
  FileHtml,
  FileCss,
  FileJs,
  FileTs,
  FileReact,
  FileVue,
  FileAngular,
  FileSvelte,
  FilePhp,
  FilePython,
  FileJava,
  FileCpp,
  FileC,
  FileGo,
  FileRust,
  FileSwift,
  FileKotlin,
  FileScala,
  FileRuby,
  FilePhp,
  FilePerl,
  FileBash,
  FileDocker,
  FileKubernetes,
  FileTerraform,
  FileAnsible,
  FileJenkins,
  FileGithub,
  FileGitlab,
  FileBitbucket,
  FileJira,
  FileConfluence,
  FileSlack,
  FileDiscord,
  FileTeams,
  FileZoom,
  FileSkype,
  FileWhatsapp,
  FileTelegram,
  FileSignal,
  FileWechat,
  FileLine,
  FileKakao,
  FileViber,
  FileSnapchat,
  FileTiktok,
  FileInstagram,
  FileFacebook,
  FileTwitter,
  FileLinkedin,
  FileYoutube,
  FileTwitch,
  FileReddit,
  FilePinterest,
  FileTumblr,
  FileMedium,
  FileDev,
  FileStackoverflow,
  FileQuora,
  FileProducthunt,
  FileBehance,
  FileDribbble,
  FileFigma,
  FileSketch,
  FileAdobe,
  FilePhotoshop,
  FileIllustrator,
  FileIndesign,
  FilePremiere,
  FileAftereffects,
  FileLightroom,
  FileXd,
  FileInvision,
  FileZeplin,
  FileAbstract,
  FileNotion,
  FileAirtable,
  FileAsana,
  FileTrello,
  FileMonday,
  FileClickup,
  FileLinear,
  FileFigma,
  FileSketch,
  FileAdobe,
  FilePhotoshop,
  FileIllustrator,
  FileIndesign,
  FilePremiere,
  FileAftereffects,
  FileLightroom,
  FileXd,
  FileInvision,
  FileZeplin,
  FileAbstract,
  FileNotion,
  FileAirtable,
  FileAsana,
  FileTrello,
  FileMonday,
  FileClickup,
  FileLinear,
} from 'lucide-react';

const meta: Meta = {
  title: 'Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# FinVision Design System

A comprehensive design system built with React, TypeScript, and Tailwind CSS. This system provides consistent, accessible, and reusable components for the FinVision financial modeling platform.

## Design Principles

- **Consistency**: Unified visual language across all components
- **Accessibility**: WCAG 2.1 AA compliant components
- **Flexibility**: Customizable variants and themes
- **Performance**: Optimized for production use
- **Developer Experience**: Type-safe props and comprehensive documentation

## Component Categories

1. **Foundation**: Basic building blocks (Button, Input, Label)
2. **Layout**: Structural components (Card, Tabs, Accordion)
3. **Navigation**: Interactive navigation elements
4. **Feedback**: User feedback components (Alert, Toast, Progress)
5. **Data Display**: Data presentation components (Table, Badge, Avatar)
6. **Overlay**: Modal and popup components (Dialog, Popover, Tooltip)
7. **Forms**: Form components and validation
8. **Advanced**: Complex UI patterns and interactions
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Foundation Components
export const Foundation: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Foundation Components</h2>
        
        {/* Buttons */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Buttons</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium mb-3">Variants</h4>
              <div className="flex gap-4 flex-wrap">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="info">Info</Button>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-3">Sizes</h4>
              <div className="flex gap-4 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-3">With Icons</h4>
              <div className="flex gap-4 flex-wrap">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button variant="secondary">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Inputs */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter password" />
              </div>
              <div>
                <Label htmlFor="textarea">Description</Label>
                <Textarea id="textarea" placeholder="Enter description" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="select">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Volume</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Notifications</Label>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Form Controls */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Form Controls</h3>
          <div className="flex gap-6 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <div className="w-48">
              <Label>Volume</Label>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Layout Components
export const Layout: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Layout Components</h2>
        
        {/* Cards */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>Simple card with content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is a basic card component with header and content.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Click to interact</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Dashed Border</CardTitle>
                <CardDescription>Special styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card with dashed border for special use cases.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Tabs */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Tabs</h3>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This is the overview tab content.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Analytics data and charts would go here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Generated reports and exports.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Configuration and preferences.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="my-8" />

        {/* Accordion */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Accordion</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is FinVision?</AccordionTrigger>
              <AccordionContent>
                FinVision is a comprehensive financial modeling platform that helps businesses
                create, analyze, and share financial models with advanced analytics and reporting.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                Start by uploading your financial data, then use our modeling tools to create
                scenarios and generate reports. Our platform guides you through each step.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What file formats are supported?</AccordionTrigger>
              <AccordionContent>
                We support Excel (.xlsx, .xls), CSV, and JSON formats. Our platform can handle
                complex financial data structures and automatically validate your inputs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  ),
};

// Forms
export const Forms: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Form Components</h2>
        
        {/* Basic Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Basic Form</h3>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>User Registration</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <Form>
                <div className="space-y-4">
                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Register</Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Advanced Form Controls */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Advanced Form Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Radio Group</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="option-one">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Option One</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Option Two</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-three" id="option-three" />
                    <Label htmlFor="option-three">Option Three</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>OTP Input</CardTitle>
              </CardHeader>
              <CardContent>
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Data Display
export const DataDisplay: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Data Display Components</h2>
        
        {/* Tables */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Tables</h3>
          <Table>
            <TableCaption>A list of recent transactions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-01-15</TableCell>
                <TableCell>Office Supplies</TableCell>
                <TableCell>
                  <Badge variant="outline">Expenses</Badge>
                </TableCell>
                <TableCell className="text-right">-$125.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-14</TableCell>
                <TableCell>Client Payment</TableCell>
                <TableCell>
                  <Badge className="bg-green-500">Income</Badge>
                </TableCell>
                <TableCell className="text-right">+$2,500.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-13</TableCell>
                <TableCell>Software License</TableCell>
                <TableCell>
                  <Badge variant="outline">Expenses</Badge>
                </TableCell>
                <TableCell className="text-right">-$89.99</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Separator className="my-8" />

        {/* Avatars */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Avatars</h3>
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Badges */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Badges</h3>
          <div className="flex gap-2 flex-wrap">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="bg-green-500">Success</Badge>
            <Badge className="bg-yellow-500">Warning</Badge>
            <Badge className="bg-blue-500">Info</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Feedback
export const Feedback: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Feedback Components</h2>
        
        {/* Alerts */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Alerts</h3>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational alert for general updates.
              </AlertDescription>
            </Alert>
            <Alert className="border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                This is an error alert for critical issues.
              </AlertDescription>
            </Alert>
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                This is a success alert for completed actions.
              </AlertDescription>
            </Alert>
            <Alert className="border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This is a warning alert for important notices.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Progress and Loading */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Progress & Loading</h3>
          <div className="space-y-4">
            <div>
              <Label>Upload Progress</Label>
              <Progress value={65} className="w-full" />
            </div>
            <div className="space-y-2">
              <Label>Loading States</Label>
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Overlays
export const Overlays: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Overlay Components</h2>
        
        {/* Dialogs */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Dialogs</h3>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="john@example.com" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Tooltips and Popovers */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Tooltips & Popovers</h3>
          <div className="flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover for tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a helpful tooltip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Click for popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Popover Title</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a popover with additional information and actions.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Action 1</Button>
                    <Button size="sm" variant="outline">Action 2</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Dropdown Menus */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Dropdown Menus</h3>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Advanced
export const Advanced: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Advanced Components</h2>
        
        {/* Calendar */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Calendar</h3>
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Date Picker</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Carousel */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Carousel</h3>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <Separator className="my-8" />

        {/* Pagination */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Pagination</h3>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  ),
}; 