
import React from 'react';

export const Footer = () => {
  return (
    <footer id="footer" className="bg-slate-800 py-8 md:py-12 relative overflow-hidden">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-10"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite ${Math.random() * 5}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8">
          {/* Logo et description */}
          <div className="flex flex-col items-start space-y-3 md:space-y-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-8 h-8 md:w-10 md:h-10" />
              <span className="text-xl md:text-2xl font-bold text-white">Dorry</span>
            </div>
            <p className="text-sm md:text-base text-slate-300 max-w-md">
              L'assistant IA qui révolutionne l'accompagnement de porteurs de projet. 
              Simple, efficace et 100% confidentiel.
            </p>
          </div>
          
          {/* Liens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full md:w-auto">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Produit</h3>
              <ul className="space-y-2">
                <li><a href="/faq" className="text-sm md:text-base text-slate-300 hover:text-cyan-400 transition-colors">FAQ</a></li>
                <li><a href="/contact" className="text-sm md:text-base text-slate-300 hover:text-cyan-400 transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy-policy" className="text-sm md:text-base text-slate-300 hover:text-cyan-400 transition-colors">Confidentialité</a></li>
                <li><a href="/terms-of-service" className="text-sm md:text-base text-slate-300 hover:text-cyan-400 transition-colors">CGU</a></li>
                <li><a href="/legal-notice" className="text-sm md:text-base text-slate-300 hover:text-cyan-400 transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Ligne de séparation et copyright */}
        <div className="border-t border-slate-700 mt-6 md:mt-8 pt-4 md:pt-6 text-center">
          <p className="text-xs md:text-sm text-slate-400">
            © 2025 Dorry. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
