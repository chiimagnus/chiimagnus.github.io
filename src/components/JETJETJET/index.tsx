import React from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import TechSection from './TechSection';
import JetFooter from './JetFooter';
import { JetJetJetProps } from '../../types';
import jetjetjetData from '../../data/jetjetjet.json';

const JETJETJET: React.FC<JetJetJetProps> = ({ className = '' }) => {
  return (
    <div className={`min-h-screen ${className}`}>
      <Navigation navItems={jetjetjetData.navigation} />
      <HeroSection />
      <FeaturesSection features={jetjetjetData.features} />
      <TechSection techStack={jetjetjetData.techStack} />
      <JetFooter />
    </div>
  );
};

export default JETJETJET;
