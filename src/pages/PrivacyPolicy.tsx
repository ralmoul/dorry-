
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
              <h1 className="text-4xl font-bold gradient-title mb-4">Politique de confidentialité – Dorry.app</h1>
              <p className="text-sm text-gray-600 mb-8 italic">Dernière mise à jour : 30 mai 2025</p>
              
              <p className="text-lg mb-8">
                Chez <strong>Dorry.app</strong>, la protection de vos données personnelles est une priorité. Cette politique vous explique comment nous collectons, utilisons, stockons et protégeons vos informations, conformément au RGPD.
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Identité du responsable de traitement</h2>
                  <ul className="space-y-2">
                    <li><strong>Responsable :</strong> Thomas Bouziza</li>
                    <li><strong>Adresse :</strong> Val-de-reuil 27100</li>
                    <li><strong>Contact :</strong> contact@dorry.app</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Données collectées</h2>
                  <p className="mb-4">Nous collectons :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Données d'identification : nom, prénom, adresse e-mail</li>
                    <li>Données d'authentification : mot de passe chiffré</li>
                    <li>Données vocales : enregistrements audio, transcriptions textuelles, nom d'utilisateur</li>
                    <li>Données techniques : adresse IP, logs de connexion, type d'appareil</li>
                    <li>Cookies (voir <a href="/cookie-policy" className="text-cyan-500 hover:text-cyan-600 underline">Politique cookies</a>)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Finalités et base légale</h2>
                  <p className="mb-4">Nous utilisons vos données pour :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Créer et gérer votre compte</li>
                    <li>Fournir et améliorer le service (assistant vocal, transcription, IA, historique vocal)</li>
                    <li>Sécuriser l'accès à votre espace personnel</li>
                    <li>Envoyer des notifications (emails, alertes)</li>
                    <li>Répondre à vos demandes d'assistance</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Base légale</strong> : consentement explicite, exécution du contrat, obligation légale, intérêt légitime (sécurité, amélioration continue).
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Conservation des données</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Données vocales</strong> : conservées 7 jours maximum, puis supprimées automatiquement</li>
                    <li><strong>Compte utilisateur</strong> : supprimé à la demande ou après 2 ans d'inactivité</li>
                    <li><strong>Logs techniques</strong> : 1 an max</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Destinataires</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Équipe Dorry.app et prestataires techniques (hébergement, outils de mail)</li>
                    <li>Aucun partage à des tiers sans consentement explicite</li>
                    <li>Sous-traitants conformes RGPD (hébergement en Europe)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Droits des utilisateurs</h2>
                  <p className="mb-4">Vous pouvez à tout moment :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Accéder à vos données</li>
                    <li>Demander la rectification ou la suppression</li>
                    <li>Vous opposer ou demander la limitation du traitement</li>
                    <li>Retirer votre consentement</li>
                    <li>Obtenir une copie de vos données (portabilité)</li>
                  </ul>
                  <p className="mt-4">
                    Pour exercer vos droits : <a href="mailto:contact@dorry.app" className="text-cyan-500 hover:text-cyan-600 underline">contact@dorry.app</a>
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">7. Sécurité</h2>
                  <p>
                    Nous mettons en œuvre des mesures de sécurité avancées : chiffrement, contrôle d'accès, surveillance, sauvegardes régulières.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">8. Cookies</h2>
                  <p>
                    Voir notre <a href="/cookie-policy" className="text-cyan-500 hover:text-cyan-600 underline">politique cookies</a> pour plus de détails.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">9. Réclamations</h2>
                  <p>
                    Vous pouvez contacter la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-600 underline">www.cnil.fr</a>) pour toute réclamation concernant vos données.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Contact DPO</h2>
                  <p>
                    <strong>Contact DPO :</strong> <a href="mailto:contact@dorry.app" className="text-cyan-500 hover:text-cyan-600 underline">contact@dorry.app</a>
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

export default PrivacyPolicy;
