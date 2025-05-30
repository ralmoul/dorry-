
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white" style={{ color: '#000000' }}>
      <style>
        {`
          .cookie-page * {
            color: #000000 !important;
          }
          .cookie-page .text-cyan-500 {
            color: #06b6d4 !important;
          }
          .cookie-page .text-cyan-400 {
            color: #06b6d4 !important;
          }
          .cookie-page .bg-clip-text {
            -webkit-text-fill-color: #000000 !important;
            background: none !important;
          }
          .cookie-page .text-white {
            color: #000000 !important;
          }
          .cookie-page .gradient-title {
            background: linear-gradient(to right, #00B8D4, #6A11CB) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
          }
        `}
      </style>
      
      <div className="cookie-page">
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
              <h1 className="text-4xl font-bold gradient-title mb-4">🍪 Politique Cookies – Dorry.app</h1>
              <p className="text-sm text-gray-600 mb-8 italic">Dernière mise à jour : 30 mai 2025</p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Qu'est-ce qu'un cookie ?</h2>
                  <p>
                    Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site. Il permet de reconnaître votre navigateur, de mémoriser vos préférences et d'améliorer votre expérience utilisateur.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Quels types de cookies utilisons-nous ?</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Cookies strictement nécessaires</h3>
                      <p>Permettent le fonctionnement technique du site (authentification, sécurité, gestion de session).</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Cookies de mesure d'audience</h3>
                      <p>Nous aident à comprendre comment le site est utilisé (pages visitées, temps passé, erreurs, etc.).</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Cookies de personnalisation</h3>
                      <p>Enregistrent vos préférences d'interface ou de langue.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Cookies tiers</h3>
                      <p>Certains services intégrés (ex : vidéos, outils analytics, réseaux sociaux) peuvent déposer leurs propres cookies.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Consentement & gestion</h2>
                  <p className="mb-4">
                    Lors de votre première visite, une bannière vous informe de l'utilisation des cookies et vous permet :
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>D'accepter tous les cookies</li>
                    <li>De refuser tous les cookies non essentiels</li>
                    <li>De personnaliser vos choix</li>
                  </ul>
                  <p className="mt-4">
                    Vous pouvez modifier vos préférences à tout moment en cliquant sur le lien "Gérer mes cookies" présent en bas de chaque page.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Durée de conservation</h2>
                  <p>
                    Les cookies sont conservés pour une durée maximale de 13 mois à compter de leur dépôt sur votre appareil.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Suppression & paramétrage</h2>
                  <p className="mb-4">
                    Vous pouvez supprimer les cookies via les paramètres de votre navigateur. Pour plus d'informations :
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-600 underline">Aide Chrome</a></li>
                    <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-600 underline">Aide Firefox</a></li>
                    <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-600 underline">Aide Safari</a></li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Contact</h2>
                  <p>
                    Pour toute question relative à cette politique cookies, contactez-nous à : <a href="mailto:contact@dorry.app" className="text-cyan-500 hover:text-cyan-600 underline">contact@dorry.app</a>
                  </p>
                  <p className="mt-4">
                    Vous pouvez à tout moment modifier votre consentement en cliquant sur "Gérer mes cookies".
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

export default CookiePolicy;
