import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/Avatar';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Star, 
  Heart,
  Share2,
  MoreHorizontal
} from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component with header, content, and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card stories
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is where you can put any content you want.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardContent className="p-6">
        <p>Simple card with just content.</p>
      </CardContent>
    </Card>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600" />
      <CardHeader>
        <CardTitle>Card with Image</CardTitle>
        <CardDescription>This card has an image placeholder at the top</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content below the image.</p>
      </CardContent>
    </Card>
  ),
};

// Content variations
export const WithStats: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Revenue</span>
          <span className="text-2xl font-bold">$45,231.89</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Growth</span>
          <span className="text-sm text-green-600">+20.1%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Orders</span>
          <span className="text-sm">+2,350</span>
        </div>
      </CardContent>
    </Card>
  ),
};

export const WithList: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm">New user registration</span>
            <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm">File uploaded</span>
            <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="text-sm">System update</span>
            <span className="text-xs text-muted-foreground ml-auto">10m ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Interactive cards
export const Interactive: Story = {
  render: () => (
    <Card className="w-[350px] cursor-pointer transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see the effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects and is clickable.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Project Alpha</CardTitle>
            <CardDescription>Web application development</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>This is a project card with multiple action buttons.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Heart className="mr-2 h-4 w-4" />
          Like
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button size="sm">View Project</Button>
      </CardFooter>
    </Card>
  ),
};

// User profile card
export const UserProfile: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <Avatar className="mx-auto h-16 w-16">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4">John Doe</CardTitle>
        <CardDescription>Senior Developer</CardDescription>
        <div className="flex justify-center space-x-2 mt-2">
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Node.js</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">john.doe@example.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">San Francisco, CA</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Joined March 2023</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Contact</Button>
      </CardFooter>
    </Card>
  ),
};

// Event card
export const EventCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Tech Conference 2024</CardTitle>
            <CardDescription>Annual developer conference</CardDescription>
          </div>
          <Badge variant="outline">Upcoming</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">March 15, 2024</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">9:00 AM - 5:00 PM</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Convention Center, Downtown</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">4.8/5 (120 reviews)</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Add to Calendar</Button>
        <Button>Register Now</Button>
      </CardFooter>
    </Card>
  ),
};

// Product card
export const ProductCard: Story = {
  render: () => (
    <Card className="w-[280px]">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Premium Widget</CardTitle>
        <CardDescription>High-quality widget for all your needs</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">$99.99</span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">4.9</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
};

// Grid layout
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for card 1</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for card 2</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for card 3</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Loading state
export const Loading: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  ),
};
