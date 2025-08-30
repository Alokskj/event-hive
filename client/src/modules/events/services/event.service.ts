import { api } from '@/utils/api';
import { CreateEventInput, Event, EventFilters, PaginatedEvents, UpdateEventInput } from '../types';

export class EventService {
  static async list(filters: EventFilters = {}) : Promise<PaginatedEvents> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    });
  return api.get<PaginatedEvents>(`/events?${params.toString()}`);
  }
  static async get(eventId: string) {
    return api.get<Event>(`/events/${eventId}`);
  }
  static async create(data: CreateEventInput) {
    return api.post<Event>('/events', data);
  }
  static async update(eventId: string, data: UpdateEventInput) {
    return api.put<Event>(`/events/${eventId}`, data);
  }
  static async remove(eventId: string) {
    return api.delete<null>(`/events/${eventId}`);
  }
}
