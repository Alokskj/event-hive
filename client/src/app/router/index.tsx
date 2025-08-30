import { createBrowserRouter } from 'react-router';
import { authRoutes, userRoutes, adminRoutes } from './routes';
import { NotFoundScreen } from '@/components/feedback';

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
                children: userRoutes,
            },
            ...adminRoutes,
        ],
    },
]);
