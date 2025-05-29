
import React from 'react';
import { Clock, Brain, FileText } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export const StatsSection = () => {
  const stats = [
    {
      end: 87,
      suffix: "%",
      label: "de temps gagné sur la rédaction",
      icon: <Clock className="w-6 h-6 md:w-8 md:h-8" />
    },
    {
      end: 98,
      suffix: "%",
      label: "de précision dans les analyses",
      icon: <Brain className="w-6 h-6 md:w-8 md:h-8" />
    },
    {
      end: 5,
      suffix: " min",
      label: "pour un compte rendu complet",
      icon: <FileText className="w-6 h-6 md:w-8 md:h-8" />
    }
  ];

  return (
    <div className="mt-12 md:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50">
          <div className="text-cyan-400 mb-2 md:mb-4 flex justify-center">
            {stat.icon}
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            <AnimatedCounter end={stat.end} suffix={stat.suffix} />
          </div>
          <p className="text-sm md:text-base lg:text-lg text-slate-300">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};
