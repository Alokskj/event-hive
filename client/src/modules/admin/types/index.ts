export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLoginAt?: string;
  reportCount: number;
}

export interface AdminIssue {
  id: string;
  title: string;
  description: string;
  status: 'REPORTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  category: {
    id: string;
    name: string;
    color: string;
  };
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  images: string[];
  flagCount: number;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalIssues: number;
  totalResolved: number;
  totalPending: number;
  totalFlagged: number;
  recentActivity: {
    newUsers: number;
    newIssues: number;
    resolvedIssues: number;
  };
  categoryStats: {
    categoryId: string;
    categoryName: string;
    count: number;
  }[];
}

export interface FlaggedReport {
  id: string;
  issue: AdminIssue;
  flaggedBy: AdminUser[];
  flaggedAt: string;
  reason?: string;
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED';
  reviewedBy?: {
    id: string;
    name: string;
  };
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isActive: boolean;
  issueCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
}

export interface BanUserRequest {
  userId: string;
  reason: string;
  duration?: number; // in days, undefined for permanent
}

export interface UpdateIssueStatusRequest {
  issueId: string;
  status: 'REPORTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  notes?: string;
}

export interface ReviewFlagRequest {
  flagId: string;
  action: 'DISMISS' | 'APPROVE';
  notes?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface AdminPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminFilters {
  status?: string;
  role?: string;
  category?: string;
  flagged?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
