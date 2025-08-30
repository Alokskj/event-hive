import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams, useLocation } from 'react-router';
import { Mail, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useVerifyEmail, useResendVerification } from '../hooks/useAuth';

// Validation schema for manual token entry
const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

type VerifyTokenFormData = z.infer<typeof verifyTokenSchema>;

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  // Get token from URL params or state
  const tokenFromUrl = searchParams.get('token');
  const emailFromState = location.state?.email;

  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendVerification();

  const form = useForm<VerifyTokenFormData>({
    resolver: zodResolver(verifyTokenSchema),
    defaultValues: {
      token: '',
    },
  });

  // Auto-verify if token is in URL
  useEffect(() => {
    if (tokenFromUrl && !isAutoVerifying) {
      setIsAutoVerifying(true);
      verifyEmailMutation.mutate({ token: tokenFromUrl });
    }
  }, [tokenFromUrl, verifyEmailMutation, isAutoVerifying]);

  const handleManualVerify = (data: VerifyTokenFormData) => {
    verifyEmailMutation.mutate({ token: data.token });
  };

  const handleResendVerification = () => {
    if (emailFromState) {
      resendVerificationMutation.mutate(emailFromState);
    }
  };

  // Success state
  if (verifyEmailMutation.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You can now access all features of Event Hive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/auth/login">Continue to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            {tokenFromUrl
              ? 'We\'re verifying your email address...'
              : 'Check your inbox and click the verification link, or enter the token below'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Auto-verification loading state */}
          {tokenFromUrl && isAutoVerifying && !verifyEmailMutation.isError && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-2 text-sm text-gray-600">Verifying your email...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {verifyEmailMutation.isError && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>
                {verifyEmailMutation.error.message || 
                 'Email verification failed. The token may be invalid or expired.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Manual verification form */}
          {(!tokenFromUrl || verifyEmailMutation.isError || showManualForm) && (
            <div className="space-y-4">
              <form onSubmit={form.handleSubmit(handleManualVerify)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Verification Token</Label>
                  <Input
                    id="token"
                    placeholder="Enter the token from your email"
                    {...form.register('token')}
                    className={form.formState.errors.token ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.token && (
                    <p className="text-sm text-red-500">{form.formState.errors.token.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={verifyEmailMutation.isPending}
                >
                  {verifyEmailMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
              </form>

              {/* Resend verification */}
              {emailFromState && (
                <div className="space-y-2">
                  <div className="text-center text-sm text-gray-600">
                    Didn't receive the email?
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResendVerification}
                    disabled={resendVerificationMutation.isPending}
                  >
                    {resendVerificationMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                  
                  {resendVerificationMutation.isSuccess && (
                    <Alert>
                      <AlertDescription>
                        Verification email sent! Please check your inbox.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Toggle manual form */}
              {tokenFromUrl && !showManualForm && verifyEmailMutation.isError && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowManualForm(true)}
                    className="text-sm"
                  >
                    Enter token manually
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <p className="text-center font-medium">What to expect:</p>
            <ul className="space-y-1 text-left">
              <li>• Check your email inbox for a verification message</li>
              <li>• Click the verification link in the email</li>
              <li>• Or copy and paste the token from the email above</li>
              <li>• The link will expire in 24 hours</li>
            </ul>
          </div>

          {/* Back to login */}
          <div className="mt-6 text-center text-sm">
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
