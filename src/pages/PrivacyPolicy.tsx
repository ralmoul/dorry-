
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white" style={{ color: '#000000' }}>
      <style>
        {`
          .privacy-page * {
            color: #000000 !important;
          }
          .privacy-page .text-cyan-500 {
            color: #06b6d4 !important;
          }
          .privacy-page .text-cyan-400 {
            color: #06b6d4 !important;
          }
          .privacy-page .bg-clip-text {
            -webkit-text-fill-color: #000000 !important;
            background: none !important;
          }
          .privacy-page .text-white {
            color: #000000 !important;
          }
          .privacy-page .gradient-title {
            background: linear-gradient(to right, #00B8D4, #6A11CB) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
          }
        `}
      </style>
      
      <div className="privacy-page">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 py-3 md:py-4 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <a href="/#footer" className="flex items-center space-x-2 px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors" style={{
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
              <h1 className="text-4xl font-bold gradient-title mb-4">Politique de confidentialité</h1>
              <p className="text-lg mb-8">Chez Dorry, votre vie privée est notre priorité. Découvrez comment nous protégeons et utilisons vos données.</p>

              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Collecte des données</h2>
                  <p className="mb-4">Dorry collecte uniquement les données nécessaires au fonctionnement de l'application :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Informations d'inscription (nom, prénom, email, entreprise)</li>
                    <li>Enregistrements audio des réunions et entretiens</li>
                    <li>Données d'utilisation pour améliorer nos services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Consentement à l'enregistrement vocal</h2>
                  <p className="mb-4">
                    Conformément au RGPD, Dorry exige votre consentement explicite avant tout enregistrement vocal :
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Un modal de consentement s'affiche avant chaque nouvel enregistrement</li>
                    <li>Le porteur de projet et vous devez accepter que le message soit enregistré et traité selon cette politique de confidentialité</li>
                    <li>Vous pouvez refuser l'enregistrement à tout moment</li>
                    <li>Aucun enregistrement ne peut démarrer sans votre consentement explicite</li>
                    <li>Vous gardez le contrôle total sur vos données vocales</li>
                  </ul>
                  <p className="mt-4 text-sm bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <strong>Important :</strong> En fermant le modal de consentement ou en cliquant sur "Refuser", aucun enregistrement ne sera effectué et vous pourrez continuer à utiliser les autres fonctionnalités de l'application.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Utilisation des données</h2>
                  <p className="mb-4">
                    Vos données sont utilisées exclusivement pour :
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Analyser vos enregistrements et générer des comptes rendus</li>
                    <li>Améliorer la qualité de nos analyses IA</li>
                    <li>Vous envoyer les comptes rendus par email</li>
                    <li>Assurer le support technique</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Protection des données</h2>
                  <p>
                    Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos données avec des tiers sans votre consentement explicite.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Vos droits</h2>
                  <p>Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à contact@dorry.app.</p>
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

export default PrivacyPolicy;
