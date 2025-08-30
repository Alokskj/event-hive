import { ErrorLogger } from '../../interfaces/logger.interfaces';

export abstract class BaseErrorLogger implements ErrorLogger {
    abstract logError(error: any, req: any): void;

    protected generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    protected sanitizeUserAgent(userAgent?: string): string {
        if (!userAgent) return 'Unknown';
        return userAgent.length > 200
            ? userAgent.substring(0, 200) + '...'
            : userAgent;
    }

    protected getClientIp(req: any): string {
        return (
            req.ip ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.headers['x-forwarded-for']?.split(',')[0] ||
            'Unknown'
        );
    }
}
