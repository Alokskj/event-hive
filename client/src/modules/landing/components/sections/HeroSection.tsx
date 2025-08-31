import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const HeroSection = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div className="relative min-h-[calc(100dvh-120px)] flex items-center pt-10 md:pt-4">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -top-20 overflow-hidden"
            >
                <svg
                    className="absolute inset-0 size-full text-foreground/10 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="hero-grid"
                            width="48"
                            height="48"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M48 0H0V48"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.4"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hero-grid)" />
                </svg>
                <div className="h-[800px] w-[800px] md:h-[1000px] md:w-[1000px] bg-radial from-primary/15 via-transparent to-transparent rounded-full blur-2xl mt-[-300px] mx-auto" />
            </div>
            <section className="container relative z-10">
                <div className="mx-auto max-w-3xl text-center space-y-8">
                    <div
                        className={`inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs md:text-sm shadow-sm transition-all duration-700 ease-out will-change-transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}
                    >
                        ✨
                        <span className="font-medium">
                            Now supporting instant QR check-ins
                        </span>
                    </div>
                    <h1
                        className={`text-4xl playfair-display sm:text-5xl md:text-7xl font-semibold tracking-tight text-balance transition-all duration-700 ease-out will-change-transform delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                        Discover, book & host events effortlessly
                    </h1>
                    <p
                        className={`text-muted-foreground text-sm md:text-base leading-relaxed mx-auto max-w-2xl transition-all duration-700 ease-out will-change-transform delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                        A fast, modern platform for attendees & organizers.
                        Powerful discovery, simple ticketing, real-time
                        check-ins and actionable analytics — all in one place.
                    </p>

                    <div
                        className={`flex flex-wrap justify-center gap-3 transition-all duration-700 ease-out will-change-transform delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                        <Button size="lg" asChild>
                            <Link to="/events">Browse Events</Link>
                        </Button>
                        <Button size="lg" variant="secondary" asChild>
                            <Link to="/dashboard/events/new">
                                Host an Event
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeroSection;
