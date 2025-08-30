import { api } from '@/utils/api';
import { CreateTicketInput, Ticket, UpdateTicketInput } from '../types';

export class TicketService {
  static async list(eventId: string) { return api.get<Ticket[]>(`/events/${eventId}/tickets`); }
  static async create(data: CreateTicketInput) { return api.post<Ticket>(`/events/${data.eventId}/tickets`, data); }
  static async update(ticketId: string, data: UpdateTicketInput) { return api.put<Ticket>(`/tickets/${ticketId}`, data); }
  static async remove(ticketId: string) { return api.delete<null>(`/tickets/${ticketId}`); }
}
