import { useLocation, Link } from 'react-router';
import { Mail, Loader2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useResendVerification } from '../hooks/useAuth';

export const EmailVerificationWaitingPage = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  
  const resendVerificationMutation = useResendVerification();

  const handleResendVerification = () => {
    if (email) {
      resendVerificationMutation.mutate(email);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-none border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Mail className="h-16 w-16 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Instructions */}
           

            {/* Resend verification */}
            <div className="space-y-3">
              <div className="text-center text-sm text-gray-600">
                Didn't receive the email?
              </div>
              
              <Button
                type="button"

                className="w-full"
                onClick={handleResendVerification}
                disabled={resendVerificationMutation.isPending || !email}
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
                    Verification email sent successfully! Please check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              {resendVerificationMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {resendVerificationMutation.error.message || 
                     'Failed to resend verification email. Please try again later.'}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
           
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth/login">
                  Back to Login
                </Link>
              </Button>
            </div>

            {/* Help text */}
            <div className="text-xs text-gray-500 text-center">
              <p>The verification link will expire in 24 hours.</p>
             
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
