import React from 'react';
import { Link } from 'react-router';

const categories = [
  'Tech',
  'Design',
  'Music',
  'Sports',
  'Business',
  'Education',
  'Gaming',
  'Health',
  'Art',
  'Food & Drink'
];

const CategoriesSection = () => (
  <section className="container py-20" id="categories">
    <div className="flex items-end justify-between mb-10">
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Explore by category</h2>
        <p className="text-muted-foreground text-sm md:text-base">Find something tailored to your passion.</p>
      </div>
      <Link to="/events" className="text-xs font-medium text-primary underline-offset-4 hover:underline">View all</Link>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {categories.map(cat => (
        <Link key={cat} to={`/events?category=${encodeURIComponent(cat)}`} className="group relative overflow-hidden rounded-2xl border p-6 bg-background/60 backdrop-blur transition-all hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{cat[0]}</div>
            <h3 className="font-medium text-sm md:text-base">{cat}</h3>
            <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-2">Discover upcoming {cat.toLowerCase()} events.</p>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default CategoriesSection;
