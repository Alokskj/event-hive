import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search } from 'lucide-react';

// Minimal, clean hero: reduced motion, subtle gradient ring, concise copy.
const HeroSection = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = query.trim();
        navigate(q ? `/events?search=${encodeURIComponent(q)}` : '/events');
    };

    return (
        <div className="relative  min-h-[calc(100dvh-120px)] flex items-center pt-10 md:pt-4">
            {/* Radial background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -top-20 flex items-start justify-center overflow-hidden"
            >
                <div className="h-[800px] w-[800px] md:h-[1000px] md:w-[1000px] bg-radial from-primary/15 via-transparent to-transparent rounded-full blur-2xl mt-[-300px]" />
            </div>
            <section className="container relative z-10">
                <div className="mx-auto max-w-3xl text-center space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs md:text-sm shadow-sm">
                        ✨
                        <span className="font-medium">
                            Now supporting instant QR check-ins
                        </span>
                    </div>
                    <h1 className="text-4xl playfair-display sm:text-5xl md:text-7xl font-semibold tracking-tight text-balance">
                        Discover, book & host events effortlessly
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mx-auto max-w-2xl">
                        A fast, modern platform for attendees & organizers.
                        Powerful discovery, simple ticketing, real-time
                        check-ins and actionable analytics — all in one place.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3">
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
