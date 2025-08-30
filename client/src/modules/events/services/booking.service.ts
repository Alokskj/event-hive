import { api } from '@/utils/api';
import { Booking, CreateBookingInput } from '../types';

export class BookingService {
  static async create(eventId: string, data: Omit<CreateBookingInput,'eventId'>) {
    return api.post<Booking>(`/events/${eventId}/bookings`, { ...data, eventId });
  }
  static async get(bookingId: string) { return api.get<Booking>(`/bookings/${bookingId}`); }
  static async listMine() { return api.get<Booking[]>(`/me/bookings`); }
  static async cancel(bookingId: string) { return api.post<{status: string}>(`/bookings/${bookingId}/cancel`,{}); }
}
