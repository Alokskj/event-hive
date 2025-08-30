import { PropsWithChildren } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { LogOut, CalendarDays, Ticket, BarChart2, QrCode } from 'lucide-react';
import { Button } from '../ui/button';
import { useLogout, useAuth } from '@/modules/auth';

const navItems = [
    { to: '/dashboard', label: 'Overview', icon: BarChart2 },
    { to: '/dashboard/bookings', label: 'My Bookings', icon: Ticket },
    { to: '/dashboard/events', label: 'Hosted Events', icon: CalendarDays },
];

export function DashboardShell({ children }: PropsWithChildren) {
    return <div className="p-6 space-y-6">{children}</div>;
}

export default function DashboardLayout() {
    const location = useLocation();
    const { mutateAsync: logout, isPending } = useLogout();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            <aside className="fixed inset-y-0 left-0 w-60 border-r bg-muted/20 flex flex-col z-30">
                <Link to="/">
                    <div className="h-16 flex items-center px-4 font-semibold text-lg tracking-tight">
                        Event Hive
                    </div>
                </Link>
                <nav className="flex-1 px-2 space-y-1 overflow-y-auto py-2">
                    {navItems.map((item) => {
                        const active = location.pathname === item.to;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors',
                                    active && 'bg-primary/10 text-primary',
                                )}
                            >
                                {<Icon className="size-4" />}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t p-3 space-y-2">
                    <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => logout()}
                        disabled={isPending}
                    >
                        <LogOut className="size-4" /> Logout
                    </Button>
                </div>
            </aside>
            <div className="pl-60 flex flex-col min-h-screen">
                <header className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Dashboard
                    </h1>
                </header>
                <main className="flex-1 overflow-y-auto">
                    <div className="min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
