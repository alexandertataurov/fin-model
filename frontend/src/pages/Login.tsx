import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/design/components/ui/form';
import { Mail, Lock, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { BiometricLogin } from '@/components/auth/BiometricLogin';
import { useLoginErrorHandler } from '@/hooks/useLoginErrorHandler';

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
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useLoginErrorHandler();

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

      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
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

      // In a real implementation, you would:
      // 1. Get challenge from server
      // 2. Call navigator.credentials.get() with WebAuthn options
      // 3. Send credential to server for verification
      // For demo purposes, we'll show a placeholder

      handleError({
        type: 'authentication',
        message:
          'Biometric authentication is not yet configured. Please use email and password.',
      });
    } catch (err) {
      handleError({
        type: 'security',
        message: 'Biometric authentication failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card/95 backdrop-blur-md border-border/20 shadow-2xl">
          <div className="p-6 pb-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">FinVision</h1>
              <p className="text-muted-foreground">
                Financial Modeling & Analysis Platform
              </p>
            </div>
          </div>

          <CardContent className="space-y-6 pt-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            autoFocus
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
                          <Lock className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                          <PasswordInput
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
                    <span className="bg-background px-4 py-1 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

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

                <BiometricLogin
                  onBiometricLogin={handleBiometricLogin}
                  isLoading={isLoading}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-white/80">
            © 2024 FinVision. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
