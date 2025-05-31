
import React, { useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { ConfettiButton } from '@/components/ui/ConfettiButton';

export const HeroSection = () => {
  // Optimisation : calcul des particules memoized
  const particleCount = useMemo(() => {
    return window.innerWidth > 768 ? 25 : 12; // Réduit légèrement
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 md:pt-0 pb-4 md:pb-0">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 opacity-80"></div>
      
      {/* Particules animées optimisées */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: particleCount }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20"
            style={{
              width: `${Math.random() * 6 + 2}px`, // Taille réduite
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 18 + 12}s ease-in-out infinite ${Math.random() * 4}s`, // Durée optimisée
              filter: 'blur(1px)',
              willChange: 'transform', // Optimisation GPU
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          {/* Text content */}
          <div className="flex-1 max-w-2xl text-center md:text-left order-1 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight animate-fadeIn">
              <TypewriterText text="Dorry, l'assistante IA qui révolutionne vos réunions" className="block bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent" />
            </h1>
            
            {/* Image positionnée après le titre sur mobile uniquement - ROBOT DORRY RESTAURÉ */}
            <div className="flex md:hidden justify-center items-center relative mb-6 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <div className="relative">
                <div className="hero-image w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center transform-gpu transition-transform duration-300 overflow-hidden">
                  <img 
                    src="/lovable-uploads/769b9b8e-e57b-4e05-85eb-d7dfc432dd29.png" 
                    alt="Dorry AI Assistant" 
                    className="w-full h-full object-contain"
                    loading="eager"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 md:mb-8 px-2 md:px-0">
              Captez chaque moment, analysez en profondeur, et obtenez des comptes rendus précis sans lever le petit doigt.
            </p>
            <div className="flex flex-col items-center md:justify-start mb-8 md:mb-0 animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
              <ConfettiButton href="/support" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all mb-8 md:mb-0">
                Demander l'accès
              </ConfettiButton>
              
              {/* Découvrir section - visible sur mobile en dessous du bouton */}
              <div className="flex md:hidden flex-col items-center opacity-70 mt-2">
                <span className="text-xs uppercase tracking-widest mb-2">Découvrir</span>
                <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />
              </div>
            </div>
          </div>
          
          {/* Image pour desktop uniquement - ROBOT DORRY RESTAURÉ */}
          <div className="hidden md:flex flex-1 justify-center items-center relative order-2 animate-fadeInRight" style={{ animationDelay: '0.5s' }}>
            <div className="relative">
              <div className="hero-image w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center transform-gpu transition-transform duration-300 overflow-hidden">
                <img 
                  src="/lovable-uploads/769b9b8e-e57b-4e05-85eb-d7dfc432dd29.png" 
                  alt="Dorry AI Assistant" 
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full animate-pulse"></div>
              
              {/* Cercles concentriques animés - optimisés */}
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border border-cyan-400/30"
                  style={{ 
                    animation: `ripple 3s ease-out infinite ${i * 0.5}s`,
                    willChange: 'transform, opacity'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Découvrir section - visible sur desktop uniquement en bas de page */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-xs sm:text-sm uppercase tracking-widest mb-2">Découvrir</span>
        <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-bounce" />
      </div>
    </section>
  );
};
