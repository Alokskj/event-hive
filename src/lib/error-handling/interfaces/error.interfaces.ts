import { ErrorCodeEnumType } from '../../../enums/error-code.enum';
import { UserAgentInfo } from '../utils/user-agent-extractor';

export interface NormalizedError {
    statusCode: number;
    message: string;
    status: string;
    isOperational: boolean;
    errorCode?: ErrorCodeEnumType;
    details?: any;
    stack?: string;
    timestamp?: string;
    requestId?: string;
}

export interface ErrorResponse {
    success: boolean;
    status: string;
    message: string;
    errorCode?: ErrorCodeEnumType;
    details?: any;
    stack?: string;
    isOperational?: boolean;
    timestamp: string;
    requestId?: string;
}

export interface ErrorContext {
    requestId?: string;
    userId?: string;
    path?: string;
    method?: string;
    ip?: string;
    userAgent?: string;
    userAgentInfo?: UserAgentInfo;
}
