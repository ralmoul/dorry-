
import React from 'react';
import { ArrowLeft, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 py-3 md:py-4 bg-slate-900/90 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <a 
            href="/" 
            className="flex items-center space-x-2 px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-slate-700/50 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Page Contact — Dorry Voice AI
            </h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">
                  Une question ? Besoin d'un renseignement ?
                </h2>
                <p className="text-xl md:text-2xl font-semibold mb-4 text-white">
                  L'équipe Dorry est là pour vous aider !
                </p>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  Chez Dorry, nous savons que chaque projet est unique et que la technologie doit rester au service de l'humain. Tu as une question sur le fonctionnement de l'IA Dorry, une demande de démo, un souci technique ou simplement besoin d'échanger avec un humain ? Contacte-nous directement par email ou prend rendez-vous téléphonique avec l'un de nos conseillers. Nous te répondrons au plus vite !
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  {/* Email Contact */}
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                    <div className="flex items-center mb-4">
                      <Mail className="w-8 h-8 text-cyan-400 mr-3" />
                      <h3 className="text-xl font-bold text-cyan-400">Notre mail :</h3>
                    </div>
                    <a 
                      href="mailto:contact@dorry.app" 
                      className="text-lg text-white hover:text-cyan-400 transition-colors font-medium"
                    >
                      contact@dorry.app
                    </a>
                  </div>

                  {/* Calendar Appointment */}
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-8 h-8 text-cyan-400 mr-3" />
                      <h3 className="text-xl font-bold text-cyan-400">Calendrier de rendez-vous téléphonique :</h3>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                    >
                      Prendre rendez-vous
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-slate-700">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-slate-400 text-sm">© 2025 Dorry. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
