import React, { useState, useEffect, useCallback } from 'react';
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Button } from '@/design-system/atoms';
import { Card, CardContent } from '@/design-system/molecules';
import { Loader2, AlertCircle, Check, Mail, ArrowLeft } from 'lucide-react';
import { authApi } from '../../services/authApi';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyEmail = useCallback(
    async (verificationToken: string) => {
      setIsVerifying(true);
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        await authApi.verifyEmail(verificationToken);
        setSuccess(
          'Email verified successfully! You can now sign in to your account.'
        );

        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (err: unknown) {
        const error = err as {
          response?: { status?: number; data?: { detail?: string } };
        };

        if (error.response?.status === 400) {
          setError(
            'Invalid or expired verification link. The link may have already been used or expired.'
          );
        } else {
          setError(
            'An error occurred during verification. Please try again later.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  // Auto-verify if token is present
  useEffect(() => {
    if (token && !isVerifying) {
      verifyEmail(token);
    }
  }, [token, isVerifying, verifyEmail]);

  const handleResendVerification = async () => {
    // This would require additional API endpoint to resend verification
    // For now, redirect to register page
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card/95 backdrop-blur-md border-border/20 shadow-2xl">
          <div className="p-6 pb-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                ) : success ? (
                  <Check className="h-8 w-8 text-green-600" />
                ) : error ? (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                ) : (
                  <Mail className="h-8 w-8 text-primary" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {isLoading
                  ? 'Verifying Email...'
                  : success
                    ? 'Email Verified!'
                    : error
                      ? 'Verification Failed'
                      : 'Email Verification'}
              </h1>
              <p className="text-muted-foreground">
                {isLoading
                  ? 'Please wait while we verify your email address.'
                  : success
                    ? 'Your email has been successfully verified.'
                    : error
                      ? "We couldn't verify your email address."
                      : 'Verify your email to activate your account.'}
              </p>
            </div>
          </div>

          <CardContent className="space-y-6 pt-0">
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

            {!token && !isLoading && (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    Click the verification link in your email to verify your
                    account. Check your spam folder if you don't see the email.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {success && (
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full"
                  size="lg"
                >
                  Continue to Sign In
                </Button>
              )}

              {error && (
                <div className="space-y-2">
                  <Button
                    onClick={handleResendVerification}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Request New Verification Email
                  </Button>
                </div>
              )}

              <div className="text-center">
                <RouterLink
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </RouterLink>
              </div>
            </div>
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

export default EmailVerification;
