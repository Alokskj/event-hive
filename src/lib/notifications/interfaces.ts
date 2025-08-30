import { NotificationType, NotificationEvent } from '@prisma/client';

export interface NotificationPayload {
    userId: string;
    eventId?: string;
    bookingId?: string;
    recipient: string; // email or phone
    event: NotificationEvent;
    type: NotificationType; // channel type logical
    title: string;
    message: string;
    metadata?: Record<string, any>;
}

export interface ChannelSendResult {
    success: boolean;
    providerMessageId?: string;
    error?: string;
}

export interface NotificationChannel {
    readonly kind: NotificationType;
    send(payload: NotificationPayload): Promise<ChannelSendResult>;
    isAvailable(): boolean;
}

export interface TemplateContext {
    user?: { firstName?: string; lastName?: string; email: string };
    event?: { title: string; startDateTime: Date; venue: string };
    booking?: { bookingNumber: string; finalAmount: string; quantity: number };
    extra?: Record<string, any>;
}

export interface ResolvedTemplate {
    title: string;
    message: string;
}

export interface ChannelPreferenceOptions {
    strategy?: 'ALL' | 'FALLBACK';
    channels?: NotificationType[]; // override default
}
