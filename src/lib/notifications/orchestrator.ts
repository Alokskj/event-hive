import { NotificationEvent, NotificationType } from '@prisma/client';
import prisma from '../../config/prisma';
import { EmailChannel } from './channels/email.channel';
import { WhatsAppChannel } from './channels/whatsapp.channel';
import {
    NotificationChannel,
    ChannelPreferenceOptions,
    TemplateContext,
} from './interfaces';
import { renderTemplate } from './templates';

type ChannelRegistry = Record<NotificationType, NotificationChannel>;

class NotificationOrchestrator {
    private channels: ChannelRegistry;
    constructor() {
        const email = new EmailChannel();
        const whatsapp = new WhatsAppChannel();
        this.channels = {
            EMAIL: email,
            WHATSAPP: whatsapp,
        } as ChannelRegistry;
    }

    async send(
        userId: string,
        event: NotificationEvent,
        ctx: TemplateContext,
        options?: ChannelPreferenceOptions & {
            eventId?: string;
            bookingId?: string;
        },
    ): Promise<void> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return;
        const eventEntity = ctx.event?.title
            ? undefined
            : options?.eventId
              ? await prisma.event.findUnique({
                    where: { id: options.eventId },
                })
              : undefined;
        const bookingEntity = options?.bookingId
            ? await prisma.booking.findUnique({
                  where: { id: options.bookingId },
              })
            : undefined;
        const template = renderTemplate(event, {
            user: user
                ? {
                      firstName: user.firstName || undefined,
                      lastName: user.lastName || undefined,
                      email: user.email,
                  }
                : undefined,
            event:
                ctx.event ||
                (eventEntity
                    ? ({
                          title: eventEntity.title,
                          startDateTime: eventEntity.startDateTime,
                          venue: eventEntity.venue,
                      } as any)
                    : undefined),
            booking:
                ctx.booking ||
                (bookingEntity
                    ? {
                          bookingNumber: bookingEntity.bookingNumber,
                          finalAmount: bookingEntity.finalAmount as any,
                          quantity: bookingEntity.quantity,
                      }
                    : undefined),
            extra: ctx.extra,
        });

        const strategy = options?.strategy || 'ALL';
        const desired = options?.channels || [
            NotificationType.EMAIL,
            NotificationType.WHATSAPP,
        ];

        for (const chType of desired) {
            const channel = this.channels[chType];
            if (!channel || !channel.isAvailable()) {
                if (strategy === 'FALLBACK') continue;
                else continue;
            }
            const recipient =
                chType === 'EMAIL' ? user.email : user.phone || '';
            if (!recipient) continue;
            const result = await channel.send({
                userId,
                event: event,
                type: chType,
                title: template.title,
                message: template.message,
                recipient,
                eventId: options?.eventId,
                bookingId: options?.bookingId,
            });
            await prisma.notification.create({
                data: {
                    userId,
                    eventId: options?.eventId,
                    bookingId: options?.bookingId,
                    type: chType,
                    event,
                    title: template.title,
                    message: template.message,
                    recipient,
                    sentAt: result.success ? new Date() : undefined,
                    metadata: result
                        ? {
                              providerMessageId: result.providerMessageId,
                              error: result.error,
                          }
                        : undefined,
                },
            });
            if (strategy === 'FALLBACK' && result.success) break;
        }
    }
}

export const notificationOrchestrator = new NotificationOrchestrator();
