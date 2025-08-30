import { createBrowserRouter } from 'react-router';
import { authRoutes } from './routes';
import { NotFoundScreen } from '@/components/feedback';
import { lazy } from 'react';

const HomePage = lazy(() => import('@/modules/landing/pages/HomePage'));

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
        ],
    },
]);
