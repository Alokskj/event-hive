import {
    NotificationChannel,
    NotificationPayload,
    ChannelSendResult,
} from '../interfaces';
import { NotificationType } from '@prisma/client';
import fetch from 'node-fetch';

// Meta Cloud API simple wrapper
export class WhatsAppChannel implements NotificationChannel {
    readonly kind: NotificationType = NotificationType.WHATSAPP;
    isAvailable(): boolean {
        return (
            !!process.env.META_WHATSAPP_TOKEN &&
            !!process.env.META_WHATSAPP_PHONE_ID
        );
    }
    async send(payload: NotificationPayload): Promise<ChannelSendResult> {
        try {
            const token = process.env.META_WHATSAPP_TOKEN!;
            const phoneId = process.env.META_WHATSAPP_PHONE_ID!;
            const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
            const body = {
                messaging_product: 'whatsapp',
                to: payload.recipient,
                type: 'text',
                text: { body: payload.message },
            };
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!resp.ok) {
                const txt = await resp.text();
                return { success: false, error: `HTTP ${resp.status} ${txt}` };
            }
            const json = await resp.json();
            return { success: true, providerMessageId: json.messages?.[0]?.id };
        } catch (e: any) {
            return { success: false, error: e?.message };
        }
    }
}
