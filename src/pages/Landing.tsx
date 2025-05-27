
import React, { useEffect, useState } from 'react';
import { VoiceWaves } from '@/components/ui/VoiceWaves';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { FloatingParticles } from '@/components/ui/FloatingParticles';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ConfettiButton } from '@/components/ui/ConfettiButton';
import { Mic, Brain, Search, FileText, Clock, Shield, Sparkles, TrendingUp, ArrowDown, Menu, X } from 'lucide-react';

const Landing = () => {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [{
    text: "Dorry a complètement transformé nos réunions d'équipe. Nous gagnons au moins 2 heures par semaine sur la rédaction des comptes rendus.",
    author: "Sophie M.",
    position: "Directrice de projet",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
  }, {
    text: "La précision de l'analyse est bluffante. Dorry capte des détails que j'aurais manqués, même en prenant des notes.",
    author: "Thomas L.",
    position: "Consultant",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
  }, {
    text: "L'intégration de Dorry dans notre workflow a augmenté notre productivité de 30%. Un investissement qui vaut vraiment le coup.",
    author: "Julie D.",
    position: "CEO Startup",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
  }];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const heroImage = document.querySelector('.hero-image') as HTMLElement;
    if (heroImage) {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      heroImage.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
  };

  return <div className="min-h-screen bg-slate-900 text-white" onMouseMove={handleMouseMove}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 py-3 md:py-4 transition-all duration-500 backdrop-blur-md ${isNavScrolled ? 'bg-slate-900/90 shadow-lg' : ''}`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-cyan-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex space-x-8">
            
            
            
            
          </div>
          <div className="hidden md:flex space-x-4">
            <a href="/login" className="px-6 py-2 border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors">
              Se connecter
            </a>
            <a href="/signup" className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 rounded-lg hover:shadow-lg transition-all">
              S'inscrire
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-700">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <a href="/login" className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors text-center">
                  Se connecter
                </a>
                <a href="/signup" className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 rounded-lg hover:shadow-lg transition-all text-center font-semibold">
                  S'inscrire
                </a>
              </div>
            </div>
          </div>}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 opacity-80"></div>
        <FloatingParticles />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            {/* Text content - order changes on mobile vs desktop */}
            <div className="flex-1 max-w-2xl text-center md:text-left order-1 md:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight">
                <TypewriterText text="Dorry, l'assistante IA qui révolutionne vos réunions" className="block bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent" />
              </h1>
              
              {/* Image positioned after title on mobile only */}
              <div className="flex md:hidden justify-center items-center relative mb-6">
                <div className="relative">
                  <div className="hero-image w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center transform-gpu transition-transform duration-300 overflow-hidden">
                    <img src="/lovable-uploads/769b9b8e-e57b-4e05-85eb-d7dfc432dd29.png" alt="Dorry AI Assistant" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 md:mb-8 px-2 md:px-0">
                Captez chaque moment, analysez en profondeur, et obtenez des comptes rendus précis sans lever le petit doigt.
              </p>
              <div className="flex flex-col items-center md:justify-start mb-8 md:mb-0">
                <ConfettiButton href="/support" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all mb-8 md:mb-0">
                  Demander l'accès
                </ConfettiButton>
                
                {/* Découvrir section - visible sur mobile en dessous du bouton */}
                <div className="flex md:hidden flex-col items-center opacity-70 mt-2">
                  <span className="text-xs uppercase tracking-widest mb-2">Découvrir</span>
                  <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />
                </div>
              </div>
            </div>
            
            {/* Image for desktop only - hidden on mobile */}
            <div className="hidden md:flex flex-1 justify-center items-center relative order-2">
              <div className="relative">
                <div className="hero-image w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center transform-gpu transition-transform duration-300 overflow-hidden">
                  <img src="/lovable-uploads/769b9b8e-e57b-4e05-85eb-d7dfc432dd29.png" alt="Dorry AI Assistant" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Découvrir section - visible sur desktop uniquement en bas de page */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-xs sm:text-sm uppercase tracking-widest mb-2">Découvrir</span>
          <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-bounce" />
        </div>
      </section>

      {/* Revolution Section */}
      <section className="py-16 md:py-32 bg-slate-800 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Comment Dorry révolutionne vos réunions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-2 md:px-0">Une expérience immersive qui transforme votre façon de travailler.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 relative order-2 md:order-1">
              <div className="relative w-full aspect-video">
                <img src="/lovable-uploads/60b9c7c7-d7aa-4c2a-91c4-5839d83373b6.png" alt="Dorry AI Data Analysis" className="w-full h-full object-cover rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-2xl animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex-1 space-y-6 md:space-y-8 order-1 md:order-2">
              {[{
              number: "01",
              title: "Enregistrement intelligent",
              description: "Dorry capture chaque mot, chaque nuance, même quand vous êtes concentré sur l'essentiel."
            }, {
              number: "02",
              title: "Analyse en temps réel",
              description: "L'IA identifie les points clés, les décisions et les actions à entreprendre."
            }, {
              number: "03",
              title: "Synthèse instantanée",
              description: "Un compte-rendu structuré et précis disponible en quelques minutes."
            }].map((step, index) => <div key={index} className="p-4 md:p-6 bg-slate-900/50 rounded-xl border-l-4 border-cyan-400 hover:transform hover:translate-x-2 transition-all">
                  <div className="text-cyan-400 text-base md:text-lg font-bold mb-2">{step.number}</div>
                  <h3 className="text-lg md:text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm md:text-base text-slate-300">{step.description}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-32 bg-slate-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Fonctionnalités qui font la différence
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-2 md:px-0">
              Découvrez comment Dorry simplifie votre quotidien professionnel
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[{
            icon: <Mic className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Parlez, Dorry écoute",
            description: "Enregistrez vos réunions ou entretiens, même en mains libres, avec une qualité audio exceptionnelle."
          }, {
            icon: <Brain className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Analyse instantanée par IA",
            description: "Dorry comprend chaque échange, détecte les points clés, les adresses, les RDV pris..."
          }, {
            icon: <Search className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Détection avancée",
            description: "Repère automatiquement les adresses et vérifie si votre porteur de projet est en QPV."
          }, {
            icon: <FileText className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Compte rendu détaillé",
            description: "Recevez une synthèse claire livrée en moins de 5 minutes, complète, prête à être archivée."
          }].map((feature, index) => <div key={index} className="p-6 md:p-8 bg-slate-800/30 rounded-xl text-center hover:transform hover:scale-105 transition-all group">
                <div className="relative mb-4 md:mb-6 flex justify-center">
                  <div className="text-cyan-400 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-lg scale-75"></div>
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">{feature.title}</h3>
                <p className="text-sm md:text-base text-slate-300">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Why Dorry Section */}
      <section className="py-16 md:py-32 bg-slate-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Pourquoi choisir Dorry ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-2 md:px-0">
              Des avantages concrets pour votre productivité
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            {[{
            icon: <Clock className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Gagnez un temps précieux",
            description: "Plus besoin de rédiger ou de mémoriser chaque échange. Concentrez-vous sur l'humain, Dorry s'occupe du reste."
          }, {
            icon: <Shield className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Fiabilité sans faille",
            description: "Finis les oublis de compte rendu, même après une journée chargée."
          }, {
            icon: <Sparkles className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Analyse IA intelligente",
            description: "Dorry reste connectée et attentive, même quand l'humain décroche. Chaque détail important est capturé."
          }, {
            icon: <TrendingUp className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Évolutif & innovant",
            description: "Des mises à jour régulières : Scoring automatique, recommandations intelligentes, messages WhatsApp personnalisés."
          }].map((benefit, index) => <div key={index} className="p-4 md:p-6 bg-slate-900/50 rounded-xl hover:transform hover:scale-105 transition-all">
                <div className="text-cyan-400 mb-3 md:mb-4">{benefit.icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-cyan-400">{benefit.title}</h3>
                <p className="text-sm md:text-base text-slate-300">{benefit.description}</p>
              </div>)}
          </div>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-around items-center gap-8 md:gap-16">
            {[{
            end: 87,
            suffix: "%",
            label: "de temps gagné sur la rédaction"
          }, {
            end: 98,
            suffix: "%",
            label: "de précision dans les analyses"
          }, {
            end: 5,
            suffix: " min",
            label: "pour un compte rendu complet"
          }].map((stat, index) => <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-2">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <p className="text-base sm:text-lg md:text-xl text-slate-300">{stat.label}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 relative overflow-hidden">
        <FloatingParticles />
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 max-w-4xl mx-auto">
            Rejoignez la nouvelle génération d'accompagnateurs augmentés par l'IA !
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 md:mb-12 max-w-2xl mx-auto px-2 md:px-0">
            L'esprit libre, le suivi assuré. Essayez dès maintenant et faites la différence.
          </p>
          <ConfettiButton href="/support" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-xl text-lg sm:text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all">
            Demander l'accès
          </ConfettiButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12 md:mb-16">
            <div className="flex-1 min-w-64 text-center md:text-left">
              <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-10 h-10 mb-4 mx-auto md:mx-0" />
              <p className="text-slate-300 max-w-sm mx-auto md:mx-0">
                L'assistante IA qui révolutionne l'accompagnement de projet
              </p>
            </div>
            
            <div className="flex-2 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16">
              <div className="text-center md:text-left">
                <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-cyan-400">Légal</h4>
                <div className="space-y-3">
                  <a href="/privacy-policy" className="block text-slate-300 hover:text-cyan-400 transition-colors">Politique de confidentialité</a>
                  <a href="/terms-of-service" className="block text-slate-300 hover:text-cyan-400 transition-colors">Conditions d'utilisation</a>
                  <a href="/legal-notice" className="block text-slate-300 hover:text-cyan-400 transition-colors">Mentions légales</a>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-cyan-400">Support</h4>
                <div className="space-y-3">
                  <a href="/support" className="block text-slate-300 hover:text-cyan-400 transition-colors">Aide & Contact</a>
                  <a href="#" className="block text-slate-300 hover:text-cyan-400 transition-colors">FAQ</a>
                  <a href="#" className="block text-slate-300 hover:text-cyan-400 transition-colors">Tutoriels</a>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-cyan-400">Innovation</h4>
                <p className="text-slate-300">
                  C'est le début d'une nouvelle ère pour l'accompagnement de projet.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 md:pt-8 border-t border-slate-700 gap-4">
            <p className="text-slate-400 text-sm text-center sm:text-left">© 2025 Dorry. Tous droits réservés.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-cyan-400 hover:text-slate-900 transition-all">L</a>
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-cyan-400 hover:text-slate-900 transition-all">T</a>
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-cyan-400 hover:text-slate-900 transition-all">I</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .nav-link {
          position: relative;
          font-weight: 500;
          padding: 0.5rem 0;
          transition: color 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #00B8D4;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-link:hover {
          color: #00B8D4;
        }
      `}</style>
    </div>;
};
export default Landing;
