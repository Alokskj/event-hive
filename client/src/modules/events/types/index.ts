import { BaseEntity } from '@/types';

// Keep enums client-side for selects
export const EVENT_CATEGORIES = [
  'WORKSHOP','CONCERT','SPORTS','HACKATHON','CONFERENCE','NETWORKING','EXHIBITION','CULTURAL','EDUCATIONAL','ENTERTAINMENT'
] as const;
export type EventCategory = typeof EVENT_CATEGORIES[number];

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export interface Event extends BaseEntity {
  title: string;
  description: string;
  shortDescription?: string;
  category: EventCategory;
  tags?: string[];
  status: EventStatus;
  startDateTime: string; // ISO
  endDateTime: string;   // ISO
  timezone?: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isOnline?: boolean;
  onlineLink?: string | null;
  bannerImage?: string;
  galleryImages?: string[];
  maxAttendees?: number;
  isPublic: boolean;
  isFeatured: boolean;
  allowWaitlist?: boolean;
  contactEmail: string;
  contactPhone: string;
  tickets?: Ticket[];
}

export interface Ticket extends BaseEntity {
  eventId: string;
  name: string;
  description?: string;
  type?: string; // TicketType enum simplified
  price: string; // backend sends stringified decimal
  currency?: string;
  quantity: number;
  soldQuantity: number;
  maxPerUser: number;
  saleStartDate: string;
  saleEndDate: string;
  isActive: boolean;
}

export interface EventFilters {
  search?: string;
  category?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: string;
  isFeatured?: boolean;
  isPublic?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedEvents {
  data: Event[];
  meta: { total: number; page: number; limit: number };
}

export interface CreateEventInput {
  title: string;
  description: string;
  shortDescription?: string;
  category: EventCategory;
  tags?: string[];
  status?: EventStatus;
  startDateTime: string; // ISO
  endDateTime: string;   // ISO
  timezone?: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isOnline?: boolean;
  onlineLink?: string | null;
  bannerImage?: string;
  galleryImages?: string[];
  maxAttendees?: number;
  isPublic: boolean;
  isFeatured: boolean;
  allowWaitlist?: boolean;
  contactEmail: string;
  contactPhone: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> { status?: EventStatus }

export interface CreateTicketInput {
  eventId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  maxPerUser: number;
  saleStartDate: string;
  saleEndDate: string;
  type?: string;
}

export interface UpdateTicketInput extends Partial<CreateTicketInput> {}

export interface BookingItemInput { ticketId: string; quantity: number }
export interface CreateBookingInput {
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  items: BookingItemInput[];
  notes?: string;
  metadata?: Record<string, any>;
}

export interface Booking extends BaseEntity {
  bookingNumber: string;
  eventId: string;
  userId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  totalAmount: string;
  discountAmount: string;
  finalAmount: string;
  currency: string;
  quantity: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  confirmedAt?: string;
  cancelledAt?: string;
  qrCode?: string; // base64 (without data URI) from backend
  barcode?: string; // optional future use
}

export interface InitiatePaymentResponse {
  orderId: string;
  amount: number;
  currency: string;
  paymentId: string;
  bookingNumber: string;
  razorpayKey?: string; // added
}
