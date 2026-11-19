import FeaturedServices from '@/components/home/featured-services';
import HeroSection from '@/components/home/hero-section';
import HowItWorks from '@/components/home/how-it-works';
import React from 'react';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedServices />
      <HowItWorks />
    </div>
  );
};

export default HomePage;
