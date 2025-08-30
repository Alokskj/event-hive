export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
    statusCode: number;
}

export interface ApiError {
    errorCode: string;
    isOperational: boolean;
    message: string;
    requestId: string;
    status: string;
    success: boolean;
    timestamp: Date;
}

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
