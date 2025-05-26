
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Retour
          </Button>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Conditions d'utilisation</h1>
          <p className="text-lg text-gray-600">
            Les conditions qui régissent l'utilisation de Dory, votre assistante IA pour l'accompagnement de projet.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-600">
              En utilisant Dory, vous acceptez ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Description du service</h2>
            <p className="text-gray-600 mb-4">
              Dory est une assistante IA qui :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Enregistre et analyse vos réunions d'accompagnement</li>
              <li>Génère automatiquement des comptes rendus détaillés</li>
              <li>Détecte les informations importantes des porteurs de projet</li>
              <li>Vérifie les adresses QPV automatiquement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Responsabilités de l'utilisateur</h2>
            <p className="text-gray-600 mb-4">
              Vous vous engagez à :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Obtenir le consentement des participants avant l'enregistrement</li>
              <li>Utiliser le service dans le respect de la loi</li>
              <li>Maintenir la confidentialité de vos identifiants</li>
              <li>Ne pas tenter de contourner les mesures de sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Limitation de responsabilité</h2>
            <p className="text-gray-600">
              Dory est fourni "en l'état". Nous nous efforçons de maintenir la qualité du service mais ne garantissons pas une disponibilité 100% ou une précision absolue des analyses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Modification des conditions</h2>
            <p className="text-gray-600">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des changements importants.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
