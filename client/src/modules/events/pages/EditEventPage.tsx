import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventService } from '../services/event.service';
import EventForm from '../components/EventForm';
import { toast } from 'sonner';
import { TicketService } from '../services/ticket.service';
import TicketEditor from '../components/TicketEditor';
import { CreateTicketInput, CreateEventInput, UpdateTicketInput } from '../types';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EditEventPage = () => {
  const { eventId } = useParams();
  const qc = useQueryClient();
  const { data: event, isLoading } = useQuery({ queryKey:['event', eventId], queryFn: () => EventService.get(eventId!), enabled: !!eventId });
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Partial<CreateEventInput>>({});
  const { mutateAsync: update, isPending } = useMutation({ mutationFn: (d: any) => EventService.update(eventId!, d), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey:['event', eventId]}); }});
  const { mutateAsync: createTicket } = useMutation({ mutationFn: (d: CreateTicketInput) => TicketService.create(d), onSuccess: () => { toast.success('Ticket added'); qc.invalidateQueries({ queryKey:['event', eventId]}); }});
  const { mutateAsync: updateTicket } = useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateTicketInput }) => TicketService.update(id, data), onSuccess: () => { toast.success('Ticket updated'); qc.invalidateQueries({ queryKey:['event', eventId]}); }});
  const { mutateAsync: deleteTicket } = useMutation({ mutationFn: (id: string) => TicketService.remove(id), onSuccess: () => { toast.success('Ticket removed'); qc.invalidateQueries({ queryKey:['event', eventId]}); }});

  if (isLoading) return <div className="container py-8">Loading...</div>;
  if (!event) return <div className="container py-8">Not found</div>;
  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-col items-start gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={()=> navigate(-1)} className="gap-1 px-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only text-xs">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">Update event details and manage tickets. The live preview updates as you edit.</p>
      </div>
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <EventForm initial={event} onSubmit={(d)=> update(d)} loading={isPending} onChange={(d)=> setDraft(d)} />
          <TicketEditor
            eventId={event.id}
            tickets={event.tickets||[]}
            onCreate={(d)=> createTicket(d)}
            onUpdate={(id,data)=> updateTicket({ id, data })}
            onDelete={(id)=> deleteTicket(id)}
          />
        </div>
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 h-fit">
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preview</CardTitle>
              <p className="text-xs text-muted-foreground">Key info preview. Save to persist changes.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              { (draft.bannerImage || event.bannerImage) ? (
                <img src={(draft.bannerImage || event.bannerImage)!} className="aspect-video w-full object-cover rounded border" />
              ) : (
                <div className="aspect-video w-full bg-muted/40 flex items-center justify-center text-xs text-muted-foreground rounded">Banner Image</div>
              )}
              <div className="space-y-1">
                <h3 className="font-semibold leading-tight break-words">{draft.title || event.title}</h3>
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  {(draft.category || event.category) && <Badge variant="secondary" className="text-[10px] tracking-wide">{draft.category || event.category}</Badge>}
                  {(draft.isFeatured ?? event.isFeatured) && <Badge className="text-[10px]">Featured</Badge>}
                  {(draft.isOnline ?? event.isOnline) && <Badge variant="outline" className="text-[10px]">Online</Badge>}
                  {(draft.tags || event.tags) && Array.isArray(draft.tags || event.tags) && (draft.tags || event.tags)!.slice(0,3).map(t=> (
                    <Badge key={t} variant="outline" className="text-[10px] opacity-80">{t}</Badge>
                  ))}
                </div>
                <p className="text-xs line-clamp-3 text-muted-foreground/80">{draft.shortDescription || event.shortDescription || 'Short description will appear here.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="font-medium">Starts</p>
                  <p className="text-muted-foreground">{(draft.startDateTime || event.startDateTime) ? new Date(draft.startDateTime || event.startDateTime!).toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="font-medium">Ends</p>
                  <p className="text-muted-foreground">{(draft.endDateTime || event.endDateTime) ? new Date(draft.endDateTime || event.endDateTime!).toLocaleString() : '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Venue</p>
                  <p className="text-muted-foreground line-clamp-2">{(draft.isOnline ?? event.isOnline) ? ((draft.onlineLink || event.onlineLink) || 'Online link TBD') : (draft.venue || event.venue) ? `${draft.venue || event.venue}, ${(draft.city || event.city) || ''}` : '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default EditEventPage;
