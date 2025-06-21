
import React from 'react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export const AboutSection = () => {
  return (
    <ContainerScroll
      titleComponent={
        <>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 lg:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Concrètement à quoi sert Dorry ?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto px-2 md:px-0">
            L'assistant IA qui transforme tes échanges en synthèse claire et actionnable
          </p>
        </>
      }
    >
      <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-16 w-full h-full">
        <div className="flex-1 relative order-2 lg:order-1 w-full h-full">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="/lovable-uploads/60b9c7c7-d7aa-4c2a-91c4-5839d83373b6.png" 
              alt="Dorry AI Data Analysis" 
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5"></div>
          </div>
        </div>
        
        <div className="flex-1 space-y-4 md:space-y-6 lg:space-y-8 order-1 lg:order-2 w-full p-4">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              Dorry est une intelligence artificielle spécialisée dans le suivi des porteurs de projet, conçue pour les accompagnateurs. Elle automatise la prise de notes, l'analyse de rendez-vous et la génération de comptes-rendus personnalisés, le tout… sans effort humain !
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-cyan-500/30">
            <p className="text-lg md:text-xl text-white leading-relaxed">
              <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Dorry écoute, comprend et synthétise pour toi.</span><br />
              Il te suffit d'enregistrer ton rendez-vous, Dorry s'occupe du reste.
            </p>
          </div>
        </div>
      </div>
    </ContainerScroll>
  );
};
