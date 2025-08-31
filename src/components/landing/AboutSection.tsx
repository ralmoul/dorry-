
import React from 'react';
import { FileText } from 'lucide-react';

export const AboutSection = () => {
  return (
    <div id="about-section" className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-16 mb-12 md:mb-16">
      <div className="flex-1 relative order-2 lg:order-1 w-full">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
          <img 
            src="/lovable-uploads/60b9c7c7-d7aa-4c2a-91c4-5839d83373b6.png" 
            alt="Dorry AI Data Analysis" 
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-yellow-500/5"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300 bg-slate-900/70 backdrop-blur-sm p-4 md:p-6">
              <div className="text-orange-400 mb-2 md:mb-4">
                <FileText className="w-8 h-8 md:w-12 md:h-12 mx-auto" />
              </div>
              <p className="text-center text-sm md:text-lg font-semibold mb-1 md:mb-2">Dorry automatise tout le processus</p>
              <p className="text-center text-xs md:text-sm">De l'enregistrement à la synthèse, sans effort humain</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 space-y-4 md:space-y-6 lg:space-y-8 order-1 lg:order-2 w-full">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-orange-300/20">
          <p className="text-orange-100/90 leading-relaxed text-sm md:text-base">
            Dorry est une intelligence artificielle spécialisée dans le suivi des porteurs de projet, conçue pour les accompagnateurs. Elle automatise la prise de notes, l'analyse de rendez-vous et la génération de comptes-rendus personnalisés, le tout… sans effort humain !
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-orange-300/30">
          <p className="text-lg md:text-xl text-white leading-relaxed">
            <span className="font-bold bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent">Dorry écoute, comprend et synthétise pour toi.</span><br />
            Il te suffit d'enregistrer ton rendez-vous, Dorry s'occupe du reste.
          </p>
        </div>
      </div>
    </div>
  );
};
