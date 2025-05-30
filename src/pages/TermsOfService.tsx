
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
              <h1 className="text-4xl font-bold gradient-title mb-4">Conditions Générales d'Utilisation (CGU) – Dorry.app</h1>
              <p className="text-sm text-gray-600 mb-8 italic">Dernière mise à jour : 30 mai 2025</p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Objet</h2>
                  <p>Les présentes CGU définissent les règles d'utilisation du service Dorry.app.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Inscription</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Inscription réservée aux utilisateurs majeurs.</li>
                    <li>Chaque utilisateur doit fournir des informations exactes.</li>
                    <li>Le compte est personnel et non transférable.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Accès au service</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>L'accès à l'app est réservé aux utilisateurs approuvés.</li>
                    <li>Dorry.app se réserve le droit de suspendre l'accès en cas de non-respect des CGU, fraude, ou comportement abusif.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Utilisation des enregistrements vocaux</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Les enregistrements vocaux sont utilisés uniquement pour fournir et améliorer les services (IA, transcription, historique).</li>
                    <li>L'utilisateur s'engage à ne pas enregistrer de contenus illicites.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Propriété intellectuelle</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>L'ensemble du contenu, des marques et de la technologie appartient à Dorry.app ou ses partenaires.</li>
                    <li>Toute reproduction ou extraction est interdite sans accord écrit.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Responsabilités</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Dorry.app ne garantit pas l'absence d'interruptions ou d'erreurs, mais s'engage à corriger tout incident.</li>
                    <li>L'utilisateur est responsable de la sécurité de son compte.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">7. Données personnelles</h2>
                  <p>
                    Voir la <a href="/privacy-policy" className="text-cyan-500 hover:text-cyan-600 underline">Politique de confidentialité</a> pour les détails sur la gestion des données.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">8. Modification des CGU</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Les CGU peuvent être modifiées à tout moment.</li>
                    <li>Les utilisateurs seront informés des changements majeurs.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">9. Droit applicable</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Les présentes CGU sont soumises au droit français.</li>
                    <li>En cas de litige, compétence exclusive des tribunaux du siège de Dorry.app.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
                  <p>
                    Pour toute question : <a href="mailto:contact@dorry.app" className="text-cyan-500 hover:text-cyan-600 underline">contact@dorry.app</a>
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
