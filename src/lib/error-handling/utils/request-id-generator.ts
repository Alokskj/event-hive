import { randomBytes } from 'crypto';

export class RequestIdGenerator {
    static generate(): string {
        const timestamp = Date.now().toString(36);
        const randomPart = randomBytes(6).toString('hex');
        return `req_${timestamp}_${randomPart}`;
    }

    static generateShort(): string {
        return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 6)}`;
    }

    static isValidRequestId(id: string): boolean {
        return /^req_[a-z0-9]+_[a-f0-9]+$/.test(id);
    }
}
