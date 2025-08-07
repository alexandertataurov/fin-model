import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/Alert';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Bell,
  Shield,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  Download,
  Upload,
  Trash2,
  Edit,
  Eye,
  Share2,
  Star,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  MoreVertical,
  Grid,
  List,
  Maximize,
  Minimize,
  RotateCcw,
  RefreshCw,
  Save,
  Copy,
  Link,
  Unlink,
  Lock,
  Unlock,
  Key,
  User,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  MapPin,
  Globe,
  Wifi,
  WifiOff,
  Bluetooth,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Video,
  VideoOff,
  Image,
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  HardDrive,
  Database,
  Server,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Moon,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  Snowflake,
  Cloudy,
  PartlyCloudy,
  CloudFog,
  Sunrise,
  Sunset,
  Activity,
  Target,
  Award,
  Trophy,
  Medal,
  Crown,
  Flag,
  Sword,
  Sparkles,
  Diamond,
  Gem,
  Coins,
  CreditCard,
  Wallet,
  PiggyBank,
  Banknote,
  Receipt,
  Calculator,
  PieChart,
  BarChart,
  LineChart,
  TrendingDown,
  Equal,
  Divide,
  Percent,
  AtSign,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  Ethereum,
  Litecoin,
  Dogecoin,
  Monero,
  Ripple,
  Stellar,
  Cardano,
  Polkadot,
  Chainlink,
  Uniswap,
  PancakeSwap,
  SushiSwap,
  Curve,
  Aave,
  Compound,
  Maker,
  Yearn,
  Synthetix,
  Balancer,
  Bancor,
  Kyber,
  Loopring,
  ZkSync,
  Polygon,
  Arbitrum,
  Optimism,
  Avalanche,
  Fantom,
  Solana,
  Terra,
  Cosmos,
  Binance,
  Coinbase,
  Kraken,
  Gemini,
  Bitfinex,
  Huobi,
  OKEx,
  KuCoin,
  Bybit,
  FTX,
  Celsius,
  BlockFi,
  Nexo,
  CryptoCom,
  BinanceUS,
  CoinbasePro,
  GeminiActiveTrader,
  KrakenPro,
  BitfinexPro,
  HuobiPro,
  OKExPro,
  KuCoinPro,
  BybitPro,
  FTXPro,
  CelsiusPro,
  BlockFiPro,
  NexoPro,
  CryptoComPro,
} from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: '🎨 Design System/Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Alert Component

A flexible alert component for displaying important messages to users. The Alert component supports various variants and can include icons, titles, and descriptions.

## Key Features

- **🎨 Multiple Variants**: Default, destructive, success, warning, and info variants
- **📱 Responsive**: Adapts to different screen sizes
- **♿ Accessible**: Built with proper ARIA attributes
- **🎭 Icon Support**: Optional icons for visual context
- **⚡ Performance**: Lightweight and optimized
- **🎯 Composition**: Flexible title and description structure

## Usage

\`\`\`tsx
import { Alert, AlertDescription, AlertTitle } from '@/design-system';
import { Info } from 'lucide-react';

<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This is an informational alert with default styling.
  </AlertDescription>
</Alert>
\`\`\`

## Design Principles

1. **Clarity**: Clear visual hierarchy and readable content
2. **Consistency**: Unified design patterns across all alerts
3. **Context**: Appropriate use of colors and icons
4. **Accessibility**: Full keyboard navigation and screen reader support
5. **Performance**: Optimized rendering and minimal bundle impact
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
      description: 'The visual variant of the alert',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Alert
export const Basic: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a basic alert with default styling and an informational message.
      </AlertDescription>
    </Alert>
  ),
};

// Success Alert
export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully. All data has been updated.
      </AlertDescription>
    </Alert>
  ),
};

// Warning Alert
export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Please review your input before proceeding. Some fields may need
        attention.
      </AlertDescription>
    </Alert>
  ),
};

// Destructive Alert
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        There was an error processing your request. Please try again.
      </AlertDescription>
    </Alert>
  ),
};

// Info Alert
export const InfoAlert: Story = {
  render: () => (
    <Alert variant="info">
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        New features are available. Check out the latest updates.
      </AlertDescription>
    </Alert>
  ),
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>This is the default alert variant.</AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Operation completed successfully.</AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please review the information before proceeding.
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Here's some helpful information.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

// Financial Alerts
export const FinancialAlerts: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="success">
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Portfolio Performance</AlertTitle>
        <AlertDescription>
          Your portfolio has increased by 12.5% this month, outperforming the
          market average.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <DollarSign className="h-4 w-4" />
        <AlertTitle>Budget Alert</AlertTitle>
        <AlertDescription>
          You're approaching your monthly budget limit. Consider reviewing your
          expenses.
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <BarChart3 className="h-4 w-4" />
        <AlertTitle>Market Update</AlertTitle>
        <AlertDescription>
          New market data is available. Refresh your dashboard to see the latest
          trends.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Transaction Failed</AlertTitle>
        <AlertDescription>
          The payment transaction could not be processed. Please check your
          payment method.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

// System Alerts
export const SystemAlerts: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertTitle>System Maintenance</AlertTitle>
        <AlertDescription>
          Scheduled maintenance will occur on Sunday from 2:00 AM to 6:00 AM
          EST.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Backup Complete</AlertTitle>
        <AlertDescription>
          Your data has been successfully backed up to the cloud.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <Shield className="h-4 w-4" />
        <AlertTitle>Security Update</AlertTitle>
        <AlertDescription>
          A new security update is available. Please update your application.
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <Zap className="h-4 w-4" />
        <AlertTitle>Performance Boost</AlertTitle>
        <AlertDescription>
          We've optimized the application for better performance.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

// User Alerts
export const UserAlerts: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="success">
        <UserCheck className="h-4 w-4" />
        <AlertTitle>Account Verified</AlertTitle>
        <AlertDescription>
          Your email address has been successfully verified.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <Clock className="h-4 w-4" />
        <AlertTitle>Session Expiring</AlertTitle>
        <AlertDescription>
          Your session will expire in 5 minutes. Please save your work.
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <Users className="h-4 w-4" />
        <AlertTitle>Team Invitation</AlertTitle>
        <AlertDescription>
          You've been invited to join the Financial Analysis team.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <UserX className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this resource.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

// File Alerts
export const FileAlerts: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="success">
        <Download className="h-4 w-4" />
        <AlertTitle>Download Complete</AlertTitle>
        <AlertDescription>
          Your financial report has been downloaded successfully.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <FileText className="h-4 w-4" />
        <AlertTitle>File Size Warning</AlertTitle>
        <AlertDescription>
          The file you're uploading is larger than recommended. This may take
          longer to process.
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <Upload className="h-4 w-4" />
        <AlertTitle>Upload in Progress</AlertTitle>
        <AlertDescription>
          Your file is being uploaded. Please don't close this window.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <Trash2 className="h-4 w-4" />
        <AlertTitle>File Deleted</AlertTitle>
        <AlertDescription>
          The file has been permanently deleted and cannot be recovered.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
