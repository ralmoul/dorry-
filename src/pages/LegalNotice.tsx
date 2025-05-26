
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LegalNotice = () => {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Mentions légales</h1>
          <p className="text-lg text-gray-600">
            Informations légales concernant Dory et Synkros.AI.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Éditeur du site</h2>
            <div className="text-gray-600 space-y-2">
              <p><strong>Raison sociale :</strong> Synkros.AI</p>
              <p><strong>Forme juridique :</strong> Société par actions simplifiée</p>
              <p><strong>Capital social :</strong> 10 000 €</p>
              <p><strong>Siège social :</strong> 123 Avenue de l'Innovation, 75001 Paris</p>
              <p><strong>RCS :</strong> Paris B 123 456 789</p>
              <p><strong>SIRET :</strong> 123 456 789 00012</p>
              <p><strong>TVA intracommunautaire :</strong> FR12 123456789</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Directeur de publication</h2>
            <p className="text-gray-600">
              <strong>Nom :</strong> Thomas Synkros<br />
              <strong>Qualité :</strong> Président de Synkros.AI
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hébergement</h2>
            <div className="text-gray-600 space-y-2">
              <p><strong>Hébergeur :</strong> OVH SAS</p>
              <p><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix</p>
              <p><strong>Téléphone :</strong> 09 72 10 10 07</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-600">
              L'ensemble du contenu de ce site (textes, images, logos, icônes) est la propriété exclusive de Synkros.AI, sauf mention contraire. Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact</h2>
            <div className="text-gray-600 space-y-2">
              <p><strong>Email :</strong> contact@synkros.ai</p>
              <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
              <p><strong>Adresse :</strong> 123 Avenue de l'Innovation, 75001 Paris</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
