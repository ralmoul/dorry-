
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent mb-4">Mentions légales</h1>
          <p className="text-lg !text-gray-800">
            Informations légales concernant Dorry.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold !text-gray-900 mb-4">Éditeur du site</h2>
            <div className="!text-gray-800 space-y-2">
              <p><strong className="!text-gray-900">Raison sociale :</strong> Thomas Bouziza</p>
              <p><strong className="!text-gray-900">Nom commercial :</strong> Thomas Bouziza</p>
              <p><strong className="!text-gray-900">Forme juridique :</strong> Exploitation personnelle</p>
              <p><strong className="!text-gray-900">Adresse du siège / établissement principal :</strong> Val-de-reuil 27100</p>
              <p><strong className="!text-gray-900">Immatriculation au RCS :</strong> 883 178 394 R.C.S. Rouen</p>
              <p><strong className="!text-gray-900">Date d'immatriculation :</strong> 14/01/2025</p>
              <p><strong className="!text-gray-900">Activité :</strong> Programmation informatique et automatisation</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold !text-gray-900 mb-4">Directeur de publication</h2>
            <p className="!text-gray-800">
              <strong className="!text-gray-900">Nom :</strong> Thomas Bouziza
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold !text-gray-900 mb-4">Hébergement</h2>
            <div className="!text-gray-800 space-y-2">
              <p><strong className="!text-gray-900">Hébergeur :</strong> OVH SAS</p>
              <p><strong className="!text-gray-900">Adresse :</strong> 2 rue Kellermann, 59100 Roubaix</p>
              <p><strong className="!text-gray-900">Téléphone :</strong> 09 72 10 10 07</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold !text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p className="!text-gray-800">
              L'ensemble du contenu de ce site (textes, images, logos, icônes) est la propriété exclusive de Thomas Bouziza, sauf mention contraire. Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold !text-gray-900 mb-4">Contact</h2>
            <div className="!text-gray-800 space-y-2">
              <p><strong className="!text-gray-900">Email :</strong> contact@dorry.app</p>
              <p><strong className="!text-gray-900">Téléphone :</strong> +33 6 52 64 10 56</p>
              <p><strong className="!text-gray-900">Adresse :</strong> Val-de-reuil 27100</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
