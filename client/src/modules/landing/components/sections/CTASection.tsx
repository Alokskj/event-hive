import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const CTASection = () => (
  <section className="container py-28" id="get-started">
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-indigo-500/10 px-8 py-16 md:px-16 text-center">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="relative space-y-6 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to create an unforgettable event?</h2>
        <p className="text-muted-foreground text-sm md:text-base">Join thousands of organizers who trust EventHive for seamless ticketing, engagement & analytics.</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button size="lg" asChild>
            <Link to="/dashboard/events/new">Start Hosting</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/events">Find Events</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
