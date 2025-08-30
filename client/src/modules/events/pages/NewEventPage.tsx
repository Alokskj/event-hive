import { useMutation, useQueryClient } from '@tanstack/react-query';
import EventForm from '../components/EventForm';
import { EventService } from '../services/event.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { CreateEventInput } from '../types';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NewEventPage = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Partial<CreateEventInput>>({});
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateEventInput) => EventService.create(data),
    onSuccess: (ev) => {
      toast.success('Event created');
      qc.invalidateQueries({ queryKey:['my-events']});
      navigate(`/dashboard/events/${ev.id}/edit`);
    }
  });

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-col gap-3 items-start">
          <Button type="button" variant="ghost" size="sm" onClick={()=> navigate(-1)} className="gap-1 px-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only text-xs">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">Fill in the details below. A live preview updates on the right so you can see how your event will appear to attendees.</p>
      </div>
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <EventForm
            onSubmit={(d)=> mutateAsync(d)}
            loading={isPending}
            onChange={(d)=> setDraft(d)}
          />
        </div>
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 h-fit">
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preview</CardTitle>
              <p className="text-xs text-muted-foreground">This is a lightweight preview of key info. Full card after saving may include tickets.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {draft.bannerImage ? (
                <img src={draft.bannerImage} className="aspect-video w-full object-cover rounded border" />
              ) : (
                <div className="aspect-video w-full bg-muted/40 flex items-center justify-center text-xs text-muted-foreground rounded">Banner Image</div>
              )}
              <div className="space-y-1">
                <h3 className="font-semibold leading-tight break-words">{draft.title || 'Event title...'}</h3>
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  {draft.category && <Badge variant="secondary" className="text-[10px] tracking-wide">{draft.category}</Badge>}
                  {draft.isFeatured && <Badge className="text-[10px]">Featured</Badge>}
                  {draft.isOnline && <Badge variant="outline" className="text-[10px]">Online</Badge>}
                  {draft.tags && Array.isArray(draft.tags) && draft.tags.slice(0,3).map(t=> (
                    <Badge key={t} variant="outline" className="text-[10px] opacity-80">{t}</Badge>
                  ))}
                </div>
                <p className="text-xs line-clamp-3 text-muted-foreground/80">{draft.shortDescription || 'Short description will appear here.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="font-medium">Starts</p>
                  <p className="text-muted-foreground">{draft.startDateTime ? new Date(draft.startDateTime).toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="font-medium">Ends</p>
                  <p className="text-muted-foreground">{draft.endDateTime ? new Date(draft.endDateTime).toLocaleString() : '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Venue</p>
                  <p className="text-muted-foreground line-clamp-2">{draft.isOnline ? (draft.onlineLink || 'Online link TBD') : draft.venue ? `${draft.venue}, ${draft.city||''}` : '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
         
        </div>
      </div>
    </div>
  );
};
export default NewEventPage;
