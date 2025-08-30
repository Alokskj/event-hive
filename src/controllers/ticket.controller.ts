import { Request, Response } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { ApiError } from '../lib/utils/ApiError';
import { ApiResponse } from '../lib/utils/ApiResponse';
import {
    createTicketSchema,
    updateTicketSchema,
    ticketIdSchema,
} from '../schemas/ticket.schema';
import { ticketService } from '../services/ticket.service';

export class TicketController {
    create = asyncHandler(async (req: Request, res: Response) => {
        const data = createTicketSchema.parse({
            ...req.body,
            eventId: req.params.eventId,
        });
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const ticket = await ticketService.createTicket(data, userId);
        res.status(201).json(new ApiResponse(201, ticket, 'Ticket created'));
    });
    listByEvent = asyncHandler(async (req: Request, res: Response) => {
        const eventId = req.params.eventId;
        const tickets = await ticketService.listTickets(eventId);
        res.json(new ApiResponse(200, tickets, 'Tickets fetched'));
    });
    update = asyncHandler(async (req: Request, res: Response) => {
        const { ticketId } = ticketIdSchema.parse(req.params);
        const data = updateTicketSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const ticket = await ticketService.updateTicket(ticketId, data, userId);
        res.json(new ApiResponse(200, ticket, 'Ticket updated'));
    });
    delete = asyncHandler(async (req: Request, res: Response) => {
        const { ticketId } = ticketIdSchema.parse(req.params);
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        await ticketService.deleteTicket(ticketId, userId);
        res.json(new ApiResponse(200, null, 'Ticket deleted'));
    });
}
export const ticketController = new TicketController();
