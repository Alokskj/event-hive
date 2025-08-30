import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/dashboard.service';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, Users, Ticket, IndianRupee } from 'lucide-react';
import { useState } from 'react';

export default function OverviewPage() {
  const { data: hosted, isLoading } = useQuery({ queryKey:['dashboard','hosted-events'], queryFn: DashboardService.hostedEvents });
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">Quick look at the events you host.</p>
      </div>
  {isLoading && <div className="grid md:grid-cols-3 gap-6">{Array.from({length:3}).map((_,i)=><div key={i} className="h-40 rounded-md bg-muted/40 animate-pulse"/> )}</div>}
      <div className="grid md:grid-cols-3 gap-6">
        {hosted?.map(ev => <EventSummaryCard key={ev.id} event={ev}/>)}
      </div>
      {!isLoading && !hosted?.length && <p className="text-sm text-muted-foreground">You are not hosting any events yet.</p>}
    </div>
  );
}

function EventSummaryCard({ event }: any) {
  const { data, isLoading } = useQuery({ queryKey:['dashboard','summary', event.id], queryFn: () => DashboardService.eventDashboardSummary(event.id) });
  return (
    <Card className="relative overflow-hidden group">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span className="line-clamp-1">{event.title}</span>
          <Link to={`/dashboard/events/${event.id}`} className="text-xs inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition text-primary">Open <ArrowRight className="size-3"/></Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <div className="h-20 animate-pulse bg-muted/40 rounded" />}
        {data && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Metric label="Bookings" value={data.summary.bookings} icon={Calendar} />
            <Metric label="Tickets" value={data.summary.ticketsSold} icon={Ticket} />
            <Metric label="Check-Ins" value={data.summary.checkIns} icon={Users} />
            <Metric label="Revenue" value={`₹${data.summary.revenue}`} icon={IndianRupee} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value, icon:Icon }: {label:string; value:any; icon:any}) {
  return <div className="flex flex-col gap-1 rounded-md border p-2 bg-muted/30">
    <span className="text-[10px] uppercase font-medium tracking-wide text-muted-foreground flex items-center gap-1"><Icon className="size-3"/> {label}</span>
    <span className="font-semibold tabular-nums text-sm">{value}</span>
  </div>;
}
