import React, { useEffect } from 'react';
import { useLandingAnimations } from '@/hooks/useLandingAnimations';
import { Navigation } from '@/components/landing/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { WorkflowSteps } from '@/components/landing/WorkflowSteps';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

const Landing = () => {
  const {
    isNavScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeFeature,
    setActiveFeature,
    handleMouseMove
  } = useLandingAnimations();

  useEffect(() => {
    // Marquer que React est chargé pour permettre la transition
    document.documentElement.setAttribute('data-react-loaded', 'true');
    
    // Masquer le contenu critique après un court délai pour permettre le rendu React
    const timer = setTimeout(() => {
      const criticalElements = document.querySelectorAll('.critical-nav, .critical-hero');
      criticalElements.forEach(el => {
        if (el) {
          (el as HTMLElement).style.display = 'none';
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white" onMouseMove={handleMouseMove}>
      {/* Navigation */}
      <Navigation 
        isNavScrolled={isNavScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Section Concrètement à quoi sert Dorry - Avec nouveau scroll */}
      <AboutSection />

      {/* Workflow Steps */}
      <section className="py-8 md:py-16 lg:py-32 bg-slate-800 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8 md:mb-10">
            Comment ça marche ?
          </h3>
          
          <WorkflowSteps />
          
          <StatsSection />
        </div>
      </section>

      {/* Fonctionnalités Section - Avec nouveau scroll */}
      <FeaturesSection 
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
      />

      {/* Pourquoi choisir Dorry - Avec nouveau scroll */}
      <BenefitsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      
      <style>
        {`
        .nav-link {
          position: relative;
          font-weight: 500;
          padding: 0.5rem 0;
          transition: color 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #00B8D4;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-link:hover {
          color: #00B8D4;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(50px, -30px);
          }
          50% {
            transform: translate(20px, 50px);
          }
          75% {
            transform: translate(-30px, 20px);
          }
        }
        
        @keyframes connectionMove {
          0% {
            background-position: 0 0, 25px 25px;
          }
          100% {
            background-position: 1000px 1000px, 1025px 1025px;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes soundWave {
          0%, 100% {
            height: 10px;
          }
          50% {
            height: 40px;
          }
        }
        
        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-fadeInLeft {
          animation: fadeInLeft 1s ease-out forwards;
        }
        
        .animate-fadeInRight {
          animation: fadeInRight 1s ease-out forwards;
        }
        `}
      </style>
    </div>
  );
};

export default Landing;
