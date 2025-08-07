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
  EnhancedCard,
  EnhancedButton,
  TextField,
  MultiSelect,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Calendar,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Chart,
  Sidebar,
  useMobile,
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
  title: 'Design System/Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Design System Showcase

Real-world examples and patterns demonstrating how components work together in practical applications.

## Features

- **Dashboard Layout**: Complete dashboard with navigation and content areas
- **User Profile**: Profile management interface
- **Data Management**: Table with actions and filters
- **Settings Panel**: Configuration interface
- **Notification Center**: User notification system
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Dashboard Layout
export const DashboardLayout: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">FinVision</span>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your projects today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  You have 3 new notifications today.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        John Doe
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created a new report
                      </p>
                    </div>
                    <Badge variant="secondary">2 min ago</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Jane Smith
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Updated financial model
                      </p>
                    </div>
                    <Badge variant="secondary">5 min ago</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Mike Johnson
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Added new data source
                      </p>
                    </div>
                    <Badge variant="secondary">10 min ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  ),
};

// User Profile
export const UserProfile: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/avatars/01.png" alt="@user" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">John Doe</CardTitle>
                <CardDescription>Senior Financial Analyst</CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge>Admin</Badge>
                  <Badge variant="secondary">Premium</Badge>
                </div>
              </div>
              <div className="ml-auto">
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input value="John" disabled />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input value="Doe" disabled />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value="john.doe@company.com" disabled />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value="+1 (555) 123-4567" disabled />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <Switch id="notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing">Marketing Emails</Label>
                    <Switch id="marketing" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor">
                      Two-Factor Authentication
                    </Label>
                    <Switch id="two-factor" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form>
                  <div className="space-y-4">
                    <FormField
                      name="current-password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="new-password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="confirm-password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Update Password</Button>
                  </div>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Login</TableCell>
                      <TableCell>Logged in from Chrome on Windows</TableCell>
                      <TableCell>2 minutes ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Report Created</TableCell>
                      <TableCell>Created "Q4 Financial Summary"</TableCell>
                      <TableCell>1 hour ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Data Upload</TableCell>
                      <TableCell>Uploaded "sales_data_2024.xlsx"</TableCell>
                      <TableCell>3 hours ago</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

// Data Management
export const DataManagement: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Management</h1>
            <p className="text-muted-foreground">
              Manage your financial data and reports
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Data
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expenses">Expenses</SelectItem>
                    <SelectItem value="assets">Assets</SelectItem>
                    <SelectItem value="liabilities">Liabilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Search</Label>
                <Input placeholder="Search data..." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Data</CardTitle>
            <CardDescription>
              A list of your financial data entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Q4 Revenue Report
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Revenue</Badge>
                  </TableCell>
                  <TableCell>$125,000</TableCell>
                  <TableCell>2024-01-15</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Marketing Expenses
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Expenses</Badge>
                  </TableCell>
                  <TableCell>-$15,000</TableCell>
                  <TableCell>2024-01-14</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-500">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Asset Inventory</TableCell>
                  <TableCell>
                    <Badge variant="outline">Assets</Badge>
                  </TableCell>
                  <TableCell>$500,000</TableCell>
                  <TableCell>2024-01-13</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing 1 to 3 of 3 results
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Settings Panel
export const SettingsPanel: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your general account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      name="first-name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="last-name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">Eastern Time</SelectItem>
                            <SelectItem value="pst">Pacific Time</SelectItem>
                            <SelectItem value="gmt">GMT</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Changes</Button>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="two-factor" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out after inactivity
                      </p>
                    </div>
                    <Switch id="session-timeout" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="login-notifications">
                        Login Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified of new login attempts
                      </p>
                    </div>
                    <Switch id="login-notifications" defaultChecked />
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Password</Label>
                  <Button variant="outline" className="mt-2">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in browser
                      </p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <Switch id="marketing-emails" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>
                  Manage your billing and subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Current Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      Pro Plan - $29/month
                    </p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>•••• •••• •••• 4242</span>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Billing History</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Jan 15, 2024</TableCell>
                        <TableCell>Pro Plan - Monthly</TableCell>
                        <TableCell>$29.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dec 15, 2023</TableCell>
                        <TableCell>Pro Plan - Monthly</TableCell>
                        <TableCell>$29.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

// Notification Center
export const NotificationCenter: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your latest notifications
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notification Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button variant="default">All</Button>
              <Button variant="outline">Unread</Button>
              <Button variant="outline">Important</Button>
              <Button variant="outline">System</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {/* Unread Notification */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      New Report Available
                    </p>
                    <span className="text-sm text-gray-500">2 minutes ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Your Q4 financial report is ready for review.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button size="sm">View Report</Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notification */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Data Sync Warning
                    </p>
                    <span className="text-sm text-gray-500">1 hour ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Some data sources failed to sync. Please check your
                    connections.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button size="sm" variant="outline">
                      Check Status
                    </Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Notification */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-gray-400 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      System Maintenance
                    </p>
                    <span className="text-sm text-gray-500">3 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Scheduled maintenance completed successfully. All systems
                    are operational.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Notification */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Export Completed
                    </p>
                    <span className="text-sm text-gray-500">5 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Your financial data export has been completed and is ready
                    for download.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button size="sm">Download</Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline">Load More Notifications</Button>
        </div>
      </div>
    </div>
  ),
};
