import { Suspense } from 'react';
import LoadingScreen from './LoadingScreen';

interface SuspenseProviderProps {
    children?: React.ReactNode;
}
const SuspenseProvider = ({ children }: SuspenseProviderProps) => {
    return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
};

export default SuspenseProvider;
