
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react';

const Support = () => {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Support Dory</h1>
          <p className="text-lg text-gray-600">
            Notre équipe est là pour vous accompagner dans l'utilisation de Dory.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-bright-turquoise" />
                <span>Support par email</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Pour toute question technique ou commerciale, notre équipe vous répond sous 24h.
              </p>
              <Button className="bg-gradient-to-r from-bright-turquoise to-electric-blue text-white">
                support@dory.ai
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-bright-turquoise" />
                <span>Support téléphonique</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Besoin d'aide immédiate ? Appelez-nous du lundi au vendredi, 9h-18h.
              </p>
              <Button className="bg-gradient-to-r from-bright-turquoise to-electric-blue text-white">
                +33 1 23 45 67 89
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-bright-turquoise/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-bright-turquoise" />
              <span>Questions fréquentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Comment fonctionne l'analyse IA de Dory ?</h3>
              <p className="text-gray-600">
                Dory utilise des modèles d'intelligence artificielle avancés pour analyser vos enregistrements, détecter les informations clés, et générer automatiquement des comptes rendus structurés.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Mes données sont-elles sécurisées ?</h3>
              <p className="text-gray-600">
                Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations avec des tiers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Puis-je essayer Dory gratuitement ?</h3>
              <p className="text-gray-600">
                Oui ! Dory propose une période d'essai gratuite vous permettant de tester toutes les fonctionnalités pendant 14 jours.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Comment obtenir le consentement pour l'enregistrement ?</h3>
              <p className="text-gray-600">
                Il est important d'informer et d'obtenir le consentement explicite de tous les participants avant de commencer un enregistrement. Dory peut vous aider avec des modèles de formulaires de consentement.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-bright-turquoise to-electric-blue text-white">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Besoin d'une démonstration personnalisée ?</h3>
            <p className="mb-6 opacity-90">
              Découvrez comment Dory peut transformer votre façon d'accompagner les porteurs de projet.
            </p>
            <Button className="bg-white text-bright-turquoise hover:bg-gray-100">
              Demander une démo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
