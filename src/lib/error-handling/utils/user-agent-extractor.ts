import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

/**
 * Utility class for extracting and parsing user agent information using ua-parser-js
 */
export class UserAgentExtractor {
    /**
     * Extract user agent from request headers
     * @param req - Express request object
     * @returns User agent string or undefined if not available
     */
    static extract(req: Request): string | undefined {
        return req.get('User-Agent') || (req.headers['user-agent'] as string);
    }

    /**
     * Extract user agent with fallback to default value
     * @param req - Express request object
     * @param defaultValue - Default value if user agent is not available
     * @returns User agent string or default value
     */
    static extractWithDefault(
        req: Request,
        defaultValue: string = 'Unknown',
    ): string {
        return this.extract(req) || defaultValue;
    }

    /**
     * Parse user agent to extract comprehensive information using ua-parser-js
     * @param req - Express request object
     * @returns Parsed user agent information
     */
    static parseUserAgent(req: Request): UserAgentInfo {
        const userAgent = this.extract(req);

        if (!userAgent) {
            return {
                browser: { name: 'Unknown', version: 'Unknown' },
                os: { name: 'Unknown', version: 'Unknown' },
                device: {
                    type: 'Unknown',
                    model: 'Unknown',
                    vendor: 'Unknown',
                },
                engine: { name: 'Unknown', version: 'Unknown' },
                cpu: { architecture: 'Unknown' },
                raw: undefined,
            };
        }

        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        return {
            browser: {
                name: result.browser.name || 'Unknown',
                version: result.browser.version || 'Unknown',
            },
            os: {
                name: result.os.name || 'Unknown',
                version: result.os.version || 'Unknown',
            },
            device: {
                type: result.device.type || 'desktop',
                model: result.device.model || 'Unknown',
                vendor: result.device.vendor || 'Unknown',
            },
            engine: {
                name: result.engine.name || 'Unknown',
                version: result.engine.version || 'Unknown',
            },
            cpu: {
                architecture: result.cpu.architecture || 'Unknown',
            },
            raw: userAgent,
        };
    }

    /**
     * Check if the request is from a mobile device
     * @param req - Express request object
     * @returns True if mobile device, false otherwise
     */
    static isMobile(req: Request): boolean {
        const userAgent = this.extract(req);
        if (!userAgent) return false;

        const parser = new UAParser(userAgent);
        const deviceType = parser.getDevice().type;

        return deviceType === 'mobile' || deviceType === 'tablet';
    }

    /**
     * Check if the request is from a tablet device
     * @param req - Express request object
     * @returns True if tablet device, false otherwise
     */ static isTablet(req: Request): boolean {
        const userAgent = this.extract(req);
        if (!userAgent) return false;

        const parser = new UAParser(userAgent);
        return parser.getDevice().type === 'tablet';
    }

    /**
     * Check if the request is from a desktop device
     * @param req - Express request object
     * @returns True if desktop device, false otherwise
     */
    static isDesktop(req: Request): boolean {
        const userAgent = this.extract(req);
        if (!userAgent) return true; // Default to desktop if unknown

        const parser = new UAParser(userAgent);
        const deviceType = parser.getDevice().type;

        return !deviceType || deviceType === undefined;
    }

    /**
     * Check if the request is from a bot/crawler
     * @param req - Express request object
     * @returns True if bot/crawler, false otherwise
     */
    static isBot(req: Request): boolean {
        const userAgent = this.extract(req);
        if (!userAgent) return false;

        const botRegex =
            /bot|crawler|spider|crawling|facebook|twitter|linkedin|whatsapp|telegram|googlebot|bingbot|slurp|duckduckbot/i;
        return botRegex.test(userAgent);
    }

    /**
     * Get browser information
     * @param req - Express request object
     * @returns Browser information
     */
    static getBrowser(req: Request): { name: string; version: string } {
        const userAgent = this.extract(req);
        if (!userAgent) return { name: 'Unknown', version: 'Unknown' };

        const parser = new UAParser(userAgent);
        const browser = parser.getBrowser();

        return {
            name: browser.name || 'Unknown',
            version: browser.version || 'Unknown',
        };
    }

    /**
     * Get operating system information
     * @param req - Express request object
     * @returns OS information
     */
    static getOS(req: Request): { name: string; version: string } {
        const userAgent = this.extract(req);
        if (!userAgent) return { name: 'Unknown', version: 'Unknown' };

        const parser = new UAParser(userAgent);
        const os = parser.getOS();

        return {
            name: os.name || 'Unknown',
            version: os.version || 'Unknown',
        };
    }

    /**
     * Get device information
     * @param req - Express request object
     * @returns Device information
     */
    static getDevice(req: Request): {
        type: string;
        model: string;
        vendor: string;
    } {
        const userAgent = this.extract(req);
        if (!userAgent)
            return { type: 'desktop', model: 'Unknown', vendor: 'Unknown' };

        const parser = new UAParser(userAgent);
        const device = parser.getDevice();

        return {
            type: device.type || 'desktop',
            model: device.model || 'Unknown',
            vendor: device.vendor || 'Unknown',
        };
    }
}

/**
 * Interface for parsed user agent information using ua-parser-js
 */
export interface UserAgentInfo {
    browser: {
        name: string;
        version: string;
    };
    os: {
        name: string;
        version: string;
    };
    device: {
        type: string;
        model: string;
        vendor: string;
    };
    engine: {
        name: string;
        version: string;
    };
    cpu: {
        architecture: string;
    };
    raw?: string;
}
