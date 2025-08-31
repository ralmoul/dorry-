
import React, { useRef } from 'react';
import { Mic, Brain, Search, FileText } from 'lucide-react';

interface FeaturesSectionProps {
  activeFeature: number;
  setActiveFeature: (index: number) => void;
}

export const FeaturesSection = ({ activeFeature, setActiveFeature }: FeaturesSectionProps) => {
  const featuresRef = useRef(null);

  const features = [
    {
      title: "Parlez, Dorry écoute",
      description: "Enregistrez vos réunions ou entretiens, même en mains libres, avec une qualité audio exceptionnelle. Dorry capture chaque mot, chaque nuance, même quand vous êtes concentré sur l'essentiel.",
      icon: <Mic className="w-10 h-10 md:w-12 md:h-12" />
    },
    {
      title: "Analyse instantanée par IA",
      description: "Dorry comprend chaque échange, détecte les points clés, les adresses, les RDV pris. L'IA identifie les décisions et les actions à entreprendre avec une précision remarquable.",
      icon: <Brain className="w-10 h-10 md:w-12 md:h-12" />
    },
    {
      title: "Détection avancée",
      description: "Repère automatiquement les adresses et vérifie si votre porteur de projet est en QPV. Dorry reste connectée et attentive, même quand l'humain décroche.",
      icon: <Search className="w-10 h-10 md:w-12 md:h-12" />
    },
    {
      title: "Compte rendu détaillé",
      description: "Recevez une synthèse claire livrée en moins de 5 minutes, complète, prête à être archivée. Un compte-rendu structuré et précis disponible en quelques minutes.",
      icon: <FileText className="w-10 h-10 md:w-12 md:h-12" />
    }
  ];

  const featureIcons = [
    { icon: <Mic className="w-full h-full" />, position: 'top-0 left-0', color: 'from-orange-400 to-yellow-500' },
    { icon: <Brain className="w-full h-full" />, position: 'top-0 right-0', color: 'from-yellow-500 to-amber-500' },
    { icon: <Search className="w-full h-full" />, position: 'bottom-0 left-0', color: 'from-amber-500 to-orange-400' },
    { icon: <FileText className="w-full h-full" />, position: 'bottom-0 right-0', color: 'from-orange-400 to-yellow-500' }
  ];

  return (
    <section className="py-16 md:py-32 bg-slate-900 relative overflow-hidden" ref={featuresRef}>
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 opacity-10"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s ease-in-out infinite ${Math.random() * 5}s`,
              filter: 'blur(3px)'
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent">
            Fonctionnalités qui font la différence
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-orange-100/90 max-w-3xl mx-auto px-2 md:px-0">
            Découvrez comment Dorry simplifie votre quotidien professionnel
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Feature Showcase - Left Side */}
          <div className="flex-1 order-2 md:order-1 animate-fadeInLeft" style={{ animationDelay: '0.3s' }}>
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Feature Icons with Animation */}
              {featureIcons.map((item, index) => (
                <div
                  key={index}
                  className={`absolute w-1/2 h-1/2 p-6 ${item.position} transition-all duration-500 transform`}
                  style={{
                    opacity: activeFeature === index ? 1 : 0.3,
                    transform: activeFeature === index ? 'scale(1.1)' : 'scale(0.9)',
                    filter: activeFeature === index ? 'none' : 'blur(1px)'
                  }}
                >
                  <div className={`w-full h-full rounded-2xl bg-slate-800/50 backdrop-blur-sm flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r ${item.color} p-4 border border-slate-700/50 shadow-lg`}>
                    {item.icon}
                  </div>
                </div>
              ))}
              
              {/* Connecting lines */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1/3 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-500 origin-left"
                  style={{
                    transform: `rotate(${i * 90}deg)`,
                    opacity: activeFeature === i ? 1 : 0.3,
                    transition: 'opacity 0.5s ease'
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Feature Details - Right Side */}
          <div className="flex-1 order-1 md:order-2 animate-fadeInRight" style={{ animationDelay: '0.3s' }}>
            <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50 shadow-lg">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 transform ${activeFeature === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}
                  style={{ display: activeFeature === index ? 'block' : 'none' }}
                >
                  <div className="flex items-center mb-4">
                    <div className="text-orange-400 mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-400">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-lg text-orange-100/90 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Feature navigation */}
                  <div className="mt-8 flex justify-center space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <button
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFeature === i ? 'bg-orange-400 w-6' : 'bg-slate-600'}`}
                        onClick={() => setActiveFeature(i)}
                      ></button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
