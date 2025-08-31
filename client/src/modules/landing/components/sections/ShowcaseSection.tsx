import React from 'react';

// Placeholder showcase grid illusions (could be replaced with real event images/cards later)
const ShowcaseSection = () => (
  <section className="container py-24" id="showcase">
    <div className="flex items-end justify-between mb-10">
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What\'s trending now</h2>
        <p className="text-muted-foreground text-sm md:text-base">A snapshot of the energy on EventHive.</p>
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="group relative overflow-hidden rounded-2xl border p-5 min-h-40 flex flex-col justify-between bg-gradient-to-br from-muted/60 to-muted/30">
          <div className="space-y-3">
            <div className="h-3 w-20 rounded-full bg-primary/40" />
            <div className="h-3 w-32 rounded-full bg-fuchsia-400/30" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-2 w-16 rounded-full bg-muted-foreground/30" />
            <div className="h-6 w-6 rounded-full bg-primary/30" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ShowcaseSection;
