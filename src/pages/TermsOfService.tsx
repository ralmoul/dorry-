
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-6">
      <style>
        {`
          /* Force tous les textes de cette page en noir avec une spécificité maximale */
          .terms-page *, 
          .terms-page *::before, 
          .terms-page *::after,
          .terms-page p,
          .terms-page span,
          .terms-page div,
          .terms-page li,
          .terms-page h1,
          .terms-page h2,
          .terms-page h3,
          .terms-page h4,
          .terms-page h5,
          .terms-page h6,
          .terms-page button,
          .terms-page input,
          .terms-page textarea,
          .terms-page label,
          .terms-page a {
            color: #1f2937 !important;
          }
          
          /* Garde le gradient pour le titre principal */
          .terms-page .gradient-title {
            background: linear-gradient(to right, #00B8D4, #6A11CB) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
          }
          
          /* Style pour le bouton retour avec texte blanc */
          .terms-page .terms-button {
            color: white !important;
            border-color: #d1d5db !important;
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto terms-page">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="mb-4 terms-button"
          >
            ← Retour
          </Button>
          <h1 className="text-4xl font-bold gradient-title mb-4">Conditions d'utilisation</h1>
          <p className="text-lg">Les conditions qui régissent l'utilisation de Dorry, votre assistante IA pour l'accompagnement.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 space-y-6">
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
  );
};

export default TermsOfService;
