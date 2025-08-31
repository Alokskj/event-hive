import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { EventService } from '../services/event.service';
import { BookingService } from '../services/booking.service';
import { PaymentService } from '../services/payment.service';
import { useState, useMemo } from 'react';
import { env } from '@/utils/env';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Calendar,
    Clock,
    MapPin,
    Tag,
    Users,
    Ticket,
    Star,
} from 'lucide-react';
import { useAuth } from '@/modules/auth';

const EventDetailsPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { data: event, isLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => EventService.get(eventId!),
        enabled: !!eventId,
    });
    const { isAuthenticated } = useAuth();
    const [attendee, setAttendee] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [processing, setProcessing] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);

    const total = useMemo(() => {
        if (!event?.tickets) return 0;
        return event.tickets.reduce(
            (sum, t) => sum + Number(t.price) * (quantities[t.id] || 0),
            0,
        );
    }, [event, quantities]);

    if (isLoading)
        return (
            <div className="container py-12 animate-pulse space-y-6">
                <div className="h-64 rounded-xl bg-muted/40" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="space-y-4 lg:col-span-2">
                        <div className="h-40 rounded-xl bg-muted/30" />
                        <div className="h-56 rounded-xl bg-muted/30" />
                    </div>
                    <div className="h-64 rounded-xl bg-muted/30" />
                </div>
            </div>
        );
    if (!event) return <p className="container py-8">Event not found</p>;

    async function loadScript(src: string) {
        return new Promise<boolean>((resolve) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) return resolve(true);
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    const handleBookAndPay = async () => {
        if (!eventId) return;
        const items = Object.entries(quantities)
            .filter(([, q]) => q > 0)
            .map(([ticketId, q]) => ({ ticketId, quantity: q }));
        if (!items.length) {
            toast.error('Select at least one ticket');
            return;
        }
        if (!attendee.name || !attendee.email) {
            toast.error('Enter attendee details');
            return;
        }
        setProcessing(true);
        try {
            let currentBookingId = bookingId;
            if (!currentBookingId) {
                const b = await BookingService.create(eventId, {
                    attendeeName: attendee.name,
                    attendeeEmail: attendee.email,
                    attendeePhone: attendee.phone,
                    items,
                });
                currentBookingId = b.id;
                setBookingId(b.id);
            }
            const ok = await loadScript(
                'https://checkout.razorpay.com/v1/checkout.js',
            );
            if (!ok) {
                toast.error('Failed to load payment gateway');
                return;
            }
            const init = await PaymentService.initiate(
                currentBookingId,
                'RAZORPAY',
            );
            const options: any = {
                key: init.razorpayKey || env.razorpayKeyId,
                amount: init.amount,
                currency: init.currency,
                name: 'EventHive',
                description: 'Event Booking',
                order_id: init.orderId,
                handler: async (response: any) => {
                    try {
                        await PaymentService.verify(response);
                        toast.success('Payment successful');
                        navigate(
                            `/events/${event.id}/booking/${currentBookingId}`,
                        );
                    } catch (e: any) {
                        toast.error(e.message || 'Verification failed');
                    }
                },
                theme: { color: '#4f46e5' },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (e: any) {
            setBookingId(null);
            toast.error(e.message || 'Booking/payment failed');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-12 pb-16">
            {/* Hero */}
            <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background z-10" />
                {event.bannerImage ? (
                    <img
                        src={event.bannerImage}
                        alt={event.title}
                        className="h-[320px] w-full object-cover"
                    />
                ) : (
                    <div className="h-[320px] w-full bg-gradient-to-br from-muted/40 to-muted" />
                )}
                <div className="container absolute inset-0 z-20 flex items-end pb-6">
                    <div className="max-w-3xl space-y-4">
                        <div className="flex flex-wrap gap-2 items-center">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                                {event.title}
                            </h1>
                            {event.isFeatured && (
                                <Badge className="flex gap-1 items-center">
                                    <Star className="size-3" /> Featured
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs md:text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="size-3" />{' '}
                                {format(new Date(event.startDateTime), 'PP')}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="size-3" />{' '}
                                {format(new Date(event.startDateTime), 'p')} -{' '}
                                {format(new Date(event.endDateTime), 'p')}
                            </span>
                            {event.city && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="size-3" /> {event.city}
                                    {event.state ? ', ' + event.state : ''}
                                </span>
                            )}
                        </div>
                        {event.tags?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {event.tags.map((t) => (
                                    <Badge
                                        key={t}
                                        variant="outline"
                                        className="bg-background/60"
                                    >
                                        {t}
                                    </Badge>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-10">
                    {/* Description */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            About this event
                        </h2>
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                            {event.description}
                        </p>
                    </section>

                    {/* Tickets */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Ticket className="size-4 text-primary" />
                            <h2 className="text-xl font-semibold">Tickets</h2>
                        </div>
                        <Card>
                            <CardContent className="p-0 divide-y">
                                {event.tickets?.length ? (
                                    event.tickets.map((t) => {
                                        const quantity = quantities[t.id] || 0;
                                        const available =
                                            t.quantity - t.soldQuantity;
                                        const soldOut = available <= 0;
                                        return (
                                            <div
                                                key={t.id}
                                                className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between px-4 py-4 group"
                                            >
                                                <div className="space-y-1">
                                                    <p className="font-medium flex items-center gap-2">
                                                        {t.name}
                                                        {soldOut && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="text-[10px]"
                                                            >
                                                                Sold Out
                                                            </Badge>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground flex flex-wrap gap-2">
                                                        <span>₹{t.price}</span>
                                                        <span className="opacity-50">
                                                            ·
                                                        </span>
                                                        <span>
                                                            {available} left
                                                        </span>
                                                        <span className="opacity-50">
                                                            ·
                                                        </span>
                                                        <span>
                                                            Max {t.maxPerUser} /
                                                            user
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-auto">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setQuantities(
                                                                (q) => ({
                                                                    ...q,
                                                                    [t.id]: Math.max(
                                                                        0,
                                                                        quantity -
                                                                            1,
                                                                    ),
                                                                }),
                                                            )
                                                        }
                                                        disabled={
                                                            quantity === 0
                                                        }
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-8 text-center font-medium tabular-nums">
                                                        {quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setQuantities(
                                                                (q) => ({
                                                                    ...q,
                                                                    [t.id]: Math.min(
                                                                        available,
                                                                        quantity +
                                                                            1,
                                                                    ),
                                                                }),
                                                            )
                                                        }
                                                        disabled={
                                                            quantity >=
                                                            available
                                                        }
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-6 text-sm text-muted-foreground">
                                        No tickets available.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Attendee */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Users className="size-4 text-primary" />
                            <h2 className="text-xl font-semibold">
                                Attendee Details
                            </h2>
                        </div>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Full Name
                                        </label>
                                        <Input
                                            placeholder="Jane Doe"
                                            value={attendee.name}
                                            onChange={(e) =>
                                                setAttendee((a) => ({
                                                    ...a,
                                                    name: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={attendee.email}
                                            onChange={(e) =>
                                                setAttendee((a) => ({
                                                    ...a,
                                                    email: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Phone
                                        </label>
                                        <Input
                                            placeholder="Optional"
                                            value={attendee.phone}
                                            onChange={(e) =>
                                                setAttendee((a) => ({
                                                    ...a,
                                                    phone: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Sidebar Summary */}
                <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
                    <Card className="border-primary/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span className="font-medium">
                                        ₹{total}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Fees
                                    </span>
                                    <span className="font-medium">₹0</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">
                                        ₹{total}
                                    </span>
                                </div>
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        toast.error(
                                            'Please login to book tickets',
                                        );
                                        navigate('/auth/login');
                                        return;
                                    }
                                    handleBookAndPay();
                                }}
                                disabled={
                                    processing ||
                                    !total ||
                                    !attendee.name ||
                                    !attendee.email
                                }
                            >
                                {processing
                                    ? 'Processing...'
                                    : bookingId
                                      ? 'Pay Now'
                                      : 'Book & Pay'}
                            </Button>
                            <p className="text-[11px] leading-snug text-muted-foreground">
                                By continuing you agree to our terms and refund
                                policy.
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
};
export default EventDetailsPage;
