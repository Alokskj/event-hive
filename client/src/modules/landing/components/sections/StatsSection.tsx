import React from 'react';

const stats = [
  { value: '12k+', label: 'Tickets Sold' },
  { value: '4.8★', label: 'Avg. Event Rating' },
  { value: '2.3k', label: 'Active Organizers' },
  { value: '98%', label: 'Check‑In Success' }
];

const StatsSection = () => (
  <section className="container py-12 md:py-16" id="stats">
    <div className="rounded-3xl border bg-gradient-to-br from-primary/5 via-fuchsia-500/5 to-indigo-500/5 p-8 md:p-12 backdrop-blur">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="text-center space-y-2">
            <p className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-primary to-fuchsia-500 bg-clip-text text-transparent">{s.value}</p>
            <p className="text-[11px] md:text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
