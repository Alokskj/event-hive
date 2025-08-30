import { NotificationEvent } from '@prisma/client';
import { TemplateContext, ResolvedTemplate } from './interfaces';

type TemplateRenderer = (ctx: TemplateContext) => ResolvedTemplate;

const dateFmt = (d?: Date) =>
    d ? d.toLocaleString('en-US', { hour12: true }) : '';

const templates: Record<NotificationEvent, TemplateRenderer> = {
    BOOKING_CONFIRMATION: (ctx) => ({
        title: `Booking Confirmed - ${ctx.event?.title || ''}`.trim(),
        message: `Hi ${ctx.user?.firstName || 'there'},\n\nYour booking (${ctx.booking?.bookingNumber}) for '${ctx.event?.title}' is confirmed.\nDate: ${dateFmt(ctx.event?.startDateTime)}\nVenue: ${ctx.event?.venue}\nTickets: ${ctx.booking?.quantity}\nAmount: ${ctx.booking?.finalAmount}\n\nSee you there!`,
    }),
    REMINDER_24H: (ctx) => ({
        title: `Reminder: ${ctx.event?.title} is tomorrow`,
        message: `Hi ${ctx.user?.firstName || ''},\nThis is a 24h reminder for '${ctx.event?.title}'.\nStarts: ${dateFmt(ctx.event?.startDateTime)} at ${ctx.event?.venue}.`,
    }),
    REMINDER_1H: (ctx) => ({
        title: `Starting Soon: ${ctx.event?.title}`,
        message: `Your event '${ctx.event?.title}' starts in 1 hour.\nVenue: ${ctx.event?.venue}. Bring your ticket!`,
    }),
    EVENT_UPDATE: (ctx) => ({
        title: `Update: ${ctx.event?.title}`,
        message:
            ctx.extra?.updateMessage ||
            'There is an important update regarding your event.',
    }),
    CANCELLATION: (ctx) => ({
        title: `Event Cancelled: ${ctx.event?.title}`,
        message: `We regret to inform you that '${ctx.event?.title}' has been cancelled. More info soon.`,
    }),
    REFUND_PROCESSED: (ctx) => ({
        title: `Refund Processed - ${ctx.event?.title}`,
        message: `Your refund for booking ${ctx.booking?.bookingNumber} has been processed. Amount: ${ctx.booking?.finalAmount}`,
    }),
};

export function renderTemplate(
    event: NotificationEvent,
    ctx: TemplateContext,
): ResolvedTemplate {
    const renderer = templates[event];
    return renderer
        ? renderer(ctx)
        : { title: 'Notification', message: 'You have a new notification.' };
}
