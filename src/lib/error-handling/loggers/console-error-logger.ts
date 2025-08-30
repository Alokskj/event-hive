import { Request } from 'express';
import { NormalizedError, ErrorContext } from '../interfaces/error.interfaces';
import { ErrorLogger } from '../interfaces/logger.interfaces';
import { UserAgentExtractor } from '../utils/user-agent-extractor';

/**
 * Console error logger for development and debugging
 */
export class ConsoleErrorLogger implements ErrorLogger {
    async logError(error: NormalizedError, req: Request): Promise<void> {
        const timestamp = new Date().toISOString();
        const separator = '='.repeat(80);

        console.error('\n' + separator);
        console.error(`ERROR LOGGED AT: ${timestamp}`);
        console.error(separator);
        console.error(`Status Code: ${error.statusCode}`);
        console.error(`Message: ${error.message}`);
        console.error(`Error Code: ${error.errorCode}`);
        console.error(`Is Operational: ${error.isOperational}`);
        console.error(`Request ID: ${error.requestId}`);

        if (req) {
            console.error(`Path: ${req.method} ${req.path}`);
            console.error(`IP: ${req.ip}`);
            // Enhanced user agent information
            const userAgent = UserAgentExtractor.extract(req);
            const userAgentInfo = UserAgentExtractor.parseUserAgent(req);
            const isMobile = UserAgentExtractor.isMobile(req);
            const isBot = UserAgentExtractor.isBot(req);

            console.error(`User Agent: ${userAgent || 'Unknown'}`);
            console.error(
                `Browser: ${userAgentInfo.browser.name} ${userAgentInfo.browser.version}`,
            );
            console.error(
                `OS: ${userAgentInfo.os.name} ${userAgentInfo.os.version}`,
            );
            console.error(
                `Device: ${userAgentInfo.device.type} - ${userAgentInfo.device.vendor} ${userAgentInfo.device.model}`,
            );
            console.error(
                `Engine: ${userAgentInfo.engine.name} ${userAgentInfo.engine.version}`,
            );
            console.error(`CPU: ${userAgentInfo.cpu.architecture}`);
            console.error(`Is Mobile: ${isMobile}`);
            console.error(`Is Bot: ${isBot}`);

            if (req.user) {
                console.error(`User ID: ${req.user.userId}`);
            }
        }

        if (error.details) {
            console.error('Details:');
            console.error(JSON.stringify(error.details, null, 2));
        }

        if (error.stack && process.env.NODE_ENV === 'development') {
            console.error('Stack Trace:');
            console.error(error.stack);
        }

        console.error(separator + '\n');
    }
}
