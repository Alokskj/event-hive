import { api } from '@/utils/api';

export interface HostedEventSummary {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  city?: string;
  state?: string;
  bannerImage?: string | null;
  userRole?: string;
}
export interface DashboardEventSummary {
  eventId: string;
  summary: { bookings: number; ticketsSold: number; checkIns: number; revenue: number; capacity: number | null; soldPercentage: number | null };
  today: { bookings: number; checkIns: number };
  generatedAt: string;
}
export class DashboardService {
  static async hostedEvents(): Promise<HostedEventSummary[]> { return api.get<{data: HostedEventSummary[]}>('/events/me/hosted').then(r=> r.data); }
  static async myBookings(params?: { page?: number; limit?: number; search?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return api.get<any>(`/me/bookings${qs? `?${qs}`:''}`);
  }
  static async eventDashboardSummary(eventId: string) { return api.get<DashboardEventSummary>(`/events/${eventId}/dashboard/summary`); }
}
