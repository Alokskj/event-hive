export const ERROR_MESSAGES = {
    VALIDATION: {
        REQUIRED_FIELD: 'This field is required',
        INVALID_FORMAT: 'Invalid format provided',
        INVALID_EMAIL: 'Please provide a valid email address',
        INVALID_PASSWORD: 'Password must be at least 8 characters long',
        PASSWORDS_DONT_MATCH: 'Passwords do not match',
    },
    AUTH: {
        UNAUTHORIZED: 'Authentication required',
        FORBIDDEN: 'You do not have permission to perform this action',
        INVALID_CREDENTIALS: 'Invalid email or password',
        TOKEN_EXPIRED: 'Your session has expired. Please log in again',
        INVALID_TOKEN: 'Invalid authentication token',
    },
    RESOURCE: {
        NOT_FOUND: 'The requested resource was not found',
        ALREADY_EXISTS: 'A resource with this information already exists',
        CONFLICT: 'This operation conflicts with existing data',
    },
    DATABASE: {
        CONNECTION_ERROR: 'Unable to connect to the database',
        TIMEOUT: 'Database operation timed out',
        CONSTRAINT_VIOLATION: 'This operation violates data constraints',
    },
    EXTERNAL: {
        SERVICE_UNAVAILABLE: 'External service is currently unavailable',
        API_ERROR: 'Error communicating with external service',
        PAYMENT_FAILED: 'Payment processing failed',
    },
    SYSTEM: {
        INTERNAL_ERROR: 'An unexpected error occurred',
        SERVICE_UNAVAILABLE: 'Service is temporarily unavailable',
        RATE_LIMIT: 'Too many requests. Please try again later',
    },
} as const;
