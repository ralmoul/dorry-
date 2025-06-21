
import React, { useRef } from 'react';
import { Mic, Brain, Search, FileText } from 'lucide-react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

interface FeaturesSectionProps {
  activeFeature: number;
  setActiveFeature: (index: number) => void;
}

export const FeaturesSection = ({ activeFeature, setActiveFeature }: FeaturesSectionProps) => {
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
    { icon: <Mic className="w-full h-full" />, position: 'top-0 left-0', color: 'from-cyan-400 to-blue-500' },
    { icon: <Brain className="w-full h-full" />, position: 'top-0 right-0', color: 'from-blue-500 to-purple-500' },
    { icon: <Search className="w-full h-full" />, position: 'bottom-0 left-0', color: 'from-purple-500 to-cyan-400' },
    { icon: <FileText className="w-full h-full" />, position: 'bottom-0 right-0', color: 'from-cyan-400 to-blue-500' }
  ];

  return (
    <section className="bg-slate-900 relative overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Fonctionnalités qui font la différence
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-2 md:px-0">
              Découvrez comment Dorry simplifie votre quotidien professionnel
            </p>
          </>
        }
      >
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 w-full h-full p-4">
          {/* Feature Showcase - Left Side */}
          <div className="flex-1 order-2 md:order-1">
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
            </div>
          </div>
          
          {/* Feature Details - Right Side */}
          <div className="flex-1 order-1 md:order-2">
            <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50 shadow-lg">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 transform ${activeFeature === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}
                  style={{ display: activeFeature === index ? 'block' : 'none' }}
                >
                  <div className="flex items-center mb-4">
                    <div className="text-cyan-400 mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Feature navigation */}
                  <div className="mt-8 flex justify-center space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <button
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFeature === i ? 'bg-cyan-400 w-6' : 'bg-slate-600'}`}
                        onClick={() => setActiveFeature(i)}
                      ></button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
};
