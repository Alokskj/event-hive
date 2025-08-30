import {
    NotificationChannel,
    NotificationPayload,
    ChannelSendResult,
} from '../interfaces';
import { NotificationType } from '@prisma/client';
import { emailService } from '../../../services/email.service';

export class EmailChannel implements NotificationChannel {
    readonly kind: NotificationType = NotificationType.EMAIL;
    isAvailable(): boolean {
        return !!process.env.SMTP_HOST;
    }
    async send(payload: NotificationPayload): Promise<ChannelSendResult> {
        try {
            await emailService.sendPlain(
                payload.recipient,
                payload.title,
                payload.message,
                payload.userId,
            );
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e?.message };
        }
    }
}
