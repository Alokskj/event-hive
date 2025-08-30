import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AuthService } from '../services/auth.service';
import { ApiError } from '@/types';

export const AUTH_KEYS = {
    profile: ['auth', 'profile'] as const,
    all: ['auth'] as const,
};

// Auth state management hook
export const useAuth = () => {
    const profileQuery = useQuery({
        queryKey: AUTH_KEYS.profile,
        queryFn: AuthService.checkAuth,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isLoading = profileQuery.isLoading;

    return {
        user: profileQuery.data?.user,
        isAuthenticated: !!profileQuery.data?.user,
        isLoading,
        refetch: profileQuery.refetch,
    };
};

// Login mutation
export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthService.login,
        onSuccess: (response) => {
            if (response.user) {
                queryClient.refetchQueries({ queryKey: AUTH_KEYS.profile });
                toast.success('Logged in successfully!');
                navigate('/');
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
                toast.success(
                    'Account created successfully! Please check your email for verification.',
                );
                navigate('/auth/verification-waiting', {
                    state: { email: response.user.email },
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

// Update profile mutation
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthService.updateProfile,
        onSuccess: (response) => {
            if (response.user) {
                queryClient.refetchQueries({ queryKey: AUTH_KEYS.profile });
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
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthService.logout,
        onSuccess: () => {
            queryClient.clear();
            toast.success('Logged out successfully!');
            navigate('/');
        },
        onError: (error: ApiError) => {
            // Clear anyway on logout error
            queryClient.clear();
            navigate('/');
            toast.error(error.message || 'Logout failed');
        },
    });
};
