import { User, UserRole } from '@prisma/client';

// Public user interface (without sensitive data)
export interface PublicUser {
    id: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    isVerified: boolean;
    role: UserRole;
    lastLocationLat?: number;
    lastLocationLng?: number;
    createdAt: Date;
    updatedAt: Date;
}

// User creation interface
export interface CreateUserData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    phone?: string;
    role?: UserRole;
    lastLocationLat?: number;
    lastLocationLng?: number;
}

// User update interface
export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    username?: string;
    phone?: string;
    lastLocationLat?: number;
    lastLocationLng?: number;
}

// Authentication response
export interface AuthResponse {
    user: PublicUser;
    accessToken: string;
    refreshToken: string;
}

// JWT payload for authentication
export interface AuthTokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    type?: 'access' | 'refresh' | 'email' | 'password-reset';
}

// User with location information
export interface UserWithLocation extends PublicUser {
    distance?: number; // Distance in kilometers from a reference point
}

// User statistics
export interface UserStats {
    totalIssuesReported: number;
    resolvedIssues: number;
    pendingIssues: number;
    flaggedIssues: number;
}

// Admin user view (includes sensitive data for admins)
export interface AdminUserView extends User {
    stats?: UserStats;
}

// User filter options for admin
export interface UserFilterOptions {
    role?: UserRole;
    isVerified?: boolean;
    isActive?: boolean;
    isBanned?: boolean;
    search?: string; // Search by email, username, name
    createdAfter?: Date;
    createdBefore?: Date;
    lastLoginAfter?: Date;
    lastLoginBefore?: Date;
}

// Pagination options
export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Paginated response
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
