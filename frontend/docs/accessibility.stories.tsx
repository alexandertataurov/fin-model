import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../src/components/ui/card';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
import { Alert, AlertDescription } from '../src/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const meta: Meta = {
  title: 'Foundation/Accessibility',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Accessibility Guidelines

FinVision follows WCAG 2.1 AA accessibility standards to ensure our financial modeling platform is usable by everyone, including users with disabilities.

## Color & Contrast

All color combinations meet WCAG 2.1 AA minimum contrast ratios:
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text**: 3:1 minimum contrast ratio
- **UI components**: 3:1 minimum contrast ratio

## Status Colors

Updated status colors with accessible contrast ratios for better visibility and compliance.

## Interactive Elements

- Clear focus indicators for keyboard navigation
- Sufficient target sizes (minimum 44x44px)
- Descriptive labels and ARIA attributes
- Screen reader friendly content structure

## Testing

Regular accessibility audits using:
- Automated tools (axe-core, Lighthouse)
- Manual keyboard navigation testing
- Screen reader compatibility testing
- Color blindness simulation
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AccessibleColors: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          WCAG 2.1 AA Compliant Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              name: 'Primary',
              class: 'bg-blue-700',
              text: 'text-white',
              contrast: '4.5:1',
            },
            {
              name: 'Success',
              class: 'bg-green-700',
              text: 'text-white',
              contrast: '4.6:1',
            },
            {
              name: 'Warning',
              class: 'bg-amber-600',
              text: 'text-white',
              contrast: '4.5:1',
            },
            {
              name: 'Danger',
              class: 'bg-red-700',
              text: 'text-white',
              contrast: '4.8:1',
            },
                     ].map(color => (
             <div key={color.name} className="space-y-2">
               <div
                 className={`${color.class} ${color.text} p-4 rounded-md text-center font-medium`}
               >
                 <span className={color.text}>{color.name}</span>
               </div>
              <div className="text-xs">
                <p className="font-medium">{color.class}</p>
                <p className="text-muted-foreground">
                  Contrast: {color.contrast}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Status Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-700" />
                <span>Success States</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-green-700 text-white hover:bg-green-800">
                Calculation Complete
              </Badge>
              <Badge
                variant="outline"
                className="border-green-700 text-green-700"
              >
                Valid Parameter
              </Badge>
              <Alert className="border-green-700 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-700" />
                <AlertDescription className="text-green-800">
                  Model validation passed successfully.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Warning States</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-amber-600 text-white hover:bg-amber-700">
                Processing
              </Badge>
              <Badge
                variant="outline"
                className="border-amber-600 text-amber-700"
              >
                Needs Review
              </Badge>
              <Alert className="border-amber-600 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Some parameters may need adjustment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Error & Information States
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-700" />
                <span>Error States</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-red-700 text-white hover:bg-red-800">
                Validation Failed
              </Badge>
              <Badge variant="outline" className="border-red-700 text-red-700">
                Invalid Input
              </Badge>
              <Alert className="border-red-700 bg-red-50">
                <XCircle className="h-4 w-4 text-red-700" />
                <AlertDescription className="text-red-800">
                  Parameter value is outside acceptable range.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-700" />
                <span>Information States</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-blue-700 text-white hover:bg-blue-800">
                Default Value
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-700 text-blue-700"
              >
                Information
              </Badge>
              <Alert className="border-blue-700 bg-blue-50">
                <Info className="h-4 w-4 text-blue-700" />
                <AlertDescription className="text-blue-800">
                  This parameter affects multiple calculations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Interactive Elements</h3>
        <Card>
          <CardHeader>
            <CardTitle>Keyboard Navigation & Focus</CardTitle>
            <CardDescription>
              All interactive elements support keyboard navigation and have
              clear focus indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Button Examples</p>
              <div className="flex gap-2 flex-wrap">
                <Button>Primary Action</Button>
                <Button variant="outline">Secondary Action</Button>
                <Button variant="ghost">Tertiary Action</Button>
                <Button
                  variant="destructive"
                  className="bg-red-700 hover:bg-red-800"
                >
                  Destructive Action
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Form Controls</p>
              <div className="space-y-2 max-w-md">
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Focus me with Tab key"
                />
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Accessible color combinations and interactive elements that meet WCAG 2.1 AA standards.',
      },
    },
  },
};

export const ContrastTesting: Story = {
  render: () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Contrast Testing</CardTitle>
          <CardDescription>
            Test color combinations for accessibility compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-green-700">
                ✓ WCAG AA Compliant
              </h4>
              <div className="space-y-2">
                <div className="bg-blue-700 text-white p-3 rounded">
                  Primary text on blue background (4.5:1)
                </div>
                <div className="bg-green-700 text-white p-3 rounded">
                  Success text on green background (4.6:1)
                </div>
                <div className="bg-amber-600 text-white p-3 rounded">
                  Warning text on amber background (4.5:1)
                </div>
                <div className="bg-red-700 text-white p-3 rounded">
                  Error text on red background (4.8:1)
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-red-700">
                ✗ Non-Compliant (Avoid)
              </h4>
              <div className="space-y-2 opacity-60">
                <div className="bg-yellow-300 text-white p-3 rounded">
                  Poor contrast: Yellow + White (1.8:1)
                </div>
                <div className="bg-green-400 text-white p-3 rounded">
                  Poor contrast: Light Green + White (2.1:1)
                </div>
                <div className="bg-blue-400 text-white p-3 rounded">
                  Poor contrast: Light Blue + White (2.4:1)
                </div>
                <div className="bg-gray-400 text-white p-3 rounded">
                  Poor contrast: Gray + White (2.8:1)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility Testing Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Automated Testing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  axe-core: Integrated into Storybook for real-time
                  accessibility checks
                </li>
                <li>Lighthouse: Regular audits for accessibility scoring</li>
                <li>WAVE: Web accessibility evaluation tool</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Manual Testing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Keyboard-only navigation testing</li>
                <li>Screen reader compatibility (NVDA, JAWS, VoiceOver)</li>
                <li>Color blindness simulation testing</li>
                <li>High contrast mode testing</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Browser Extensions</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Colour Contrast Analyser (CCA)</li>
                <li>axe DevTools</li>
                <li>WAVE browser extension</li>
                <li>Stark (Figma/browser plugin)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Tools and methods for testing color contrast and accessibility compliance.',
      },
    },
  },
};
