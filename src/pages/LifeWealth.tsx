import React from 'react';
import Header from '../components/lifewealth/Header';
import Hero from '../components/lifewealth/Hero';
import About from '../components/lifewealth/About';
import Contacts from '../components/lifewealth/Contacts';
import Features from '../components/lifewealth/Features';
import CTA from '../components/lifewealth/CTA';
import Footer from '../components/lifewealth/Footer';

const LifeWealth: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main>
        <Hero />
        <About />
        <Contacts />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LifeWealth; 