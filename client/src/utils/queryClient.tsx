import {
    QueryClient,
    QueryClientProvider as RQProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { env } from './env';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes
            retry: (failureCount, error: any) => {
                console.error('Query failed:', error);
                // Don't retry on 4xx errors (client errors)
                if (error) {
                    return false;
                }
                // Retry up to 3 times for other errors
                return failureCount < 3;
            },
            refetchOnWindowFocus: env.isProd,
            refetchOnReconnect: true,
        },
    },
});

interface QueryClientProviderProps {
    children: React.ReactNode;
}

export const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
    children,
}) => {
    return (
        <RQProvider client={queryClient}>
            {children}
            {env.isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </RQProvider>
    );
};
