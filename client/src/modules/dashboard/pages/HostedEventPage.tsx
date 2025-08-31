import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardService } from '../services/dashboard.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrCode, RefreshCw, BarChart2, ListChecks } from 'lucide-react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { api, apiClient } from '@/utils/api';
import { toast } from 'sonner';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';

export default function HostedEventPage() {
    const { eventId } = useParams();
    const qc = useQueryClient();
    const {
        data: summary,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['dashboard', 'summary', eventId],
        queryFn: () => DashboardService.eventDashboardSummary(eventId!),
        enabled: !!eventId,
    });
    const { data: allHosted } = useQuery({
        queryKey: ['dashboard', 'hosted-events'],
        queryFn: DashboardService.hostedEvents,
    });
    const ev = allHosted?.find((e) => e.id === eventId);
    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        {ev?.title}{' '}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Metrics & check-ins
                    </p>
                </div>
            </div>
            {/* Persistent Stats */}
            {isLoading && (
                <div className="grid md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 bg-muted/40 rounded animate-pulse"
                        />
                    ))}
                </div>
            )}
            {summary && <StatsGrid summary={summary} />}

            <Tabs.Root defaultValue="analytics" className="space-y-6">
                <Tabs.List className="inline-flex gap-1 rounded-md border p-1 bg-muted/30">
                    <Tabs.Trigger
                        value="analytics"
                        className="px-3 py-1.5 text-sm rounded data-[state=active]:bg-background data-[state=active]:shadow inline-flex items-center gap-1"
                    >
                        <BarChart2 className="size-3" /> Analytics
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="checkins"
                        className="px-3 py-1.5 text-sm rounded data-[state=active]:bg-background data-[state=active]:shadow inline-flex items-center gap-1"
                    >
                        <ListChecks className="size-3" /> Check-Ins
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="perform"
                        className="px-3 py-1.5 text-sm rounded data-[state=active]:bg-background data-[state=active]:shadow inline-flex items-center gap-1"
                    >
                        <QrCode className="size-3" /> Perform Check-In
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="analytics" className="space-y-6">
                    <AnalyticsSection eventId={eventId!} />
                </Tabs.Content>
                <Tabs.Content value="checkins" className="space-y-6">
                    <CheckInsTable eventId={eventId!} />
                </Tabs.Content>
                <Tabs.Content value="perform" className="space-y-6">
                    <CheckInSection
                        onSuccess={() =>
                            qc.invalidateQueries({
                                queryKey: ['dashboard', 'summary', eventId],
                            })
                        }
                    />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}

function StatsGrid({ summary }: any) {
    const items = [
        { label: 'Bookings', value: summary.summary.bookings },
        { label: 'Tickets Sold', value: summary.summary.ticketsSold },
        { label: 'Check-Ins', value: summary.summary.checkIns },
        { label: 'Revenue', value: '₹' + summary.summary.revenue },
    ];
    return (
        <div className="grid gap-4 md:grid-cols-4">
            {items.map((i) => (
                <Card key={i.label}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {i.label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-2xl font-semibold tabular-nums">
                            {i.value}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function CheckInSection({ onSuccess }: { onSuccess: () => void }) {
    const [scanning, setScanning] = useState(false);
    const [lastResult, setLastResult] = useState<any | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [lastScan, setLastScan] = useState<{
        code: string;
        ts: number;
    } | null>(null);
    const mutation = useMutation({
        mutationFn: async (payload: {
            bookingNumber?: string;
            bookingId?: string;
            method: string;
        }) => api.post<any>('/check-in', payload),
        onSuccess: (data: any) => {
            setLastResult(data.booking);
            const name =
                data?.booking?.attendeeName || data?.booking?.attendeeEmail;
            toast.success(
                data?.alreadyCheckedIn
                    ? `Already checked in${name ? ' - ' + name : ''}`
                    : `Checked in${name ? ' - ' + name : ''}`,
            );
            onSuccess();
        },
        onError: (e: any) => {
            toast.error(e?.message || 'Check-in failed');
        },
    });
    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <QrCode className="size-4" /> Scanner
                    </CardTitle>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            if (scanning) {
                                setScanning(false);
                            } else {
                                setCameraError(null);
                                setScanning(true);
                            }
                        }}
                    >
                        {scanning ? 'Stop' : 'Start'}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="relative w-full overflow-hidden rounded-md border bg-black/40 aspect-[3/4]">
                        {scanning ? (
                            <div className="absolute inset-0">
                                <QRScanner
                                    onResult={(code) => {
                                        // Throttle duplicate rapid scans of same code within 1.5s
                                        if (
                                            lastScan &&
                                            lastScan.code === code &&
                                            Date.now() - lastScan.ts < 1500
                                        )
                                            return;
                                        setLastScan({ code, ts: Date.now() });
                                        let bookingNumber: string | undefined;
                                        let bookingId: string | undefined;
                                        try {
                                            const data = JSON.parse(code);
                                            bookingNumber =
                                                data.bookingNumber ||
                                                data.bookingId;
                                            bookingId = data.bookingId;
                                        } catch {
                                            if (/^[A-Z0-9-]{4,}$/i.test(code))
                                                bookingNumber = code.trim();
                                        }
                                        if (!bookingNumber && !bookingId) {
                                            toast.error('Invalid QR payload');
                                            return; // keep scanning
                                        }
                                        mutation.mutate({
                                            bookingNumber,
                                            bookingId,
                                            method: 'QR',
                                        });
                                    }}
                                    onError={(err) => {
                                        setCameraError(
                                            err?.message || 'Camera error',
                                        );
                                        setScanning(false);
                                    }}
                                />
                                <div className="pointer-events-none absolute inset-0 m-4 border-2 border-primary/60 rounded-md" />
                                <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/40 to-transparent h-16 text-white text-[10px] flex items-center justify-center tracking-wide">
                                    ALIGN QR WITH FRAME
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-xs text-muted-foreground px-4 p-3 gap-2">
                                <QrCode className="size-8 text-primary" />
                                <p>
                                    Press Start to activate camera and scan
                                    booking QR.
                                </p>
                                {cameraError && (
                                    <p className="text-red-500">
                                        {cameraError}
                                    </p>
                                )}
                                <p className="text-[10px] leading-snug">
                                    If camera does not start, ensure browser
                                    permission is granted and you are using
                                    https / localhost.
                                </p>
                            </div>
                        )}
                    </div>
                    {lastResult && (
                        <div className="text-xs p-2 rounded bg-muted/40 border">
                            <p className="font-medium truncate">
                                {lastResult.attendeeName ||
                                    lastResult.attendeeEmail}
                            </p>
                            <p className="text-muted-foreground">
                                #{lastResult.bookingNumber}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                            Manual Check-In
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ManualCheckIn
                            onSubmit={(val) =>
                                mutation.mutate({
                                    bookingNumber: val.trim(),
                                    method: 'MANUAL',
                                })
                            }
                            loading={mutation.isPending}
                        />
                    </CardContent>
                </Card>
                {lastResult && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                                Last Result
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm flex flex-wrap gap-4">
                            <div>
                                <span className="block text-xs text-muted-foreground">
                                    Booking #
                                </span>
                                <span className="font-mono text-xs">
                                    {lastResult.bookingNumber}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground">
                                    Attendee
                                </span>
                                <span>
                                    {lastResult.attendeeName ||
                                        lastResult.attendeeEmail}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground">
                                    Qty
                                </span>
                                <span>{lastResult.quantity}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground">
                                    Status
                                </span>
                                <span>{lastResult.status}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

function AnalyticsSection({ eventId }: { eventId: string }) {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard', 'analytics', eventId],
        queryFn: () => api.get<any>(`/events/${eventId}/analytics`),
        enabled: !!eventId,
    });
    function handleExport() {
        const url = `${apiClient.defaults.baseURL}/events/${eventId}/export`;
        fetch(url, { credentials: 'include' })
            .then(async (r) => {
                if (!r.ok) throw new Error('Export failed');
                const blob = await r.blob();
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = `event-report-${new Date()
                    .toISOString()
                    .slice(0, 10)}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(objectUrl);
            })
            .catch((e) => {
                console.error(e);
                toast.error('Could not export CSV');
            });
    }
    if (isLoading)
        return <div className="h-64 rounded bg-muted/40 animate-pulse" />;
    if (!data)
        return (
            <p className="text-sm text-muted-foreground">No analytics yet.</p>
        );
    const chartData = data.ticketBreakdown.map((t: any) => ({
        name: t.name,
        tickets: t.quantity,
        revenue: t.revenue,
    }));
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2 flex justify-end">
                <Button size="sm" variant="outline" onClick={handleExport}>
                    Export CSV
                </Button>
            </div>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Ticket Sales</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" hide={chartData.length > 6} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="tickets" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Revenue by Ticket</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" hide={chartData.length > 6} />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="revenue"
                                fill="hsl(var(--secondary-foreground))"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}

function CheckInsTable({ eventId }: { eventId: string }) {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['dashboard', 'checkins', eventId],
        queryFn: () => api.get<any[]>(`/events/${eventId}/check-ins`),
        enabled: !!eventId,
        refetchInterval: 15000, // 15s refresh
    });
    return (
        <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">
                    Recent Check-Ins ({data?.length || 0})
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => refetch()}>
                    Refresh
                </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                {isLoading && (
                    <div className="h-32 bg-muted/40 animate-pulse rounded" />
                )}
                {!isLoading && !data?.length && (
                    <p className="text-sm text-muted-foreground py-4">
                        No check-ins yet.
                    </p>
                )}
                {!!data?.length && (
                    <table className="w-full text-sm">
                        <thead className="text-xs text-muted-foreground">
                            <tr className="text-left border-b">
                                <th className="py-2 pr-4">Time</th>
                                <th className="py-2 pr-4">Booking #</th>
                                <th className="py-2 pr-4">Attendee</th>
                                <th className="py-2 pr-4">Qty</th>
                                <th className="py-2 pr-4">Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 200).map((c: any) => (
                                <tr
                                    key={c.id}
                                    className="border-b last:border-0"
                                >
                                    <td className="py-1 pr-4 tabular-nums">
                                        {format(
                                            new Date(c.checkedInAt),
                                            'HH:mm:ss',
                                        )}
                                    </td>
                                    <td className="py-1 pr-4 font-mono text-xs">
                                        {c.booking.bookingNumber}
                                    </td>
                                    <td className="py-1 pr-4">
                                        {c.booking.attendeeName ||
                                            c.booking.attendeeEmail}
                                    </td>
                                    <td className="py-1 pr-4">
                                        {c.booking.quantity}
                                    </td>
                                    <td className="py-1 pr-4 text-xs">
                                        {c.method}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
}

function QRScanner({
    onResult,
    onError,
}: {
    onResult: (code: string) => void;
    onError?: (err: any) => void;
}) {
    return (
        <QrScanner
            onDecode={(res: string) => {
                if (res) onResult(res);
            }}
            onError={(err: any) => onError?.(err)}
            constraints={{ facingMode: { ideal: 'environment' } }}
            containerStyle={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0,
            }}
            videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    );
}

function ManualCheckIn({
    onSubmit,
    loading,
}: {
    onSubmit: (v: string) => void;
    loading: boolean;
}) {
    const [value, setValue] = useState('');
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (value) onSubmit(value);
            }}
            className="flex flex-col sm:flex-row gap-2"
        >
            <input
                className="flex-1 px-3 py-2 text-sm rounded border bg-background"
                placeholder="Enter booking number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Button disabled={!value || loading} type="submit">
                {loading ? 'Checking...' : 'Check-In'}
            </Button>
        </form>
    );
}
