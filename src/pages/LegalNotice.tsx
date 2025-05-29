
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-white" style={{ color: '#000000' }}>
      <style>
        {`
          .legal-notice-page * {
            color: #000000 !important;
          }
          .legal-notice-page .text-cyan-500 {
            color: #06b6d4 !important;
          }
          .legal-notice-page .text-cyan-400 {
            color: #06b6d4 !important;
          }
          .legal-notice-page .bg-clip-text {
            -webkit-text-fill-color: #000000 !important;
            background: none !important;
          }
          .legal-notice-page .text-white {
            color: #000000 !important;
          }
          .legal-notice-page .gradient-title {
            background: linear-gradient(to right, #00B8D4, #6A11CB) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
          }
        `}
      </style>
      
      <div className="legal-notice-page">
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
              <h1 className="text-4xl font-bold gradient-title mb-4">Mentions légales</h1>
              <p className="text-lg mb-8">
                Informations légales concernant Dorry.
              </p>

              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold mb-4">Éditeur du site</h2>
                  <div className="space-y-2">
                    <p><strong>Raison sociale :</strong> Thomas Bouziza</p>
                    <p><strong>Nom commercial :</strong> Thomas Bouziza</p>
                    <p><strong>Forme juridique :</strong> Exploitation personnelle</p>
                    <p><strong>Adresse du siège / établissement principal :</strong> Val-de-reuil 27100</p>
                    <p><strong>Immatriculation au RCS :</strong> 883 178 394 R.C.S. Rouen</p>
                    <p><strong>Date d'immatriculation :</strong> 14/01/2025</p>
                    <p><strong>Activité :</strong> Programmation informatique et automatisation</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Directeur de publication</h2>
                  <p>
                    <strong>Nom :</strong> Thomas Bouziza
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
                  <div className="space-y-2">
                    <p><strong>Hébergeur :</strong> OVH SAS</p>
                    <p><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix</p>
                    <p><strong>Téléphone :</strong> 09 72 10 10 07</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
                  <p>
                    L'ensemble du contenu de ce site (textes, images, logos, icônes) est la propriété exclusive de Thomas Bouziza, sauf mention contraire. Toute reproduction, même partielle, est interdite sans autorisation préalable.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Contact</h2>
                  <div className="space-y-2">
                    <p><strong>Email :</strong> contact@dorry.app</p>
                    <p><strong>Téléphone :</strong> +33 6 52 64 10 56</p>
                    <p><strong>Adresse :</strong> Val-de-reuil 27100</p>
                  </div>
                </section>
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

export default LegalNotice;
