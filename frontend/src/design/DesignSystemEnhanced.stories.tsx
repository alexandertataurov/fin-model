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
  title: 'Design System/Enhanced',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Enhanced Design System Components

Advanced components and patterns for complex user interfaces.

## Features

- **Interactive Components**: Advanced form controls and data entry
- **Layout Patterns**: Resizable panels, command palettes, and navigation
- **Data Visualization**: Charts, tables, and progress indicators
- **User Feedback**: Enhanced alerts, notifications, and status indicators
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

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

        <Separator className="my-8" />

        {/* Multi Select */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Multi Select</h3>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Select Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiSelect
                options={[
                  { value: 'finance', label: 'Finance' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'hr', label: 'Human Resources' },
                  { value: 'it', label: 'Information Technology' },
                  { value: 'sales', label: 'Sales' },
                ]}
                placeholder="Select multiple options"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

// Advanced UI
export const AdvancedUI: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Advanced UI Components</h2>
        
        {/* Resizable Panels */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Resizable Panels</h3>
          <ResizablePanelGroup direction="horizontal" className="min-h-[400px] rounded-lg border">
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Sidebar</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Main Content</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <Separator className="my-8" />

        {/* Command Palette */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Command Palette</h3>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Search Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <Search className="mr-2 h-4 w-4" />
                      <span>Search</span>
                    </CommandItem>
                    <CommandItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
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

// Data Visualization
export const DataVisualization: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Data Visualization</h2>
        
        {/* Enhanced Tables */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Enhanced Tables</h3>
          <Table>
            <TableCaption>A list of recent transactions with enhanced features.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
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
                <TableCell>
                  <Badge className="bg-green-500">Completed</Badge>
                </TableCell>
                <TableCell className="text-right">-$125.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-14</TableCell>
                <TableCell>Client Payment</TableCell>
                <TableCell>
                  <Badge className="bg-blue-500">Income</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-yellow-500">Pending</Badge>
                </TableCell>
                <TableCell className="text-right">+$2,500.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-13</TableCell>
                <TableCell>Software License</TableCell>
                <TableCell>
                  <Badge variant="outline">Expenses</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-red-500">Failed</Badge>
                </TableCell>
                <TableCell className="text-right">-$89.99</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Separator className="my-8" />

        {/* Progress Indicators */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Progress Indicators</h3>
          <div className="space-y-4">
            <div>
              <Label>Upload Progress</Label>
              <Progress value={65} className="w-full" />
            </div>
            <div>
              <Label>Processing Status</Label>
              <Progress value={85} className="w-full" />
            </div>
            <div>
              <Label>System Load</Label>
              <Progress value={45} className="w-full" />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Loading States */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Loading States</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-12 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Interactive Elements
export const InteractiveElements: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-8">Interactive Elements</h2>
        
        {/* Enhanced Buttons */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Enhanced Buttons</h3>
          <div className="flex gap-4 flex-wrap">
            <EnhancedButton>Enhanced Button</EnhancedButton>
            <EnhancedButton variant="secondary">Secondary</EnhancedButton>
            <EnhancedButton variant="outline">Outline</EnhancedButton>
            <EnhancedButton variant="ghost">Ghost</EnhancedButton>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Enhanced Cards */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Enhanced Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EnhancedCard>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Monthly revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </EnhancedCard>
            <EnhancedCard>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
                <CardDescription>Active subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </EnhancedCard>
            <EnhancedCard>
              <CardHeader>
                <CardTitle>Sales</CardTitle>
                <CardDescription>Total sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </EnhancedCard>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Advanced Inputs */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Advanced Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Enhanced Text Field</Label>
              <TextField
                placeholder="Enter text with validation"
                error="This field is required"
              />
            </div>
            <div className="space-y-2">
              <Label>Multi Select</Label>
              <MultiSelect
                options={[
                  { value: 'finance', label: 'Finance' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'hr', label: 'Human Resources' },
                ]}
                placeholder="Select multiple options"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}; 