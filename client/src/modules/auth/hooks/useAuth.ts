import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { AuthService } from '../services/auth.service';
import { useAuthStore } from './useAuthStore';
import { ApiError } from '@/types';

export const AUTH_KEYS = {
  profile: ['auth', 'profile'] as const,
  all: ['auth'] as const,
};

// Auth state management hook
export const useAuth = () => {
  const { user, setUser, clearUser, isAuthenticated, setIsAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: AUTH_KEYS.profile,
    queryFn: AuthService.checkAuth,
    enabled: !user && isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = profileQuery.isLoading;

  // Set user when profile query succeeds
  useEffect(() => {
    if (profileQuery.data?.user) {
      setUser(profileQuery.data.user);
      setIsAuthenticated(true);
    } else if (profileQuery.isError) {
      clearUser();
    }
  }, [profileQuery.data, profileQuery.isError, setUser, clearUser, setIsAuthenticated]);

  return {
    user,
    isAuthenticated,
    isLoading,
    refetch: profileQuery.refetch,
  };
};

// Login mutation
export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (response) => {
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        queryClient.setQueryData(AUTH_KEYS.profile, response);
        toast.success('Logged in successfully!');
        
        // Redirect based on role
        if (response.user.role === 'ADMIN') {
          navigate('/dashboard');
        } else if (response.user.role === 'MODERATOR') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

// Register mutation
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: (response) => {
      if (response.user) {
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/auth/verification-waiting', {
          state: { email: response.user.email }
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

// Email verification mutation
export const useVerifyEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: AuthService.verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully! You can now log in.');
      navigate('/auth/login');
    },
    onError: (error: ApiError) => {
      
      toast.error(error.message || 'Email verification failed');
    },
  });
};

// Resend verification mutation
export const useResendVerification = () => {
  return useMutation({
    mutationFn: AuthService.resendVerification,
    onSuccess: () => {
      toast.success('Verification email sent successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to send verification email');
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset email sent successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully! You can now log in.');
      navigate('/auth/login');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Password reset failed');
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.updateProfile,
    onSuccess: (response) => {
      if (response.user) {
        setUser(response.user);
        queryClient.setQueryData(AUTH_KEYS.profile, response);
        toast.success('Profile updated successfully!');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const navigate = useNavigate();
  const { clearUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      toast.success('Logged out successfully!');
      navigate('/');
    },
    onError: (error: ApiError) => {
      // Clear anyway on logout error
      clearUser();
      queryClient.clear();
      navigate('/');
      toast.error(error.message || 'Logout failed');
    },
  });
};
