import {
  AdminUser,
  AdminIssue,
  AdminStats,
  FlaggedReport,
  AdminCategory,
  UpdateUserRoleRequest,
  BanUserRequest,
  UpdateIssueStatusRequest,
  ReviewFlagRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  AdminPaginatedResponse,
  AdminFilters,
} from '../types';
import { apiClient } from '@/utils/api';

const BASE_URL = '/admin';

// Dashboard & Stats
export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await apiClient.get<AdminStats>(`${BASE_URL}/stats`);
  return response.data;
};

// User Management
export const getUsers = async (
  page = 1,
  limit = 10,
  filters?: AdminFilters
): Promise<AdminPaginatedResponse<AdminUser>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await apiClient.get<AdminPaginatedResponse<AdminUser>>(
    `${BASE_URL}/users?${params}`
  );
  return response.data;
};

export const getUserById = async (userId: string): Promise<AdminUser> => {
  const response = await apiClient.get<AdminUser>(`${BASE_URL}/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (data: UpdateUserRoleRequest): Promise<AdminUser> => {
  const response = await apiClient.patch<AdminUser>(
    `${BASE_URL}/users/${data.userId}/role`,
    { role: data.role }
  );
  return response.data;
};

export const banUser = async (data: BanUserRequest): Promise<void> => {
  await apiClient.post(`${BASE_URL}/users/${data.userId}/ban`, {
    reason: data.reason,
    duration: data.duration,
  });
};

export const unbanUser = async (userId: string): Promise<void> => {
  await apiClient.post(`${BASE_URL}/users/${userId}/unban`);
};

// Issue Management
export const getAdminIssues = async (
  page = 1,
  limit = 10,
  filters?: AdminFilters
): Promise<AdminPaginatedResponse<AdminIssue>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await apiClient.get<AdminPaginatedResponse<AdminIssue>>(
    `${BASE_URL}/issues?${params}`
  );
  return response.data;
};

export const getAdminIssueById = async (issueId: string): Promise<AdminIssue> => {
  const response = await apiClient.get<AdminIssue>(`${BASE_URL}/issues/${issueId}`);
  return response.data;
};

export const updateIssueStatus = async (data: UpdateIssueStatusRequest): Promise<AdminIssue> => {
  const response = await apiClient.patch<AdminIssue>(
    `${BASE_URL}/issues/${data.issueId}/status`,
    { status: data.status, notes: data.notes }
  );
  return response.data;
};

export const deleteIssue = async (issueId: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/issues/${issueId}`);
};

// Flagged Reports Management
export const getFlaggedReports = async (
  page = 1,
  limit = 10,
  filters?: AdminFilters
): Promise<AdminPaginatedResponse<FlaggedReport>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await apiClient.get<AdminPaginatedResponse<FlaggedReport>>(
    `${BASE_URL}/flagged-reports?${params}`
  );
  return response.data;
};

export const reviewFlaggedReport = async (data: ReviewFlagRequest): Promise<FlaggedReport> => {
  const response = await apiClient.patch<FlaggedReport>(
    `${BASE_URL}/flagged-reports/${data.flagId}/review`,
    { action: data.action, notes: data.notes }
  );
  return response.data;
};

// Category Management
export const getAdminCategories = async (): Promise<AdminCategory[]> => {
  const response = await apiClient.get<AdminCategory[]>(`${BASE_URL}/categories`);
  return response.data;
};

export const createCategory = async (data: CreateCategoryRequest): Promise<AdminCategory> => {
  const response = await apiClient.post<AdminCategory>(`${BASE_URL}/categories`, data);
  return response.data;
};

export const updateCategory = async (data: UpdateCategoryRequest): Promise<AdminCategory> => {
  const { id, ...updateData } = data;
  const response = await apiClient.patch<AdminCategory>(
    `${BASE_URL}/categories/${id}`,
    updateData
  );
  return response.data;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/categories/${categoryId}`);
};

// Analytics
export const getAnalytics = async (
  period: 'week' | 'month' | 'year' = 'month'
): Promise<{
  issuesByCategory: { category: string; count: number }[];
  issuesByStatus: { status: string; count: number }[];
  issuesByMonth: { month: string; count: number }[];
  userGrowth: { month: string; users: number }[];
}> => {
  const response = await apiClient.get<any>(
    `${BASE_URL}/analytics?period=${period}`
  );
  return response.data;
};
