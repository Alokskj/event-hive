import { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRoles?: UserRole[];
  requireEmailVerification?: boolean;
  requireLocationAccess?: boolean;
}

export const ProtectedRoute = ({
  requiredRoles = [],
  requireEmailVerification = true,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check email verification requirement
  if (requireEmailVerification && !user.isVerified) {
    return <Navigate to="/auth/verify-email" state={{ email: user.email }} replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }


  return <Outlet />;
};

// Higher-order component for easier role-based protection
export const withAuth = (
  Component: React.ComponentType<any>,
  options?: Omit<ProtectedRouteProps, 'children'>
) => {
  return (props: any) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};