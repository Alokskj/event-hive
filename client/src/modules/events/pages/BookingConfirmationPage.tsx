import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { BookingService } from '../services/booking.service';
import { EventService } from '../services/event.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Download, ArrowRight } from 'lucide-react';
import { useCallback } from 'react';
import { generateAndDownloadTicket } from '@/lib/ticket/generateTicketImage';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const { data: booking, isLoading } = useQuery({ queryKey:['booking', bookingId], queryFn: () => BookingService.get(bookingId!), enabled: !!bookingId });
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['event-for-booking', booking?.eventId],
    queryFn: () => EventService.get(booking!.eventId),
    enabled: !!booking?.eventId,
  });
  const confirmed = booking?.status === 'CONFIRMED';


  if (isLoading) {
    return <div className="container py-16"><div className="mx-auto max-w-md space-y-6 animate-pulse"><div className="h-32 rounded-xl bg-muted/40" /><div className="h-24 rounded-xl bg-muted/30" /><div className="h-10 rounded-md bg-muted/30" /></div></div>;
  }
  if (!booking) {
    return <div className="container py-16">Not found</div>;
  }

  return (
    <div className="container py-16 max-w-3xl space-y-12">
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="size-10 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {confirmed ? 'Payment Successful' : 'Booking Created'}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
          {confirmed ? 'Your booking is confirmed. A confirmation email with your ticket details has been sent.' : 'Your booking is created and pending confirmation.'}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">Booking Summary {confirmed && <Badge variant="secondary">CONFIRMED</Badge>}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Booking #</span><span className="font-medium">{booking.bookingNumber}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium">{booking.status}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Paid</span><span className="font-semibold">₹{booking.finalAmount}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="font-medium">{booking.quantity}</span></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{new Date(booking.createdAt).toLocaleString()}</span></div>
            {booking.confirmedAt && <div className="flex justify-between"><span className="text-muted-foreground">Confirmed</span><span>{new Date(booking.confirmedAt).toLocaleString()}</span></div>}
            {booking.cancelledAt && <div className="flex justify-between"><span className="text-muted-foreground">Cancelled</span><span>{new Date(booking.cancelledAt).toLocaleString()}</span></div>}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button asChild>
          <Link to="/events" className="inline-flex items-center gap-1">Browse more events <ArrowRight className="size-4" /></Link>
        </Button>
      
      </div>

      <div className="text-center text-xs text-muted-foreground">You can access this booking anytime from your dashboard.</div>
    </div>
  );
};
export default BookingConfirmationPage;
