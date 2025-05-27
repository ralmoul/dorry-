
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { VoiceWaves } from '@/components/ui/VoiceWaves';
import { FloatingParticles } from '@/components/ui/FloatingParticles';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ConfettiButton } from '@/components/ui/ConfettiButton';
import { Mic, Brain, MapPin, Mail, Clock, Shield, Zap, Users, Star, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTypewriterComplete = () => {
    setTimeout(() => setShowSubtitle(true), 500);
    setTimeout(() => setShowFeatures(true), 1000);
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Directrice RH",
      company: "TechCorp",
      content: "Dorry a révolutionné nos entretiens de recrutement. Plus besoin de prendre des notes, je peux me concentrer entièrement sur le candidat.",
      rating: 5
    },
    {
      name: "Jean Martin",
      role: "Consultant",
      company: "ConseilPro",
      content: "Les comptes rendus automatiques me font gagner 2h par jour. La précision de l'analyse est impressionnante.",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Chef de projet",
      company: "Innovation Labs",
      content: "L'intégration avec notre workflow existant s'est faite en quelques minutes. Un outil indispensable !",
      rating: 5
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen immersive-bg relative">
      <FloatingParticles />
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'navbar-blur' : 'bg-transparent'
      }`}>
        <div className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center animate-pulse-ai">
              <span className="text-white font-bold text-base md:text-lg font-montserrat">D</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-montserrat bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
              Dorry
            </h1>
          </div>
          
          <div className="flex space-x-2 md:space-x-4 ml-auto">
            <Button 
              variant="outline" 
              onClick={handleLogin} 
              size="sm" 
              className="text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 border-bright-turquoise text-bright-turquoise hover:bg-bright-turquoise hover:text-white transition-all duration-300"
            >
              Se connecter
            </Button>
            <Button 
              onClick={handleGetStarted} 
              size="sm" 
              className="text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-bright-turquoise to-electric-blue text-white hover:opacity-90 transition-all duration-300 hover:scale-105"
            >
              S'inscrire
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="text-center py-32 px-6 max-w-6xl mx-auto relative">
        <div className="mb-12 relative">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-montserrat text-white mb-8 leading-tight">
            <TypewriterText 
              text="Dorry, l'IA qui révolutionne vos réunions" 
              delay={50} 
              onComplete={handleTypewriterComplete}
            />
          </h1>
          
          {showSubtitle && (
            <div className="animate-fade-in-up">
              <p className="text-xl md:text-2xl text-transparent bg-gradient-to-r from-bright-turquoise to-purple-gradient bg-clip-text mb-8 font-inter">
                Votre copilote de confiance pour des suivis sans effort et des comptes rendus ultra-fiables
              </p>
            </div>
          )}
        </div>

        {showFeatures && (
          <div className="mb-12 animate-fade-in-up">
            <div 
              className="hero-3d relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8"
              style={{
                transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full animate-pulse-ai ai-glow">
                <div className="absolute inset-4 bg-gradient-to-r from-purple-gradient to-turquoise-gradient rounded-full flex items-center justify-center">
                  <Mic className="w-16 h-16 md:w-20 md:h-20 text-white" />
                </div>
              </div>
              
              {/* Voice waves around the main circle */}
              <div className="absolute -inset-8">
                <VoiceWaves isActive={true} className="h-full" />
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-lg md:text-xl text-gray-300 mb-8 font-inter">
              <p className="animate-fade-in-up">
                Dorry vous accompagne lors de chaque réunion ou entretien, capte chaque moment, analyse, 
                détecte les informations essentielles et livre un compte rendu précis, sans que vous ayez à lever le petit doigt.
              </p>
            </div>

            <ConfettiButton 
              onClick={handleGetStarted} 
              size="lg" 
              className="bg-gradient-to-r from-bright-turquoise to-electric-blue text-white text-xl px-8 py-4 hover:opacity-90 animate-glow font-montserrat font-semibold"
            >
              Essayez dès aujourd'hui
              <ArrowRight className="ml-2 w-5 h-5" />
            </ConfettiButton>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-bright-turquoise/10 to-purple-gradient/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-bold font-montserrat mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <p className="text-gray-300 font-inter">de précision dans l'analyse</p>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold font-montserrat mb-2">
                <AnimatedCounter end={5} suffix=" min" />
              </div>
              <p className="text-gray-300 font-inter">pour recevoir votre compte rendu</p>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl md:text-5xl font-bold font-montserrat mb-2">
                <AnimatedCounter end={2} suffix="h" />
              </div>
              <p className="text-gray-300 font-inter">économisées par jour</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-center text-white mb-16">
            Comment Dorry révolutionne vos réunions ?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Mic,
                title: "Parlez, Dorry écoute",
                description: "Enregistrez vos réunions ou entretiens, même en mains libres !",
                delay: "0s"
              },
              {
                icon: Brain,
                title: "Analyse instantanée par IA",
                description: "Dorry comprend chaque échange, détecte les points clés, les adresses, les RDV pris…",
                delay: "0.2s"
              },
              {
                icon: MapPin,
                title: "Détection avancée",
                description: "Repère automatiquement les adresses et vérifie si votre porteur de projet est en QPV.",
                delay: "0.4s"
              },
              {
                icon: Mail,
                title: "Compte rendu détaillé",
                description: "Recevez une synthèse claire livrée en moins de 5 minutes, complète, prête à être archivée.",
                delay: "0.6s"
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="holographic-card hover:scale-105 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: feature.delay }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center animate-pulse-ai">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 font-inter">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi choisir Dorry */}
      <section className="py-20 px-6 bg-gradient-to-r from-electric-blue/5 to-bright-turquoise/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-center text-white mb-16">
            Pourquoi choisir Dorry ?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "Gagnez un temps précieux",
                description: "Plus besoin de rédiger ou de mémoriser chaque échange. Concentrez-vous sur l'humain, Dorry s'occupe du reste."
              },
              {
                icon: Shield,
                title: "Fiabilité sans faille",
                description: "Finis les oublis de compte rendu, même après une journée chargée."
              },
              {
                icon: Zap,
                title: "Analyse IA intelligente",
                description: "Dorry reste connectée et attentive, même quand l'humain décroche. Chaque détail important est capturé."
              },
              {
                icon: Users,
                title: "Évolutif & innovant",
                description: "Des mises à jour régulières : Scoring automatique, recommandations intelligentes, messages WhatsApp personnalisés."
              }
            ].map((benefit, index) => (
              <Card 
                key={index} 
                className="holographic-card hover:scale-105 transition-all duration-500 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-gradient to-turquoise-gradient rounded-full flex items-center justify-center animate-glow">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-300 font-inter">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-white mb-16">
            Ils nous font confiance
          </h2>
          
          <div className="relative">
            <Card className="holographic-card p-8 min-h-[200px] flex items-center justify-center">
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl font-inter text-gray-200 mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="text-bright-turquoise font-montserrat font-semibold">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-400 font-inter">
                  {testimonials[currentTestimonial].role} - {testimonials[currentTestimonial].company}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-bright-turquoise' : 'bg-gray-600'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-bright-turquoise via-electric-blue to-purple-gradient relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
            Rejoignez la nouvelle génération d'accompagnateurs augmentés par l'IA !
          </h2>
          <p className="text-xl font-inter mb-8 opacity-90">
            L'esprit libre, le suivi assuré. Essayez dès maintenant et faites la différence.
          </p>
          <ConfettiButton 
            onClick={handleGetStarted} 
            size="lg" 
            className="bg-white text-bright-turquoise text-xl px-8 py-4 hover:bg-gray-100 font-montserrat font-semibold"
          >
            Commencer gratuitement
            <ArrowRight className="ml-2 w-5 h-5" />
          </ConfettiButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm text-white py-12 px-6 border-t border-bright-turquoise/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold font-montserrat">D</span>
                </div>
                <h3 className="text-lg font-bold font-montserrat">Dorry</h3>
              </div>
              <p className="text-gray-300 font-inter">L'assistante IA qui révolutionne l'accompagnement.</p>
            </div>
            <div>
              <h4 className="font-semibold font-montserrat mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-300 font-inter">
                <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-bright-turquoise transition-colors">Politique de confidentialité</button></li>
                <li><button onClick={() => navigate('/terms-of-service')} className="hover:text-bright-turquoise transition-colors">Conditions d'utilisation</button></li>
                <li><button onClick={() => navigate('/legal-notice')} className="hover:text-bright-turquoise transition-colors">Mentions légales</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold font-montserrat mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300 font-inter">
                <li><button onClick={() => navigate('/support')} className="hover:text-bright-turquoise transition-colors">Aide & Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold font-montserrat mb-4">Innovation</h4>
              <p className="text-gray-300 font-inter">C'est le début d'une nouvelle ère pour l'accompagnement.</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-gray-300 font-inter">
            <p>© 2025 Dorry. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
