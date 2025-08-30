import {
    SENSITIVE_FIELDS,
    SENSITIVE_PATTERNS,
} from '../constants/sensitive-fields';

export class ErrorSanitizer {
    static sanitizeObject(obj: any, maxDepth: number = 3): any {
        return this.sanitizeRecursive(obj, maxDepth, 0);
    }

    private static sanitizeRecursive(
        obj: any,
        maxDepth: number,
        currentDepth: number,
    ): any {
        if (currentDepth >= maxDepth || obj === null || obj === undefined) {
            return obj;
        }

        if (typeof obj === 'string') {
            return this.sanitizeString(obj);
        }

        if (Array.isArray(obj)) {
            return obj.map((item) =>
                this.sanitizeRecursive(item, maxDepth, currentDepth + 1),
            );
        }

        if (typeof obj === 'object') {
            const sanitized: any = {};

            for (const [key, value] of Object.entries(obj)) {
                if (this.isSensitiveField(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitizeRecursive(
                        value,
                        maxDepth,
                        currentDepth + 1,
                    );
                }
            }

            return sanitized;
        }

        return obj;
    }

    private static isSensitiveField(fieldName: string): boolean {
        const lowerFieldName = fieldName.toLowerCase();

        // Check exact matches
        if (
            SENSITIVE_FIELDS.some((field) =>
                lowerFieldName.includes(field.toLowerCase()),
            )
        ) {
            return true;
        }

        // Check pattern matches
        return SENSITIVE_PATTERNS.some((pattern) => pattern.test(fieldName));
    }

    private static sanitizeString(str: string): string {
        // Remove potential sensitive information from strings
        return str
            .replace(/Bearer\s+[^\s]+/gi, 'Bearer [REDACTED]')
            .replace(/password[=:]\s*[^\s&]+/gi, 'password=[REDACTED]')
            .replace(/token[=:]\s*[^\s&]+/gi, 'token=[REDACTED]');
    }

    static sanitizeStackTrace(stack?: string): string | undefined {
        if (!stack) return undefined;

        // Remove file paths that might contain sensitive information
        return stack
            .replace(/\/Users\/[^/]+/g, '/Users/[USER]')
            .replace(/\/home\/[^/]+/g, '/home/[USER]')
            .replace(/C:\\Users\\[^\\]+/g, 'C:\\Users\\[USER]');
    }
}
