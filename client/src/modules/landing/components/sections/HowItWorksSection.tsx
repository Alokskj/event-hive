import React from 'react';
import { useReveal, revealClass } from '../hooks/useReveal';
import { CalendarCheck2, Share2, LayoutDashboard, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Share2,
    title: 'Publish',
    desc: 'Create your event with rich details, ticket tiers & promo logic. Publish when ready.'
  },
  {
    icon: CalendarCheck2,
    title: 'Promote',
    desc: 'Share smart links & QR codes. Let the platform recommend it to the right audience.'
  },
  {
    icon: CheckCircle2,
    title: 'Check‑In',
    desc: 'Scan attendee tickets with instant validation and real‑time occupancy stats.'
  },
  {
    icon: LayoutDashboard,
    title: 'Analyze',
    desc: 'Monitor sales, revenue & engagement with exported reports and dashboards.'
  }
];

const HowItWorksSection = () => {
  const { ref: leftRef, shown: leftShown } = useReveal({ threshold: 0.25 });
  const { ref: rightRef, shown: rightShown } = useReveal({ threshold: 0.25 });
  return (
    <section className="container py-24" id="how-it-works">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div ref={leftRef as any} className={revealClass(leftShown, 'space-y-6')}>
          <h2 className="text-3xl md:text-4xl font-bold playfair-display">Host events in four simple steps</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-prose">We built an opinionated flow that removes friction. Launch faster. Sell smarter. Learn more from every event you run.</p>
          <div className="space-y-5">
            {steps.map((s, i) => {
              const { ref, shown } = useReveal({ threshold: 0.3 });
              return (
                <div
                  key={s.title}
                  ref={ref as any}
                  style={{ transitionDelay: shown ? `${i * 70}ms` : undefined }}
                  className={revealClass(shown, 'flex gap-4')}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    <s.icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm md:text-base">{i + 1}. {s.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div ref={rightRef as any} className={revealClass(rightShown, 'relative')}>
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-fuchsia-500/10 to-indigo-500/10 rounded-3xl blur-xl" />
          <div className="relative aspect-[4/3] w-full rounded-2xl border bg-background/70 backdrop-blur p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-3 w-32 rounded-full bg-primary/40" />
              <div className="h-3 w-20 rounded-full bg-fuchsia-400/40" />
              <div className="grid grid-cols-3 gap-4 pt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl border bg-gradient-to-br from-muted/40 to-muted/10" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-6 rounded-full bg-muted/70" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
