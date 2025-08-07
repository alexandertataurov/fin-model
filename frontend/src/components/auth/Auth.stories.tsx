import type { Meta, StoryObj } from '@storybook/react';
// import ForgotPasswordForm from './ForgotPasswordForm';
// import ResetPasswordForm from './ResetPasswordForm';
// import EmailVerification from './EmailVerification';
// import { BiometricLogin } from './BiometricLogin';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

const meta: Meta = {
  title: 'Auth',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Authentication Components

A comprehensive set of authentication components for the FinVision platform. These components handle user registration, login, password management, and account verification.

## Components

- **LoginForm**: Primary authentication interface
- **RegisterForm**: New user registration
- **ForgotPasswordForm**: Password reset initiation
- **ResetPasswordForm**: Password reset completion
- **EmailVerification**: Account email verification
- **BiometricLogin**: Biometric authentication (when supported)

## Key Features

- **Security**: Input validation and secure handling
- **Accessibility**: Full keyboard navigation and screen readers
- **Responsive**: Works on all device sizes
- **Error Handling**: Clear validation messages
- **Progressive Enhancement**: Graceful fallbacks

## Usage in FinVision

Authentication is required for accessing financial data and modeling features.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginForm: Story = {
  render: function LoginFormStory() {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your FinVision account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="h-4 w-4" />
              <span>Remember me</span>
            </label>
            <Button variant="link" className="p-0 h-auto text-sm">
              Forgot password?
            </Button>
          </div>

          <Button className="w-full" size="lg">
            Sign In
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" className="p-0 h-auto">
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete login form with email, password, and remember me functionality.',
      },
    },
  },
};

export const RegisterForm: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Get started with FinVision today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Your company name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john.doe@company.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
          />
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters with uppercase, lowercase, and numbers
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
          />
        </div>

        <div className="flex items-start space-x-2">
          <input type="checkbox" className="h-4 w-4 mt-1" />
          <p className="text-sm text-muted-foreground">
            I agree to the{' '}
            <Button variant="link" className="p-0 h-auto text-sm">
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button variant="link" className="p-0 h-auto text-sm">
              Privacy Policy
            </Button>
          </p>
        </div>

        <Button className="w-full" size="lg">
          Create Account
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" className="p-0 h-auto">
            Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User registration form with validation and terms acceptance.',
      },
    },
  },
};

export const ForgotPasswordStory: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resetEmail">Email Address</Label>
          <Input id="resetEmail" type="email" placeholder="Enter your email" />
        </div>

        <Button className="w-full">Send Reset Link</Button>

        <div className="text-center">
          <Button variant="link" className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Forgot password form for initiating password reset.',
      },
    },
  },
};

export const ResetPasswordStory: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Set New Password</CardTitle>
        <CardDescription>
          Choose a strong password for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <Input
            id="confirmNewPassword"
            type="password"
            placeholder="Confirm new password"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Password requirements:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>At least 8 characters</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>One uppercase letter</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-muted rounded-full"></span>
              <span>One number</span>
            </li>
          </ul>
        </div>

        <Button className="w-full">Update Password</Button>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Password reset form with requirements validation.',
      },
    },
  },
};

export const EmailVerificationStory: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verify Your Email</CardTitle>
        <CardDescription>
          We sent a verification code to john.doe@company.com
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input
            id="verificationCode"
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="text-center text-lg font-mono"
          />
        </div>

        <Button className="w-full">Verify Email</Button>

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the code?{' '}
          <Button variant="link" className="p-0 h-auto">
            Resend
          </Button>
        </div>

        <div className="text-center">
          <Button variant="link" className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Email verification form with resend functionality.',
      },
    },
  },
};

export const AuthStates: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      {/* Loading State */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Signing In...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input value="john.doe@company.com" disabled />
            <Input type="password" value="password" disabled />
          </div>
          <Button className="w-full" disabled>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Signing In...
          </Button>
        </CardContent>
      </Card>

      {/* Error State */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">
              Invalid email or password. Please try again.
            </p>
          </div>
          <div className="space-y-2">
            <Input
              value="john.doe@company.com"
              className="border-destructive focus-visible:ring-destructive/20"
            />
            <Input
              type="password"
              placeholder="Password"
              className="border-destructive focus-visible:ring-destructive/20"
            />
          </div>
          <Button className="w-full">Sign In</Button>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Authentication forms in loading and error states.',
      },
    },
  },
};
