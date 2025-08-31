import React from 'react';
import Navbar from '@/components/layout/Navbar';
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CategoriesSection,
  StatsSection,
  TestimonialsSection,
  CTASection,
  FooterSection,
} from '../components/sections';

const HomePage = () => {
  return (
    <div className="relative">
      <Navbar />
      <main className="space-y-0">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CategoriesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default HomePage;
