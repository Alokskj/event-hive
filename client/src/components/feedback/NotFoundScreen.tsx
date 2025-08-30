import React, { useEffect, useState } from 'react';
import {
    isRouteErrorResponse,
    Link,
    useNavigate,
    useRouteError,
} from 'react-router';
import { Button } from '@/components/ui/button';
import {
    Home,
    ArrowLeft,
    Search,
    FileQuestion,
    Compass,
    RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotFoundProps {
    className?: string;
    showBackButton?: boolean;
    showHomeButton?: boolean;
    showSearchSuggestion?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({
    className,
    showBackButton = true,
    showHomeButton = true,
    showSearchSuggestion = false,
}) => {
    const navigate = useNavigate();
    const error = useRouteError() as any;
    const [status, setStatus] = useState(404);
    const [title, setTitle] = useState('Page Not Found');
    const [description, setDescription] = useState(
        'An unexpected error occurred.',
    );

    useEffect(() => {
        console.error('Router Error:', error);
        // Check if this is a route error response
        if (isRouteErrorResponse(error)) {
            setStatus(error.status);
            setTitle(error.statusText);
            if (error.status === 404) {
                setDescription(
                    'The page you are looking for does not exist or has been moved.',
                );
            }
        } else {
            setStatus(500);
            setTitle('Internal Server Error');
            setDescription(error?.message as string);
        }
    }, [error]);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div
            className={cn(
                'min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20',
                className,
            )}
        >
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Animation */}
                    <div className="relative mb-8">
                        <div className="relative">
                            {/* Main Status Text */}
                            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text animate-pulse">
                                {status}
                            </h1>

                            {/* Floating Icons */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FileQuestion
                                    className="absolute -top-4 -left-8 w-8 h-8 text-muted-foreground/40 animate-bounce"
                                    style={{ animationDelay: '0.5s' }}
                                />
                                <Compass
                                    className="absolute -top-6 -right-6 w-6 h-6 text-muted-foreground/40 animate-bounce"
                                    style={{ animationDelay: '1s' }}
                                />
                                <Search
                                    className="absolute -bottom-2 left-4 w-7 h-7 text-muted-foreground/40 animate-bounce"
                                    style={{ animationDelay: '1.5s' }}
                                />
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -inset-10 opacity-20">
                            <div
                                className="absolute top-0 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"
                                style={{ animationDelay: '2s' }}
                            ></div>
                            <div
                                className="absolute bottom-0 right-1/4 w-3 h-3 bg-primary/60 rounded-full animate-ping"
                                style={{ animationDelay: '3s' }}
                            ></div>
                            <div
                                className="absolute top-1/2 left-0 w-1 h-1 bg-primary/80 rounded-full animate-ping"
                                style={{ animationDelay: '4s' }}
                            ></div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                {title}
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                            {showHomeButton && (
                                <Button
                                    asChild
                                    size="lg"
                                    className="min-w-[140px]"
                                >
                                    <Link to="/">
                                        <Home className="w-4 h-4 mr-2" />
                                        Go Home
                                    </Link>
                                </Button>
                            )}

                            {showBackButton && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleGoBack}
                                    className="min-w-[140px]"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Go Back
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={handleRefresh}
                                className="min-w-[140px]"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>

                        {/* Search Suggestion */}
                        {showSearchSuggestion && (
                            <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border/50">
                                <div className="flex items-center justify-center gap-3 text-muted-foreground">
                                    <Search className="w-5 h-5" />
                                    <p className="text-sm">
                                        Try using the search feature or
                                        navigation menu to find what you're
                                        looking for.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Help Links */}
                        <div className="mt-8 pt-8 border-t border-border/50">
                            <p className="text-sm text-muted-foreground mb-4">
                                Need help? Try these popular sections:
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    to="/dashboard"
                                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    to="/help"
                                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                                >
                                    Help Center
                                </Link>
                                <Link
                                    to="/contact"
                                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '4s' }}
                ></div>
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '6s', animationDelay: '2s' }}
                ></div>
            </div>
        </div>
    );
};

export default NotFound;
