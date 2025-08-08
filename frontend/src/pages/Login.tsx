import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/design-system/components/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Input, Checkbox, Alert, AlertDescription } from '@/design-system';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/design-system';
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { BiometricLogin } from '@/components/auth/BiometricLogin';
import { useLoginErrorHandler } from '@/hooks/useLoginErrorHandler';
import { componentStyles } from '@/design-system/utils/designSystem';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password should be of minimum 8 characters length'),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useLoginErrorHandler();
  const hasRedirectedRef = useRef(false);

  // Redirect once if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
    if (!isAuthenticated) {
      hasRedirectedRef.current = false;
    }
  }, [isAuthenticated, authLoading, navigate, location.state]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await login(
        values.email,
        values.password,
        values.rememberMe
      );

      if (success && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
      if (!success) {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { status?: number; data?: { detail?: string } };
      };
      if (error.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (error.response?.status === 423) {
        setError(
          'Account is locked due to multiple failed login attempts. Please try again later.'
        );
      } else if (error.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else if (error.response?.data?.detail === 'Email not verified') {
        setError('Please verify your email address before logging in.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!window.PublicKeyCredential) {
      handleError({
        type: 'security',
        message: 'Biometric authentication is not supported on this device.',
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Biometric login logic would go here
    } catch (error) {
      setError('Biometric authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className={componentStyles.heading.h2}>Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your FinVision account to continue
          </p>
        </div>

        {/* Show loading spinner while checking authentication */}
        {authLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Checking authentication...
            </span>
          </div>
        ) : (
          /* Login Card */
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold text-center">
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your email"
                              type="email"
                              autoComplete="email"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              autoComplete="current-password"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Button variant="link" size="sm" asChild>
                      <RouterLink to="/forgot-password">
                        Forgot password?
                      </RouterLink>
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-4 py-1 text-muted-foreground">
                        or
                      </span>
                    </div>
                  </div>

                  <BiometricLogin
                    onBiometricLogin={handleBiometricLogin}
                    isLoading={isLoading}
                  />

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <RouterLink
                        to="/register"
                        className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                      >
                        Sign up here
                      </RouterLink>
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 FinVision. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
