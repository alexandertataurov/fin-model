import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button } from '@/design-system/components/Button';
import { Card, CardContent } from '@/design-system/components/Card';
import { Input } from '@/design-system/components/Input';
import { Label } from '@/design-system/components/Label';
import {
  Mail,
  TrendingUp,
  Loader2,
  AlertCircle,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { authApi } from '../../services/authApi';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});

interface FormValues {
  email: string;
}

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        await authApi.requestPasswordReset(values.email);
        setSuccess(
          'If an account with that email exists, you will receive password reset instructions shortly.'
        );

        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (err: unknown) {
        const error = err as {
          response?: { status?: number; data?: { detail?: string } };
        };

        if (error.response?.status === 429) {
          setError('Too many password reset requests. Please try again later.');
        } else {
          setError('An error occurred. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

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
                Reset Password
              </h1>
              <p className="text-muted-foreground">
                Enter your email to receive reset instructions
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
                    data-testid="forgot-password-email-input"
                    disabled={success !== null}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || success !== null}
                className="w-full"
                size="lg"
                data-testid="forgot-password-submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Instructions...
                  </>
                ) : (
                  'Send Reset Instructions'
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

export default ForgotPasswordForm;
