
import { ArrowLeft, Zap, Building2, MessageCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UpcomingFeaturesProps {
  onBack: () => void;
}

const UpcomingFeatures = ({ onBack }: UpcomingFeaturesProps) => {
  const features = [
    {
      icon: Target,
      title: "📊 Scoring automatique des porteurs de projet",
      description: "Dorry attribuera un score automatique sur 15 points, basé sur :",
      details: ["La motivation du porteur", "La clarté du projet", "Le niveau d'urgence perçue"],
      additionalInfo: "Un indicateur QPV (quartier prioritaire) sera aussi généré automatiquement.",
      benefits: ["Permet de prioriser les dossiers avec précision", "Identifie les projets à fort potentiel dès le vocal", "Optimise la gestion du portefeuille local", "Favorise l'égalité des chances avec le repérage QPV"]
    },
    {
      icon: Building2,
      title: "🏢 Recommandation intelligente de structures partenaires",
      description: "Dorry analysera les besoins exprimés dans le vocal pour recommander une structure adaptée (CMA, BGE, ADIE, incubateur, etc.).",
      details: ["Le nom de la structure", "Le motif de l'orientation", "Les coordonnées complètes"],
      additionalInfo: "Et un bouton \"Contacter la structure\" sera présent dans les mails.",
      benefits: ["Gagne du temps pour l'accompagnant", "Propose une orientation fluide et personnalisée", "Active un réseau local autour du porteur", "Encourage à l'action via le bouton de contact"]
    },
    {
      icon: MessageCircle,
      title: "📱 Envoi automatisé de messages WhatsApp personnalisés",
      description: "Dorry enverra un message WhatsApp automatique et personnalisé si un RDV ou une orientation est détectée dans le vocal.",
      details: ["Messages contextuels automatiques", "Confirmation des RDV planifiés", "Rappels d'orientations importantes"],
      additionalInfo: "Exemple : \"Bonjour Julie, notre RDV est bien noté pour jeudi à 10h à la MJC. Je vous recommande aussi de contacter la BGE du Val-de-Marne.\"",
      benefits: ["Renforce le lien humain, même en automatique", "Confirme rapidement les informations clés", "Améliore la réactivité du porteur", "Crée une expérience proactive et bienveillante"]
    }
  ];

  return (
    <div className="min-h-screen gradient-bg text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="p-2 mr-3 hover:bg-white/10 text-white hover:text-white/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
              ✨ Prochaines mises à jour
            </h1>
            <p className="text-white mt-1 text-sm sm:text-base">
              Découvrez les fonctionnalités futures de Dorry
            </p>
          </div>
        </div>

        {/* AI Visual Element */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-bright-turquoise/20 to-electric-blue/20 animate-pulse-ai"></div>
            <div className="absolute inset-2 w-12 h-12 rounded-full bg-gradient-to-r from-bright-turquoise/40 to-electric-blue/40 animate-pulse-ai" style={{
              animationDelay: '0.5s'
            }}></div>
            <div className="absolute inset-4 w-8 h-8 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue animate-glow flex items-center justify-center">
              <Zap className="w-4 h-4 text-dark-navy" />
            </div>
          </div>
          <p className="text-sm text-white max-w-2xl mx-auto">Ces innovations rendront Dorry encore plus intelligente et efficace pour accompagner les porteurs de projet.</p>
        </div>

        {/* Features Grid */}
        <div className="space-y-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-bright-turquoise/20 hover:border-bright-turquoise/40 transition-all duration-300 hover:shadow-lg hover:shadow-bright-turquoise/10 animate-fade-in" style={{
              animationDelay: `${index * 0.2}s`
            }}>
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-bright-turquoise/20 to-electric-blue/20">
                    <feature.icon className="w-5 h-5 text-bright-turquoise" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl font-bold text-white mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-white text-sm sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Details */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-bright-turquoise text-sm">Le rapport contiendra :</h4>
                  <ul className="space-y-1">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-sm text-white flex items-start">
                        <span className="text-electric-blue mr-2">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Info */}
                {feature.additionalInfo && (
                  <div className="p-3 rounded-lg bg-gradient-to-r from-bright-turquoise/5 to-electric-blue/5 border border-bright-turquoise/10">
                    <p className="text-xs sm:text-sm text-white italic">
                      {feature.additionalInfo}
                    </p>
                  </div>
                )}

                {/* Benefits */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-bright-turquoise text-sm">Utilité :</h4>
                  <div className="grid gap-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start space-x-2">
                        <span className="text-pink-400 text-sm mt-0.5">✔️</span>
                        <span className="text-xs sm:text-sm text-white flex-1">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 p-6 rounded-lg bg-gradient-to-r from-bright-turquoise/5 to-electric-blue/5 border border-bright-turquoise/10">
          <p className="text-sm text-white">
            💡 Ces fonctionnalités sont en cours de développement et seront déployées progressivement.
          </p>
          <p className="text-xs text-white mt-2">
            Restez connecté pour être informé des dernières nouveautés !
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingFeatures;
