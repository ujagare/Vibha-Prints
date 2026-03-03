import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedHero from '../components/EnhancedHero';

const Home = () => {
  return (
    <div className="overflow-x-hidden pt-[7rem] md:pt-[6.5rem]">
      <Helmet>
        <title>Vibha Art - Creative Design & Printing Services</title>
        <meta name="description" content="Transform your vision into a powerful brand with our graphic design and printing services." />
      </Helmet>
      <EnhancedHero />
    </div>
  );
};

export default Home;
