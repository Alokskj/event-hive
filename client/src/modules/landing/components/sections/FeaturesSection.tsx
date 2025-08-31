import React from 'react';
import { LucideIcon, BarChart3, ScanQrCode, Users2, Sparkles, ShieldCheck, Ticket } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, desc }) => (
  <div className="group relative rounded-2xl border bg-background/60 backdrop-blur p-6 shadow-sm hover:shadow-lg transition-all overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-indigo-500/10 transition-opacity" />
    <div className="relative flex items-start gap-4">
      <div className="rounded-xl bg-primary/10 text-primary p-3 ring-1 ring-primary/20">
        <Icon className="size-6" />
      </div>
      <div>
        <h3 className="font-semibold mb-1 text-sm md:text-base">{title}</h3>
        <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  </div>
);

const features: FeatureCardProps[] = [
  {
    icon: Ticket,
    title: 'Smart Ticketing',
    desc: 'Multiple ticket tiers, promo codes, group bundles, refunds & real-time inventory sync.'
  },
  {
    icon: ScanQrCode,
    title: 'Instant Check‑In',
    desc: 'Fast QR / barcode scanning with duplicate prevention & live attendee counters.'
  },
  {
    icon: BarChart3,
    title: 'Actionable Analytics',
    desc: 'Track sales, revenue, demographics & engagement with exportable reports.'
  },
  {
    icon: Users2,
    title: 'Community Focused',
    desc: 'Loyalty points, referrals & personalized recommendations keep attendees coming back.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Reliable',
    desc: 'Robust auth, fraud protection, encrypted payments & audit logs built‑in.'
  },
  {
    icon: Sparkles,
    title: 'Modern Experience',
    desc: 'Fast, accessible UI with map view, filters, live search & multi‑channel notifications.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="container py-20" id="features">
      <div className="mx-auto max-w-2xl text-center mb-12 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">All the tools to make your event thrive</h2>
        <p className="text-muted-foreground text-sm md:text-base">From discovery to post‑event insights, EventHive streamlines every step so you can focus on creating unforgettable experiences.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(f => <FeatureCard key={f.title} {...f} />)}
      </div>
    </section>
  );
};

export default FeaturesSection;
