import React, { useEffect, useRef } from 'react';
import { FeatureCard } from '../../types';

interface FeaturesSectionProps {
  features: FeatureCard[];
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features, className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    const featureCards = sectionRef.current?.querySelectorAll('.feature-card');
    featureCards?.forEach((card) => observer.observe(card));

    return () => {
      featureCards?.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className={`py-20 bg-white ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            核心功能
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            强大的传感器技术与精美的3D可视化完美结合
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-card group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              style={{ 
                opacity: 0,
                transform: 'translateY(30px)',
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className={`${feature.icon} text-2xl text-white`}></i>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
