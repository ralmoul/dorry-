
import React from 'react';
import { Clock, Shield, Sparkles, TrendingUp } from 'lucide-react';

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
    <section className="py-16 md:py-32 bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-slate-900/50"></div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-10"
            style={{
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 30 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 25 + 15}s ease-in-out infinite ${Math.random() * 5}s`,
              filter: 'blur(5px)'
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Pourquoi choisir Dorry ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-2 md:px-0">
            Des avantages concrets pour votre productivité
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 md:p-8 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg transform transition-all duration-500 hover:translate-y-[-10px] hover:shadow-xl animate-fadeInUp"
              style={{ animationDelay: `${benefit.delay}s` }}
            >
              <div className={`text-transparent bg-clip-text bg-gradient-to-r ${benefit.color} mb-4 md:mb-6`}>
                {benefit.icon}
              </div>
              <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r ${benefit.color}`}>
                {benefit.title}
              </h3>
              <p className="text-slate-300">{benefit.description}</p>
              
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
