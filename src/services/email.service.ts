import {
    createEmailTransporter,
    emailConfig,
    EmailStatus,
    EmailType,
} from '@config/email.config';
import { EmailTemplate, EmailTemplates } from '@lib/email';
import {
    ApiError,
    BadRequestException,
    InternalServerException,
} from '@lib/error-handling';
import { auditService } from './audit.service';
import prisma from '@config/prisma';
import { generateTicketPdf } from '@lib/utils/ticket-pdf';
import QRCode from 'qrcode';

interface SendEmailOptions {
    to: string;
    template: EmailTemplate;
    type: EmailType;
    userId?: string;
    metadata?: Record<string, any>;
}

interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

export class EmailService {
    private transporter;
    private isConfigured: boolean = false;

    constructor() {
        try {
            this.transporter = createEmailTransporter();
            this.isConfigured = true;
        } catch (error) {
            console.warn('Email service not configured:', error);
            this.isConfigured = false;
        }
    }

    /**
     * Send an email
     */
    async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
        if (!this.isConfigured) {
            console.warn('Email service not configured, skipping email send');
            return { success: false, error: 'Email service not configured' };
        }

        const { to, template, type, userId, metadata } = options;

        try {
            // Validate email format
            if (!this.isValidEmail(to)) {
                throw new BadRequestException('Invalid email address format');
            }

            // Send email
            if (!this.transporter) {
                throw new InternalServerException(
                    'Email transporter not initialized',
                );
            }

            const info = await this.transporter.sendMail({
                from: emailConfig.from,
                to,
                subject: template.subject,
                text: template.text,
                html: template.html,
            });

            // Log successful email send
            await this.logEmailActivity({
                to,
                type,
                status: EmailStatus.SENT,
                userId,
                messageId: info.messageId,
                metadata,
            });

            return {
                success: true,
                messageId: info.messageId,
            };
        } catch (error) {
            console.error('Failed to send email:', error);

            // Log failed email send
            await this.logEmailActivity({
                to,
                type,
                status: EmailStatus.FAILED,
                userId,
                error: error instanceof Error ? error.message : 'Unknown error',
                metadata,
            });

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Generic plain email (used by notification channel when no template abstraction yet)
     */
    async sendPlain(
        to: string,
        subject: string,
        body: string,
        userId?: string,
    ): Promise<SendEmailResult> {
        const template: EmailTemplate = {
            subject,
            text: body,
            html: `<pre style="font-family:inherit;white-space:pre-wrap">${body}</pre>`,
        } as any;
        // Reuse a generic category (choose PASSWORD_CHANGED as neutral or first enum)
        return this.sendEmail({
            to,
            template,
            type: EmailType.PASSWORD_CHANGED,
            userId,
        });
    }

    /**
     * Send welcome email
     */
    async sendWelcomeEmail(
        email: string,
        firstName: string | undefined,
        verificationToken: string,
        userId?: string,
    ): Promise<SendEmailResult> {
        const template = EmailTemplates.welcome({
            firstName,
            email,
            verificationToken,
        });

        return this.sendEmail({
            to: email,
            template,
            type: EmailType.WELCOME,
            userId,
            metadata: { verificationToken },
        });
    }

    /**
     * Send email verification
     */
    async sendEmailVerification(
        email: string,
        firstName: string | undefined,
        verificationToken: string,
        userId?: string,
    ): Promise<SendEmailResult> {
        const template = EmailTemplates.emailVerification({
            firstName,
            verificationToken,
        });

        return this.sendEmail({
            to: email,
            template,
            type: EmailType.EMAIL_VERIFICATION,
            userId,
            metadata: { verificationToken },
        });
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(
        email: string,
        firstName: string | undefined,
        resetToken: string,
        userId?: string,
    ): Promise<SendEmailResult> {
        const template = EmailTemplates.passwordReset({
            firstName,
            resetToken,
        });

        return this.sendEmail({
            to: email,
            template,
            type: EmailType.PASSWORD_RESET,
            userId,
            metadata: { resetToken },
        });
    }

    /**
     * Send password changed confirmation
     */
    async sendPasswordChangedEmail(
        email: string,
        firstName: string | undefined,
        userId?: string,
    ): Promise<SendEmailResult> {
        const template = EmailTemplates.passwordChanged({
            firstName,
            email,
        });

        return this.sendEmail({
            to: email,
            template,
            type: EmailType.PASSWORD_CHANGED,
            userId,
        });
    }

    /**
     * Generate QR + PDF + email ticket after successful payment.
     * Idempotent: if qrCode already exists we still rebuild PDF & resend only if forced.
     */
    async sendTicketEmail(
        bookingId: string,
        options?: { forceResend?: boolean },
    ) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { event: true, items: { include: { ticket: true } } },
        });
        if (!booking) throw new ApiError(404, 'Booking not found');
        if (booking.status !== 'CONFIRMED')
            throw new ApiError(400, 'Booking not confirmed');

        // Generate / reuse QR
        let qrCode = booking.qrCode;
        const qrPayload = JSON.stringify({
            bookingId: booking.id,
            bookingNumber: booking.bookingNumber,
            eventId: booking.eventId,
            userId: booking.userId,
        });
        if (!qrCode) {
            qrCode = await QRCode.toDataURL(qrPayload, {
                width: 300,
                margin: 1,
            });
            await prisma.booking.update({
                where: { id: booking.id },
                data: { qrCode },
            });
        }
        const pdfBuffer = await generateTicketPdf({
            bookingNumber: booking.bookingNumber,
            eventTitle: booking.event.title,
            eventDate: new Date(booking.event.startDateTime).toLocaleString(
                'en-IN',
                { timeZone: booking.event.timezone || 'UTC' },
            ),
            eventVenue: booking.event.venue,
            attendeeName: booking.attendeeName,
            items: booking.items.map((i) => ({
                name: i.ticket.name,
                quantity: i.quantity,
            })),
            qrData: qrPayload,
        });
        try {
            const template = EmailTemplates.ticketDelivery({
                firstName: booking.attendeeName.split(' ')[0],
                eventTitle: booking.event.title,
                bookingNumber: booking.bookingNumber,
                eventDate: new Date(booking.event.startDateTime).toLocaleString(
                    'en-IN',
                    { timeZone: booking.event.timezone || 'UTC' },
                ),
                eventVenue: booking.event.venue,
                items: booking.items.map((i) => ({
                    name: i.ticket.name,
                    quantity: i.quantity,
                })),
            });
            await this.transporter?.sendMail?.({
                from: process.env.SMTP_FROM || 'noreply@eventhive.com',
                to: booking.attendeeEmail,
                subject: template.subject,
                html: template.html,
                text: template.text,
                attachments: [
                    {
                        filename: `ticket-${booking.bookingNumber}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf',
                    },
                ],
            });
        } catch (e) {
            console.error('Failed to send ticket email', e);
        }
        return { success: true };
    }

    /**
     * Validate email format
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Log email activity for audit purposes
     */
    private async logEmailActivity(data: {
        to: string;
        type: EmailType;
        status: EmailStatus;
        userId?: string;
        messageId?: string;
        error?: string;
        metadata?: Record<string, any>;
    }): Promise<void> {
        try {
            await auditService.log({
                userId: data.userId || 'system',
                action: `EMAIL_${data.status}`,
                entity: 'Email',
                entityId: data.messageId || `${data.type}_${Date.now()}`,
                newValues: {
                    to: data.to,
                    type: data.type,
                    status: data.status,
                    messageId: data.messageId,
                    error: data.error,
                    ...data.metadata,
                },
            });
        } catch (error) {
            console.error('Failed to log email activity:', error);
        }
    }
}

export const emailService = new EmailService();
