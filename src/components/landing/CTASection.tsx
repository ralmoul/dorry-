
import React, { useMemo } from 'react';
import { ConfettiButton } from '@/components/ui/ConfettiButton';
import { Link } from 'react-router-dom';

export const CTASection = () => {
  const badges = [{
    text: "IA avancée",
    color: "from-cyan-400 to-blue-500"
  }, {
    text: "Sécurisé",
    color: "from-blue-500 to-purple-500"
  }, {
    text: "Confidentiel",
    color: "from-purple-500 to-blue-500"
  }, {
    text: "Rapide",
    color: "from-blue-500 to-cyan-400"
  }];

  // Optimisation : particules réduites
  const particleCount = useMemo(() => {
    return window.innerWidth > 768 ? 30 : 15; // Réduit de 40/20 à 30/15
  }, []);

  return (
    <section className="py-16 md:py-32 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 relative overflow-hidden">
      {/* Particules animées optimisées */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: particleCount }).map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20" 
            style={{
              width: `${Math.random() * 5 + 2}px`, // Taille réduite
              height: `${Math.random() * 5 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 18 + 8}s ease-in-out infinite ${Math.random() * 4}s`, // Durée optimisée
              filter: 'blur(1px)',
              willChange: 'transform'
            }} 
          />
        ))}
      </div>
      
      {/* Vagues animées simplifiées */}
      <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
          <path fill="url(#gradient)" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" style={{
            animation: 'wave 20s ease-in-out infinite',
            willChange: 'transform'
          }}></path>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 max-w-4xl mx-auto animate-fadeIn">
          Rejoignez la nouvelle génération d'accompagnateurs augmentés par l'IA !
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 md:mb-12 max-w-2xl mx-auto px-2 md:px-0 animate-fadeInUp" style={{
          animationDelay: '0.2s'
        }}>
          L'esprit libre, le suivi assuré. Essayez dès maintenant et faites la différence.
        </p>

        <div className="animate-fadeInUp" style={{
          animationDelay: '0.4s'
        }}>
          <Link to="/contact">
            <ConfettiButton className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all">
              Demander l'accès
            </ConfettiButton>
          </Link>
        </div>
        
        {/* Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 animate-fadeInUp" style={{
          animationDelay: '0.6s'
        }}>
          {badges.map((badge, index) => (
            <div key={index} className={`px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} text-slate-900 font-semibold text-sm shadow-lg`}>
              {badge.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
