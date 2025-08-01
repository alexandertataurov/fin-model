import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { checkPasswordStrength } from '../../services/authApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye,
  EyeOff,
  Lock,
  TrendingUp,
  Loader2,
  AlertCircle,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';
import { authApi } from '../../services/authApi';

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface FormValues {
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      if (!token) return;
      
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        await authApi.resetPassword({
          token,
          new_password: values.password,
        });
        
        setSuccess('Password reset successfully! Redirecting to login...');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: unknown) {
        const error = err as {
          response?: { status?: number; data?: { detail?: string } };
        };
        
        if (error.response?.status === 400) {
          setError('Invalid or expired reset token. Please request a new password reset.');
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

  if (!token) {
    return null; // Will redirect
  }

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
              <h1 className="text-2xl font-bold text-foreground">
                Set New Password
              </h1>
              <p className="text-muted-foreground">
                Please enter your new password
              </p>
            </div>
          </div>

          <CardContent className="space-y-6 pt-0">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm">
                  <Check className="h-4 w-4" />
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" required>
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password ? formik.errors.password : undefined
                    }
                    autoComplete="new-password"
                    className="pl-9 pr-10"
                    disabled={success !== null}
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
                            ? 'bg-green-500'
                            : passwordStrength.strength === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(passwordStrength.checks).map(
                        ([key, passed]) => (
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
                            {key}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" required>
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
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
                    disabled={success !== null}
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
                disabled={isLoading || !passwordStrength.isValid || success !== null}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <div className="text-center space-y-4">
                <RouterLink
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </RouterLink>
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

export default ResetPasswordForm;