import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/modules/dashboard/services/dashboard.service';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

const ManageEventsPage = () => {
  const { data, isLoading } = useQuery({ queryKey:['dashboard','hosted-events'], queryFn: DashboardService.hostedEvents });
  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Button asChild><Link to="/dashboard/events/new">Create Event</Link></Button>
      </div>
      {isLoading && <p>Loading...</p>}
      <ul className="space-y-3">
        {data?.map(ev => (
          <li key={ev.id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <p className="font-medium">{ev.title}</p>
              <p className="text-xs text-muted-foreground">{ev.userRole}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild><Link to={`/dashboard/events/${ev.id}`}>Open</Link></Button>
              <Button size="sm" variant="outline" asChild><Link to={`/dashboard/events/${ev.id}/edit`}>Edit</Link></Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ManageEventsPage;
