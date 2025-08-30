import { Request } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import { NormalizedError, ErrorContext } from '../interfaces/error.interfaces';
import { ErrorLogger } from '../interfaces/logger.interfaces';
import { UserAgentExtractor } from '../utils/user-agent-extractor';

/**
 * File error logger that writes errors to log files
 */
export class FileErrorLogger implements ErrorLogger {
    private logPath: string;

    constructor(logPath: string = 'logs') {
        this.logPath = logPath;
        this.ensureLogDirectory();
    }

    async logError(error: NormalizedError, req: Request): Promise<void> {
        try {
            const logEntry = this.createLogEntry(error, req);
            const filename = this.getLogFilename();
            const filepath = join(this.logPath, filename);

            await fs.appendFile(filepath, logEntry + '\n');
        } catch (logError) {
            console.error('Failed to write error to file:', logError);
        }
    }

    private createLogEntry(error: NormalizedError, req: Request): string {
        const timestamp = new Date().toISOString();

        const logData = {
            timestamp,
            level: 'ERROR',
            statusCode: error.statusCode,
            message: error.message,
            errorCode: error.errorCode,
            isOperational: error.isOperational,
            requestId: error.requestId,
            request: req
                ? {
                      method: req.method,
                      path: req.path,
                      ip: req.ip,
                      userAgent: UserAgentExtractor.extract(req),
                      userAgentInfo: UserAgentExtractor.parseUserAgent(req),
                      isMobile: UserAgentExtractor.isMobile(req),
                      isBot: UserAgentExtractor.isBot(req),
                      userId: req.user?.userId,
                  }
                : undefined,
            details: error.details,
            stack:
                process.env.NODE_ENV === 'development'
                    ? error.stack
                    : undefined,
        };

        return JSON.stringify(logData);
    }

    private getLogFilename(): string {
        const date = new Date().toISOString().split('T')[0];
        return `error-${date}.log`;
    }

    private async ensureLogDirectory(): Promise<void> {
        try {
            await fs.mkdir(this.logPath, { recursive: true });
        } catch (error) {
            console.error('Failed to create log directory:', error);
        }
    }
}
