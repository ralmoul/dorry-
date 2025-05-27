import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Brain, MapPin, Mail, Clock, Shield, Zap, Users } from 'lucide-react';

const TypewriterText = ({
  text,
  delay = 100
}: {
  text: string;
  delay?: number;
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);
  return <span>{displayText}</span>;
};

const Landing = () => {
  const navigate = useNavigate();
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSubtitle(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 max-w-7xl mx-auto gap-4 sm:gap-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-base sm:text-lg">D</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Dorry
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleLogin} 
            className="border-bright-turquoise text-bright-turquoise hover:bg-bright-turquoise hover:text-white w-full sm:w-auto text-sm sm:text-base px-4 py-2"
          >
            Se connecter
          </Button>
          <Button 
            onClick={handleGetStarted} 
            className="bg-gradient-to-r from-bright-turquoise to-electric-blue text-white hover:opacity-90 w-full sm:w-auto text-sm sm:text-base px-4 py-2"
          >
            S'inscrire
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight px-2">
            <TypewriterText text="Dorry, l'assistante IA qui révolutionne vos échanges" delay={50} />
          </h1>
          
          {showSubtitle && <p className="text-lg sm:text-xl md:text-2xl text-pink-500 animate-fade-in mb-6 sm:mb-8 px-4">
              Votre copilote de confiance pour des suivis sans effort et des comptes rendus ultra-fiables
            </p>}
        </div>

        <div className="mb-8 sm:mb-12 animate-pulse-ai">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center shadow-2xl">
            <Mic className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
          <p className="animate-fade-in">Dorry vous accompagne lors de chaque réunion ou entretien, capte chaque moment, analyse, détecte les informations essentielles et livre un compte rendu précis, sans que vous ayez à lever le petit doigt. Plus qu'une assistante, Dorry est votre copilote IA pour des suivis irréprochables, même quand vous n'avez pas le temps, même quand vous décrochez.</p>
        </div>

        <Button 
          onClick={handleGetStarted} 
          size="lg" 
          className="bg-gradient-to-r from-bright-turquoise to-electric-blue text-white text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 hover:opacity-90 animate-glow w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
        >
          Essayez dès aujourd'hui
        </Button>
      </section>

      {/* Comment ça marche */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-16 px-4">
            Comment Dorry vous simplifie la vie ?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Parlez, Dorry écoute</h3>
                <p className="text-gray-600">Enregistrez vos réunions ou entretiens, même en mains libres !</p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Analyse instantanée par IA</h3>
                <p className="text-gray-600">Dorry comprend chaque échange, détecte les points clés, les adresses, les RDV pris…</p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Détection avancée</h3>
                <p className="text-gray-600">Repère automatiquement les adresses et vérifie si votre porteur de projet est en QPV.</p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Compte rendu détaillé</h3>
                <p className="text-gray-600">Recevez une synthèse claire livrée en moins de 5 minutes, complète, prête à être archivée.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir Dorry */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-16 px-4">
            Pourquoi choisir Dorry ?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Gagnez un temps précieux</h3>
                <p className="text-gray-600">Plus besoin de rédiger ou de mémoriser chaque échange. Concentrez-vous sur l'humain, Dorry s'occupe du reste.</p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Fiabilité sans faille</h3>
                <p className="text-gray-600">Finis les oublis de compte rendu, même après une journée chargée.</p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Analyse IA intelligente</h3>
                <p className="text-gray-600">Dorry reste connectée et attentive, même quand l'humain décroche. Chaque détail important est capturé.</p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm border-bright-turquoise/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Évolutif & innovant</h3>
                <p className="text-gray-600">Des mises à jour régulières : Scoring automatique, recommandations intelligentes, messages WhatsApp personnalisés.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-bright-turquoise to-electric-blue">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-4">
            Rejoignez la nouvelle génération d'accompagnateurs augmentés par l'IA !
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 px-4">
            L'esprit libre, le suivi assuré. Essayez dès maintenant et faites la différence.
          </p>
          <Button 
            onClick={handleGetStarted} 
            size="lg" 
            className="bg-white text-bright-turquoise text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-100 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
          >
            Commencer gratuitement
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Dorry</h3>
              <p className="text-gray-300">L'assistante IA qui révolutionne l'accompagnement de projet</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">Politique de confidentialité</button></li>
                <li><button onClick={() => navigate('/terms-of-service')} className="hover:text-white transition-colors">Conditions d'utilisation</button></li>
                <li><button onClick={() => navigate('/legal-notice')} className="hover:text-white transition-colors">Mentions légales</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => navigate('/support')} className="hover:text-white transition-colors">Aide & Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Innovation</h4>
              <p className="text-gray-300">C'est le début d'une nouvelle ère pour l'accompagnement de projet.</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-300">
            <p>© 2025 Dorry. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Landing;
