import FeaturedServices from '@/components/home/featured-services';
import HeroSection from '@/components/home/hero-section';
import HowItWorks from '@/components/home/how-it-works';
import PopularCategories from '@/components/home/popular-categories';
import React from 'react';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedServices />
      <HowItWorks />
      <PopularCategories />
    </div>
  );
};

export default HomePage;
