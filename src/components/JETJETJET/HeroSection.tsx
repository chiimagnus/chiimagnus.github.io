import React, { useEffect, useRef } from 'react';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const airplaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let airplaneX = 0;
    let airplaneY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    };

    const animateAirplane = () => {
      if (airplaneRef.current) {
        airplaneX += (mouseX - airplaneX) * 0.1;
        airplaneY += (mouseY - airplaneY) * 0.1;
        
        airplaneRef.current.style.transform = 
          `translate(-50%, -50%) translateX(${airplaneX}px) translateY(${airplaneY}px) rotate(${airplaneX * 0.5}deg)`;
      }
      requestAnimationFrame(animateAirplane);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateAirplane();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="home" className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JETJETJET
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">飞机运动追踪应用</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              使用手机传感器实时记录运动状态，以3D飞机模型展示完整的飞行轨迹动画
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToFeatures();
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-info-circle mr-2"></i>
                了解更多
              </a>
              <a
                href="#tech"
                onClick={(e) => {
                  e.preventDefault();
                  const techSection = document.querySelector('#tech');
                  if (techSection) {
                    techSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                <i className="fas fa-code mr-2"></i>
                技术架构
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-80 h-80">
              <div
                ref={airplaneRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-blue-600 transition-transform duration-100 animate-pulse"
              >
                <i className="fas fa-fighter-jet"></i>
              </div>
              <div className="absolute top-1/2 left-1/2 w-48 h-48 border-3 border-dashed border-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-60 animate-spin"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div
          className="w-6 h-6 border-r-2 border-b-2 border-blue-600 transform rotate-45 cursor-pointer"
          onClick={scrollToFeatures}
        ></div>
      </div>
    </section>
  );
};

export default HeroSection;
