import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/dashboard.service';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Search, X, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { generateAndDownloadTicket } from '@/lib/ticket/generateTicketImage';
import { useState, useEffect } from 'react';

export default function MyBookingsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  useEffect(()=> { const t = setTimeout(()=> setDebounced(search), 400); return ()=> clearTimeout(t); }, [search]);
  interface PaginatedBookings { items: any[]; total: number; page: number; pages: number; limit: number; }
  const { data, isLoading } = useQuery<PaginatedBookings>({
    queryKey:['dashboard','my-bookings', page, debounced, limit],
    queryFn: async () => {
      const res: any = await DashboardService.myBookings({ page, limit, search: debounced });
      return res as PaginatedBookings;
    },
    placeholderData: (prev) => prev,
  });
  return (
    <div className="p-6 space-y-6">
     <div className='flex items-start justify-between'>
         <div>
        <h2 className="text-2xl font-bold tracking-tight">My Bookings</h2>
        <p className="text-sm text-muted-foreground">Events you've booked tickets for.</p>
      </div>
        <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e=> { setPage(1); setSearch(e.target.value); }}
                onKeyDown={e=> { if (e.key==='Escape') { setSearch(''); setPage(1);} }}
                placeholder="Search booking #, attendee, event..."
                className="w-96 pl-8 pr-8 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {search && (
                <button type="button" onClick={()=> { setSearch(''); setPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted">
                  <X className="size-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
         
        </div>
      </div>
     </div>
    
      {isLoading && <div className="space-y-3">{Array.from({length:4}).map((_,i)=><div key={i} className="h-20 bg-muted/40 rounded animate-pulse"/>)}</div>}
      <ul className="space-y-4">
  {data?.items?.map((b:any) => (
          <li key={b.id} className="border rounded-md p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <Link to={`/events/${b.event.id}`} className="font-medium hover:underline">{b.event.title}</Link>
                <p className="text-xs text-muted-foreground">{format(new Date(b.event.startDateTime),'PPp')}</p>
                <div className="flex flex-wrap gap-2"><Badge variant="outline" className="text-[10px]">{b.status}</Badge><span className="text-xs text-muted-foreground">Qty {b.quantity}</span></div>
              </div>
              <div className="text-right text-sm min-w-32">
                <p className="font-semibold tabular-nums">₹{b.finalAmount}</p>
                <p className="text-xs text-muted-foreground">Booked {format(new Date(b.createdAt),'PP')}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                disabled={b.status !== 'CONFIRMED'}
                onClick={()=> generateAndDownloadTicket({ booking: b, event: b.event })}
                className="inline-flex items-center gap-1"
              >
                <Download className="size-3" /> Ticket
              </Button>
            </div>
          </li>
        ))}
      </ul>
  {!isLoading && !(data?.items?.length) && <p className="text-sm text-muted-foreground">No bookings found.</p>}
  {data && data.total > 0 && (
        <div className="flex flex-col gap-3 pt-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Showing page {data.page} of {data.pages}</span>
            <span className="hidden sm:inline">{data.total} total</span>
          </div>
          <Pagination
            page={page}
            pages={data.pages}
            onChange={(p)=> setPage(p)}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}

function Pagination({ page, pages, onChange, disabled }: { page: number; pages: number; onChange: (p: number)=> void; disabled?: boolean }) {
  if (pages <= 1) return null;
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons/2));
  let end = start + maxButtons -1;
  if (end > pages) { end = pages; start = Math.max(1, end - maxButtons + 1); }
  const nums = [] as number[];
  for (let i=start;i<=end;i++) nums.push(i);
  return (
    <div className="flex flex-wrap items-center gap-1">
      <Button size="icon" variant="outline" disabled={page===1 || disabled} onClick={()=> onChange(1)} className="h-8 w-8"><ChevronsLeft className="size-3" /></Button>
      <Button size="icon" variant="outline" disabled={page===1 || disabled} onClick={()=> onChange(page-1)} className="h-8 w-8"><ChevronLeft className="size-3" /></Button>
      {start > 1 && <span className="px-2 text-xs text-muted-foreground">…</span>}
      {nums.map(n=> (
        <Button key={n} disabled={disabled} size="icon" variant={n===page? 'default':'outline'} onClick={()=> onChange(n)} className="h-8 w-8 text-xs font-medium">{n}</Button>
      ))}
      {end < pages && <span className="px-2 text-xs text-muted-foreground">…</span>}
      <Button size="icon" variant="outline" disabled={page===pages || disabled} onClick={()=> onChange(page+1)} className="h-8 w-8"><ChevronRight className="size-3" /></Button>
      <Button size="icon" variant="outline" disabled={page===pages || disabled} onClick={()=> onChange(pages)} className="h-8 w-8"><ChevronsRight className="size-3" /></Button>
    </div>
  );
}
