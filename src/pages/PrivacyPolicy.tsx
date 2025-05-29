
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-6">
      <style>
        {`
          /* Force tous les textes de cette page en noir avec une spécificité maximale */
          .privacy-page *, 
          .privacy-page *::before, 
          .privacy-page *::after,
          .privacy-page p,
          .privacy-page span,
          .privacy-page div,
          .privacy-page li,
          .privacy-page h1,
          .privacy-page h2,
          .privacy-page h3,
          .privacy-page h4,
          .privacy-page h5,
          .privacy-page h6,
          .privacy-page button,
          .privacy-page input,
          .privacy-page textarea,
          .privacy-page label,
          .privacy-page a {
            color: #1f2937 !important;
          }
          
          /* Garde le gradient pour le titre principal */
          .privacy-page .gradient-title {
            background: linear-gradient(to right, #00B8D4, #6A11CB) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
          }
          
          /* Style pour le bouton */
          .privacy-page .privacy-button {
            color: #374151 !important;
            border-color: #d1d5db !important;
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto privacy-page">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="mb-4 privacy-button"
          >
            ← Retour
          </Button>
          <h1 className="text-4xl font-bold gradient-title mb-4">Politique de confidentialité</h1>
          <p className="text-lg">Chez Dorry, votre vie privée est notre priorité. Découvrez comment nous protégeons et utilisons vos données.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 space-y-6">
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
            <h2 className="text-2xl font-bold mb-4">2. Utilisation des données</h2>
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
            <h2 className="text-2xl font-bold mb-4">3. Protection des données</h2>
            <p>
              Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos données avec des tiers sans votre consentement explicite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Vos droits</h2>
            <p>Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à contact@dorry.app.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
