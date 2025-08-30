import { Event } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Calendar, MapPin, Ticket, Star } from 'lucide-react';

export const EventCard = ({ event }: { event: Event }) => {
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);
  const dateLabel = format(start, 'MMM d');
  const timeRange = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  const lowestPrice = event.tickets && event.tickets.length
    ? event.tickets.reduce((min, t) => Math.min(min, parseFloat(t.price)), Infinity)
    : null;
  return (
    <Card className="group p-0 overflow-hidden flex flex-col border-muted/60 hover:border-primary/40 transition-colors bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="relative">
        <AspectRatio ratio={16/9} className='overflow-hidden'>
          {event.bannerImage ? (
            <img
              loading="lazy"
              src={event.bannerImage}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted text-xs text-muted-foreground">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-90" />
          <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
            <Badge variant="secondary" className="backdrop-blur-sm bg-background/70">{event.category}</Badge>
            {event.isFeatured && <Badge className="flex gap-1 items-center"><Star className="size-3" /> Featured</Badge>}
          </div>
          <div className="absolute bottom-2 left-2 text-xs font-medium px-2 py-1 rounded-md bg-background/70 backdrop-blur-sm ring-1 ring-border flex items-center gap-2">
            <span>{dateLabel}</span>
            <span className="text-muted-foreground">{timeRange}</span>
          </div>
        </AspectRatio>
      </div>
      <CardContent className="p-4 flex flex-col gap-3 flex-1">
        <div className="space-y-1">
          <Link to={`/events/${event.id}`} className="font-semibold leading-tight line-clamp-2 text-base hover:underline underline-offset-4">
            {event.title}
          </Link>
          {event.shortDescription || event.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {event.shortDescription || event.description}
            </p>
          ) : null}
        </div>
        <div className="mt-auto space-y-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-1.5">
            <Calendar className="size-3 mt-0.5" />
            <span>{format(start, 'PP')} · {timeRange}</span>
          </div>
          {event.city && (
            <div className="flex items-start gap-1.5">
              <MapPin className="size-3 mt-0.5" />
              <span>{event.city}{event.state ? ', ' + event.state : ''}</span>
            </div>
          )}
          <div className="flex items-start gap-1.5">
            <Ticket className="size-3 mt-0.5" />
            {event.tickets?.length ? (
              <span>{event.tickets.length} ticket type{event.tickets.length>1?'s':''}{lowestPrice !== null && isFinite(lowestPrice) && (<>
                <span className="mx-1">·</span><span className="font-medium text-foreground">From ₹{lowestPrice.toFixed(0)}</span>
              </> )}</span>
            ) : <span>No tickets yet</span>}
          </div>
        </div>
        <div className="pt-1">
          <Link
            to={`/events/${event.id}`}
            className="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
          >
            View Details <span aria-hidden>→</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
