import { Request, Response } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { analyticsService } from '../services/analytics.service';

export class AnalyticsController {
    getEventAnalytics = asyncHandler(async (req: Request, res: Response) => {
        const { eventId } = req.params;
        const data = await analyticsService.getEventAnalytics(eventId);
        res.json(new ApiResponse(200, data, 'Event analytics'));
    });

    getEventDashboardSummary = asyncHandler(
        async (req: Request, res: Response) => {
            const { eventId } = req.params;
            const userId = req.user?.userId;
            const data = await analyticsService.getEventDashboardSummary(
                eventId,
                userId!,
            );
            res.json(new ApiResponse(200, data, 'Dashboard summary'));
        },
    );

    exportEventReport = asyncHandler(async (req: Request, res: Response) => {
        const { eventId } = req.params;
        const userId = req.user?.userId;
        const { event, rows } = await analyticsService.exportEventReport(
            eventId,
            userId!,
        );
        // Build CSV
        const headers = [
            'bookingNumber',
            'status',
            'attendeeName',
            'attendeeEmail',
            'attendeePhone',
            'quantity',
            'finalAmount',
            'ticketName',
            'ticketType',
            'ticketQty',
            'ticketUnitPrice',
            'createdAt',
            'confirmedAt',
            'cancelledAt',
        ];
        const csv = [headers.join(',')]
            .concat(
                rows.map((r) =>
                    headers.map((h) => formatCsv(String(r[h] ?? ''))).join(','),
                ),
            )
            .join('\n');
        const filename = `${slugify(event.title)}-report-${new Date().toISOString().slice(0, 10)}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${filename}"`,
        );
        res.send(csv);
    });
}
export const analyticsController = new AnalyticsController();

function formatCsv(val: string) {
    if (val == null) return '';
    const needsQuotes = /[",\n]/.test(val);
    const v = val.replace(/"/g, '""');
    return needsQuotes ? `"${v}"` : v;
}
function slugify(str: string) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
