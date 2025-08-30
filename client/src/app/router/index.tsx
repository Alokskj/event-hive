import { createBrowserRouter } from 'react-router';
import { authRoutes } from './routes';
import { NotFoundScreen } from '@/components/feedback';
import { lazy } from 'react';
import { ProtectedRoute } from '@/modules/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';

const HomePage = lazy(() => import('@/modules/landing/pages/HomePage'));
const ExploreEventsPage = lazy(() =>
    import('@/modules/events').then((m) => ({ default: m.ExploreEventsPage })),
);
const EventDetailsPage = lazy(() =>
    import('@/modules/events').then((m) => ({ default: m.EventDetailsPage })),
);
const ManageEventsPage = lazy(() =>
    import('@/modules/events').then((m) => ({ default: m.ManageEventsPage })),
);
const NewEventPage = lazy(() =>
    import('@/modules/events').then((m) => ({ default: m.NewEventPage })),
);
const EditEventPage = lazy(() =>
    import('@/modules/events').then((m) => ({ default: m.EditEventPage })),
);
const BookingConfirmationPage = lazy(() =>
    import('@/modules/events').then((m) => ({
        default: m.BookingConfirmationPage,
    })),
);
const DashboardOverviewPage = lazy(() => import('@/modules/dashboard/pages/OverviewPage'));
const DashboardBookingsPage = lazy(() => import('@/modules/dashboard/pages/MyBookingsPage'));
const HostedEventPage = lazy(() => import('@/modules/dashboard/pages/HostedEventPage'));

export const router = createBrowserRouter([
    {
        errorElement: <NotFoundScreen />,
        children: [
            {
                path: '/auth',
                children: authRoutes,
            },

            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/events',
                element: <ExploreEventsPage />,
            },
            {
                path: '/events/:eventId',
                element: <EventDetailsPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/dashboard',
                        element: <DashboardLayout />,
                        children: [
                            { index: true, element: <DashboardOverviewPage /> },
                            { path: 'bookings', element: <DashboardBookingsPage /> },
                            { path: 'events', element: <ManageEventsPage /> },
                            { path: 'events/new', element: <NewEventPage /> },
                            { path: 'events/:eventId', element: <HostedEventPage /> },
                            { path: 'events/:eventId/edit', element: <EditEventPage /> },
                        ],
                    },
                ],
            },
            {
                path: '/events/:eventId/booking/:bookingId',
                element: <BookingConfirmationPage />,
            },
        ],
    },
]);
