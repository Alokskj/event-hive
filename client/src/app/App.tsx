import { RouterProvider } from 'react-router';
import { router } from './router';
import { Suspense } from 'react';
import LoadingScreen from '@/components/feedback/LoadingScreen';
import { QueryClientProvider } from '@/utils/queryClient';
import { Toaster } from '@/components/ui/sonner';

function App() {
    return (
        <>
            <QueryClientProvider>
                <Suspense fallback={<LoadingScreen />}>
                        <RouterProvider router={router} />
                </Suspense>
                <Toaster expand />
            </QueryClientProvider>
        </>
    );
}

export default App;
