
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white" style={{ color: '#000000' }}>
      <style>
        {`
          .terms-page * {
            color: #000000 !important;
          }
          .terms-page .text-cyan-500 {
            color: #06b6d4 !important;
          }
          .terms-page .text-cyan-400 {
            color: #06b6d4 !important;
          }
          .terms-page .bg-clip-text {
            -webkit-text-fill-color: #000000 !important;
            background: none !important;
          }
          .terms-page .text-white {
            color: #000000 !important;
          }
          .terms-page .gradient-title {
            background: linear-gradient(to right, #00B8D4, #6A11CB) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
          }
        `}
      </style>
      
      <div className="terms-page">
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
              <h1 className="text-4xl font-bold gradient-title mb-4">Conditions d'utilisation</h1>
              <p className="text-lg mb-8">Les conditions qui régissent l'utilisation de Dorry, votre assistante IA pour l'accompagnement.</p>

              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Acceptation des conditions</h2>
                  <p>En utilisant Dorry, vous acceptez ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Description du service</h2>
                  <p className="mb-4">Dorry est une assistante IA qui :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Enregistre et analyse vos réunions d'accompagnement</li>
                    <li>Génère automatiquement des comptes rendus détaillés</li>
                    <li>Détecte les informations importantes des porteurs de projet</li>
                    <li>Vérifie les adresses QPV automatiquement</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Responsabilités de l'utilisateur</h2>
                  <p className="mb-4">
                    Vous vous engagez à :
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Obtenir le consentement des participants avant l'enregistrement</li>
                    <li>Utiliser le service dans le respect de la loi</li>
                    <li>Maintenir la confidentialité de vos identifiants</li>
                    <li>Ne pas tenter de contourner les mesures de sécurité</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Limitation de responsabilité</h2>
                  <p>Dorry est fourni "en l'état". Nous nous efforçons de maintenir la qualité du service mais ne garantissons pas une disponibilité 100% ou une précision absolue des analyses.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Modification des conditions</h2>
                  <p>
                    Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des changements importants.
                  </p>
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

export default TermsOfService;
