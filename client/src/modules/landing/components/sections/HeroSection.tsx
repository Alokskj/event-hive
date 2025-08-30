import { Button } from '@/components/ui/button';
import React from 'react';

const HeroSection = () => {
    return (
        <div className="min-h-[calc(100dvh-80px)] flex flex-col justify-center relative">
            <div className='absolute bottom-0 left-0 size-60 rounded-full bg-primary blur-3xl opacity-30'></div>
            <div className='absolute top-0 right-0 size-60 rounded-full bg-primary blur-3xl opacity-30'></div>
            <section className="container">
                <div className="space-y-6 text-center">
                    <h1 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-7xl max-w-[900px] mx-auto">
                        Discover and book exceptional events
                    </h1>
                    <p className="mx-auto max-w-2xl text-balance text-sm text-muted-foreground sm:text-base leading-relaxed">
                        Search thousands of conferences, workshops, concerts,
                        sports, and exhibitions. Clean design, fast performance,
                        and a smooth booking experience.
                    </p>

                    <div className="flex items-center justify-center gap-3">
                        <Button size="lg">Browse Events</Button>
                        <Button size="lg" variant="secondary">
                            Host an Event
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeroSection;
