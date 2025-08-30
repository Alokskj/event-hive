import prisma from '../config/prisma';
import { CreateTicketInput, UpdateTicketInput } from '../schemas/ticket.schema';
import { ApiError } from '../lib/utils/ApiError';
import { Ticket } from '@prisma/client';

export class TicketService {
    async createTicket(
        data: CreateTicketInput,
        userId: string,
    ): Promise<Ticket> {
        const role = await prisma.eventRole.findFirst({
            where: {
                eventId: data.eventId,
                userId,
                role: { in: ['ORGANIZER', 'MANAGER'] },
            },
        });
        if (!role) throw new ApiError(403, 'Not authorized to add tickets');
        if (new Date(data.saleEndDate) <= new Date(data.saleStartDate))
            throw new ApiError(400, 'saleEndDate must be after saleStartDate');
        return prisma.ticket.create({
            data: { ...data, price: data.price.toString() },
        });
    }
    async listTickets(eventId: string): Promise<Ticket[]> {
        return prisma.ticket.findMany({ where: { eventId, isActive: true } });
    }
    async updateTicket(
        ticketId: string,
        data: UpdateTicketInput,
        userId: string,
    ): Promise<Ticket> {
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) throw new ApiError(404, 'Ticket not found');
        const role = await prisma.eventRole.findFirst({
            where: {
                eventId: ticket.eventId,
                userId,
                role: { in: ['ORGANIZER', 'MANAGER'] },
            },
        });
        if (!role) throw new ApiError(403, 'Not authorized to update ticket');
        if (
            data.saleStartDate &&
            data.saleEndDate &&
            new Date(data.saleEndDate) <= new Date(data.saleStartDate)
        )
            throw new ApiError(400, 'saleEndDate must be after saleStartDate');
        return prisma.ticket.update({
            where: { id: ticketId },
            data: {
                ...data,
                price: data.price ? data.price.toString() : undefined,
            },
        });
    }
    async deleteTicket(ticketId: string, userId: string): Promise<void> {
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) throw new ApiError(404, 'Ticket not found');
        const role = await prisma.eventRole.findFirst({
            where: {
                eventId: ticket.eventId,
                userId,
                role: { in: ['ORGANIZER'] },
            },
        });
        if (!role) throw new ApiError(403, 'Not authorized to delete ticket');
        await prisma.ticket.delete({ where: { id: ticketId } });
    }
}
export const ticketService = new TicketService();
