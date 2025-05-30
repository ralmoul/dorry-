
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Note de conformité RGPD */}
        <div className="mb-8 p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-lg text-center">
          <p className="text-cyan-400 font-medium text-sm md:text-base">
            🔒 Vos données, votre choix : Dorry.app est 100% conforme RGPD. 
            Données vocales supprimées après 7 jours, consentement explicite journalisé, sécurité garantie.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12 md:mb-16">
          <div className="flex-1 min-w-64 text-center md:text-left">
            <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-10 h-10 mb-4 mx-auto md:mx-0" />
            <p className="text-slate-300 max-w-sm mx-auto md:mx-0">
              L'assistante IA qui révolutionne l'accompagnement de projet
            </p>
          </div>
          
          <div className="flex-2 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16">
            <div className="text-center md:text-left">
              <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-cyan-400">Légal</h4>
              <div className="space-y-3">
                <a href="/privacy-policy" className="block text-slate-300 hover:text-cyan-400 transition-colors">Politique de confidentialité</a>
                <a href="/terms-of-service" className="block text-slate-300 hover:text-cyan-400 transition-colors">Conditions d'utilisation</a>
                <a href="/legal-notice" className="block text-slate-300 hover:text-cyan-400 transition-colors">Mentions légales</a>
                <a href="/cookie-policy" className="block text-slate-300 hover:text-cyan-400 transition-colors">Politique cookies</a>
                <a 
                  href="/cookie-policy"
                  className="block text-slate-300 hover:text-cyan-400 transition-colors text-sm md:text-base text-center md:text-left w-full"
                >
                  Gérer mes cookies
                </a>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-cyan-400">Support</h4>
              <div className="space-y-3">
                <a href="/contact" className="block text-slate-300 hover:text-cyan-400 transition-colors">Contact</a>
                <a href="/faq" className="block text-slate-300 hover:text-cyan-400 transition-colors">FAQ</a>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-cyan-400">Innovation</h4>
              <p className="text-slate-300">
                C'est le début d'une nouvelle ère pour l'accompagnement de projet.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 md:pt-8 border-t border-slate-700 gap-4">
          <p className="text-slate-400 text-sm text-center sm:text-left">© 2025 Dorry. Tous droits réservés.</p>
          <div className="flex space-x-4"></div>
        </div>
      </div>
    </footer>
  );
};
