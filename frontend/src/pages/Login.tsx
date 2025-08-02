import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
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
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            <form onSubmit={formik.handleSubmit} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="email" required>
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={
                      formik.touched.email ? formik.errors.email : undefined
                    }
                    autoComplete="email"
                    autoFocus
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" required>
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password
                        ? formik.errors.password
                        : undefined
                    }
                    autoComplete="current-password"
                    className="pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={handleClickShowPassword}
                    className="absolute right-3 top-[10px] text-muted-foreground hover:text-foreground transition-colors z-10"
                    aria-label="toggle password visibility"
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formik.values.rememberMe}
                    onCheckedChange={checked =>
                      formik.setFieldValue('rememberMe', checked)
                    }
                    aria-label="Remember me"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </Label>
                </div>
                <RouterLink
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  Forgot password?
                </RouterLink>
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
            </form>
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
