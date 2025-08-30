import nodemailer from 'nodemailer';
import { BadRequestException } from '@lib/error-handling';

export interface EmailConfig {
    service?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    auth: {
        user: string;
        pass: string;
    };
    from: string;
}

export const createEmailTransporter = () => {
    const emailConfig: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
        },
        from: process.env.SMTP_FROM || 'noreply@eventhive.com',
    };

    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
        throw new BadRequestException('Email configuration is missing');
    }

    return nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: emailConfig.auth,
    });
};

export const emailConfig = {
    from: process.env.SMTP_FROM || 'EventHive <noreply@eventhive.com>',
    baseUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    maxRetries: 3,
    retryDelay: 1000, // 1 second
};

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Email types for tracking
export enum EmailType {
    WELCOME = 'WELCOME',
    EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
    PASSWORD_RESET = 'PASSWORD_RESET',
    PASSWORD_CHANGED = 'PASSWORD_CHANGED',
    ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
    ISSUE_STATUS_UPDATE = 'ISSUE_STATUS_UPDATE',
    ISSUE_RESOLVED = 'ISSUE_RESOLVED',
    ISSUE_FLAGGED = 'ISSUE_FLAGGED',
    WEEKLY_REPORT = 'WEEKLY_REPORT',
}

// Email status for tracking
export enum EmailStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    FAILED = 'FAILED',
    RETRYING = 'RETRYING',
}
