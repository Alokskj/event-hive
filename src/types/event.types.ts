import { Event, EventStatus, EventCategory, EventRoleType } from '@prisma/client';

export type EventWithRelations = Event & {
    tickets?: any[];
    eventRoles?: any[];
    bookings?: any[];
    reviews?: any[];
    notifications?: any[];
    analytics?: any[];
    checkIns?: any[];
};

export type EventFilters = {
    category?: EventCategory;
    status?: EventStatus;
    city?: string;
    state?: string;
    country?: string;
    isFeatured?: boolean;
    isPublic?: boolean;
    search?: string;
    skip?: number;
    take?: number;
};
