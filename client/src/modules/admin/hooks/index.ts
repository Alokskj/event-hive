import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminStats,
  getUsers,
  getUserById,
  updateUserRole,
  banUser,
  unbanUser,
  getAdminIssues,
  getAdminIssueById,
  updateIssueStatus,
  deleteIssue,
  getFlaggedReports,
  reviewFlaggedReport,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAnalytics,
} from '../services/api';
import {
  AdminFilters,
  UpdateUserRoleRequest,
  BanUserRequest,
  UpdateIssueStatusRequest,
  ReviewFlagRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types';

// Dashboard & Stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
  });
};

// User Management
export const useUsers = (page = 1, limit = 10, filters?: AdminFilters) => {
  return useQuery({
    queryKey: ['admin', 'users', page, limit, filters],
    queryFn: () => getUsers(page, limit, filters),
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUserRoleRequest) => updateUserRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BanUserRequest) => banUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => unbanUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Issue Management
export const useAdminIssues = (page = 1, limit = 10, filters?: AdminFilters) => {
  return useQuery({
    queryKey: ['admin', 'issues', page, limit, filters],
    queryFn: () => getAdminIssues(page, limit, filters),
  });
};

export const useAdminIssue = (issueId: string) => {
  return useQuery({
    queryKey: ['admin', 'issues', issueId],
    queryFn: () => getAdminIssueById(issueId),
    enabled: !!issueId,
  });
};

export const useUpdateIssueStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateIssueStatusRequest) => updateIssueStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'issues'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
};

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (issueId: string) => deleteIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'issues'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
};

// Flagged Reports
export const useFlaggedReports = (page = 1, limit = 10, filters?: AdminFilters) => {
  return useQuery({
    queryKey: ['admin', 'flagged-reports', page, limit, filters],
    queryFn: () => getFlaggedReports(page, limit, filters),
  });
};

export const useReviewFlaggedReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ReviewFlagRequest) => reviewFlaggedReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flagged-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'issues'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
};

// Category Management
export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: getAdminCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Also invalidate public categories
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Also invalidate public categories
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Also invalidate public categories
    },
  });
};

// Analytics
export const useAnalytics = (period: 'week' | 'month' | 'year' = 'month') => {
  return useQuery({
    queryKey: ['admin', 'analytics', period],
    queryFn: () => getAnalytics(period),
  });
};
