import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { checkPasswordStrength } from '../services/authApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { Separator } from '../components/ui/separator';


const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  username: yup
    .string()
    .min(3, 'Username should be at least 3 characters')
    .max(50, 'Username should be less than 50 characters')
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, hyphens, and underscores'
    )
    .required('Username is required'),
  first_name: yup
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name should be less than 50 characters')
    .required('First name is required'),
  last_name: yup
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name should be less than 50 characters')
    .required('Last name is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

interface FormValues {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        await register({
          email: values.email,
          username: values.username,
          first_name: values.first_name,
          last_name: values.last_name,
          password: values.password,
        });

        // If we get here, registration was successful
        setSuccess(
          'Registration successful! Please check your email for verification instructions.'
        );
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: unknown) {
        const error = err as {
          response?: { status?: number; data?: { detail?: string } };
        };
        if (error.response?.status === 400) {
          const detail = error.response?.data?.detail;
          if (detail === 'Email already registered') {
            setError(
              'This email is already registered. Please use a different email or try logging in.'
            );
          } else if (detail === 'Username already taken') {
            setError(
              'This username is already taken. Please choose a different username.'
            );
          } else {
            setError(
              detail ||
                'Registration failed. Please check your information and try again.'
            );
          }
        } else if (error.response?.status === 429) {
          setError('Too many registration attempts. Please try again later.');
        } else if (error.response?.status === 423) {
          setError(
            'Account is locked due to multiple failed registration attempts. Please try again later.'
          );
        } else {
          setError('An error occurred. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const passwordStrength = checkPasswordStrength(formik.values.password);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-card/95 backdrop-blur-md border-border/20 shadow-2xl">
          <div className="p-6 pb-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Join FinVision
              </h1>
              <p className="text-muted-foreground">
                Create your account to start financial modeling
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

              {success && (
                <div
                  className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <Check className="h-4 w-4" />
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" required>
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Enter your first name"
                      value={formik.values.first_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.first_name &&
                        Boolean(formik.errors.first_name)
                      }
                      helperText={
                        formik.touched.first_name
                          ? formik.errors.first_name
                          : undefined
                      }
                      autoComplete="given-name"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" required>
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Enter your last name"
                      value={formik.values.last_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.last_name &&
                        Boolean(formik.errors.last_name)
                      }
                      helperText={
                        formik.touched.last_name
                          ? formik.errors.last_name
                          : undefined
                      }
                      autoComplete="family-name"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

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
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" required>
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username
                        ? formik.errors.username
                        : undefined
                    }
                    autoComplete="username"
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
                    autoComplete="new-password"
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

                {/* Password Strength Indicator */}
                {formik.values.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Password Strength:
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          passwordStrength.strength === 'strong'
                            ? 'bg-green-100 text-green-800'
                            : passwordStrength.strength === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {passwordStrength.strength.toUpperCase()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.strength === 'strong'
                            ? 'bg-green-700'
                            : passwordStrength.strength === 'medium'
                            ? 'bg-amber-600'
                            : 'bg-red-700'
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(passwordStrength.checks).map(
                        ([key, passed]) => {
                          const labels = {
                            length: 'At least 8 characters',
                            uppercase: 'At least one uppercase letter (A–Z)',
                            lowercase: 'At least one lowercase letter (a–z)',
                            number: 'At least one number (0–9)',
                            special: 'At least one special character (!@#$...)',
                          };
                          return (
                            <span
                              key={key}
                              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                passed
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {passed ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                              {labels[key as keyof typeof labels]}
                            </span>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" required>
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    helperText={
                      formik.touched.confirmPassword
                        ? formik.errors.confirmPassword
                        : undefined
                    }
                    autoComplete="new-password"
                    className="pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={handleClickShowConfirmPassword}
                    className="absolute right-3 top-[10px] text-muted-foreground hover:text-foreground transition-colors z-10"
                    aria-label="toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !passwordStrength.isValid}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>

              <Separator className="mb-3" />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="font-bold text-primary hover:underline"
                  >
                    Sign in here
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-3">
          {/* DESIGN_FIX: replaced hard-coded footer color with token */}
          <p className="text-sm text-muted-foreground">
            © 2024 FinVision. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
