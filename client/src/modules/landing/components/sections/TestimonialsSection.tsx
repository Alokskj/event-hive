import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: 'EventHive cut our manual check‑in time by 70%. The live dashboard is invaluable.',
    name: 'Aarav Sharma',
    role: 'Tech Conference Organizer'
  },
  {
    quote: 'Promo codes + analytics helped us sell out our music fest a week early.',
    name: 'Priya Mehta',
    role: 'Festival Director'
  },
  {
    quote: 'Smooth booking experience & loyalty points keep our community engaged.',
    name: 'Vikram Singh',
    role: 'Startup Meetup Host'
  }
];

const TestimonialsSection = () => (
  <section className="container py-24" id="testimonials">
    <div className="mx-auto max-w-2xl text-center mb-14 space-y-4">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by organizers & attendees</h2>
      <p className="text-muted-foreground text-sm md:text-base">We obsess over experience – so you don\'t have to. Here\'s what people are saying.</p>
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map(t => (
        <div key={t.name} className="relative rounded-2xl border bg-background/60 p-6 backdrop-blur group overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-indigo-500/10 transition-opacity" />
          <Quote className="size-6 text-primary/60 mb-4" />
          <p className="text-sm leading-relaxed relative z-10">{t.quote}</p>
          <div className="mt-5">
            <p className="text-sm font-medium">{t.name}</p>
            <p className="text-[11px] text-muted-foreground">{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TestimonialsSection;
