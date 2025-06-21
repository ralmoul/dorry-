
import React, { useMemo } from 'react';
import { Clock, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Clock className="w-10 h-10 md:w-12 md:h-12" />,
      title: "Gagnez un temps précieux",
      description: "Plus besoin de rédiger ou de mémoriser chaque échange. Concentrez-vous sur l'humain, Dorry s'occupe du reste.",
      delay: 0.1,
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: <Shield className="w-10 h-10 md:w-12 md:h-12" />,
      title: "Fiabilité sans faille",
      description: "Finis les oublis de compte rendu, même après une journée chargée.",
      delay: 0.2,
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Sparkles className="w-10 h-10 md:w-12 md:h-12" />,
      title: "Analyse IA intelligente",
      description: "Dorry reste connectée et attentive, même quand l'humain décroche. Chaque détail important est capturé.",
      delay: 0.3,
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: <TrendingUp className="w-10 h-10 md:w-12 md:h-12" />,
      title: "Évolutif & innovant",
      description: "Des mises à jour régulières : Scoring automatique, recommandations intelligentes, messages WhatsApp personnalisés.",
      delay: 0.4,
      color: "from-blue-500 to-cyan-400"
    }
  ];

  return (
    <section className="bg-slate-800 relative overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Pourquoi choisir Dorry ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-2 md:px-0">
              Des avantages concrets pour votre productivité
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full h-full p-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 md:p-8 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg transform transition-all duration-500 hover:translate-y-[-10px] hover:shadow-xl"
            >
              <div className={`text-transparent bg-clip-text bg-gradient-to-r ${benefit.color} mb-4 md:mb-6`}>
                {benefit.icon}
              </div>
              <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r ${benefit.color}`}>
                {benefit.title}
              </h3>
              <p className="text-slate-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </ContainerScroll>
    </section>
  );
};
