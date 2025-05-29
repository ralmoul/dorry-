
import React from 'react';
import { ArrowLeft, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white" style={{ color: '#000000' }}>
      {/* Add specific CSS overrides for this page only */}
      <style>
        {`
          .contact-page * {
            color: #000000 !important;
          }
          .contact-page .text-cyan-500 {
            color: #06b6d4 !important;
          }
          .contact-page .text-cyan-400 {
            color: #06b6d4 !important;
          }
          .contact-page .bg-clip-text {
            -webkit-text-fill-color: #000000 !important;
            background: none !important;
          }
          .contact-page .text-white {
            color: #000000 !important;
          }
          .contact-page .title-cyan {
            color: #06b6d4 !important;
          }
          .contact-page .title-gradient {
            background: linear-gradient(to right, #06b6d4, #2563eb) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
          }
        `}
      </style>
      
      <div className="contact-page">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 py-3 md:py-4 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <a href="/" className="flex items-center space-x-2 px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors" style={{
            color: '#06b6d4'
          }}>
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="bg-gray-50 rounded-xl p-8 md:p-12 border border-gray-200 shadow-lg">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 title-cyan">
                Page Contact — Dorry Voice AI
              </h1>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 title-gradient">Une question ? Besoin d'un renseignement ?</h2>
                  <p className="text-xl md:text-2xl font-semibold mb-4" style={{ color: '#000000' }}>
                    L'équipe Dorry est là pour vous aider !
                  </p>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-lg leading-relaxed mb-6" style={{
                  color: '#374151'
                }}>
                    Chez Dorry, nous savons que chaque projet est unique et que la technologie doit rester au service de l'humain. Tu as une question sur le fonctionnement de l'IA Dorry, une demande de démo, un souci technique ou simplement besoin d'échanger avec un humain ? Contacte-nous directement par email ou prend rendez-vous téléphonique avec l'un de nos conseillers. Nous te répondrons au plus vite !
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {/* Email Contact */}
                    <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-md">
                      <div className="flex items-center mb-4">
                        <Mail className="w-8 h-8 text-cyan-500 mr-3" />
                        <h3 className="text-xl font-bold text-cyan-500">Notre mail :</h3>
                      </div>
                      <a href="mailto:contact@dorry.app" className="text-lg hover:text-cyan-500 transition-colors font-medium" style={{
                      color: '#000000'
                    }}>
                        contact@dorry.app
                      </a>
                    </div>

                    {/* Calendar Appointment */}
                    <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-md">
                      <div className="flex items-center mb-4">
                        <Calendar className="w-8 h-8 text-cyan-500 mr-3" />
                        <h3 className="text-xl font-bold text-cyan-500">Calendrier de rendez-vous téléphonique :</h3>
                      </div>
                      <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
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
        <footer className="bg-gray-100 py-8 border-t border-gray-300">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <p className="text-sm" style={{
            color: '#6b7280'
          }}>© 2025 Dorry. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Contact;
