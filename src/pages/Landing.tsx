import React, { useEffect, useState, useRef } from 'react';
import { VoiceWaves } from '@/components/ui/VoiceWaves';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { FloatingParticles } from '@/components/ui/FloatingParticles';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ConfettiButton } from '@/components/ui/ConfettiButton';
import { Mic, Brain, Search, FileText, Clock, Shield, Sparkles, TrendingUp, ArrowDown, Menu, X, User, FileCheck, MessageCircle, Mail, FileSpreadsheet, BarChart3 } from 'lucide-react';
const Landing = () => {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleWorkflowSteps, setVisibleWorkflowSteps] = useState([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const workflowStepsRef = useRef([]);
  const featuresRef = useRef(null);
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

      // Animation des étapes du workflow au scroll
      if (workflowStepsRef.current.length > 0) {
        workflowStepsRef.current.forEach((step, index) => {
          if (step && isElementInViewport(step) && !visibleWorkflowSteps.includes(index)) {
            setVisibleWorkflowSteps(prev => [...prev, index]);
          }
        });
      }

      // Animation de la section fonctionnalités
      if (featuresRef.current && isElementInViewport(featuresRef.current)) {
        const interval = setInterval(() => {
          setActiveFeature(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleWorkflowSteps]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  const handleMouseMove = e => {
    // Désactiver l'animation sur mobile
    if (window.innerWidth <= 768) return;
    const heroImage = document.querySelector('.hero-image') as HTMLElement;
    if (heroImage) {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      heroImage.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
  };

  // Fonction pour vérifier si un élément est visible dans la fenêtre
  const isElementInViewport = el => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
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

      {/* Hero Section avec animation améliorée */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 md:pt-0 pb-4 md:pb-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 opacity-80"></div>
        
        {/* Particules animées améliorées */}
        <div className="absolute inset-0 z-0">
          {Array.from({
          length: 30
        }).map((_, i) => <div key={i} className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20" style={{
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite ${Math.random() * 5}s`,
          filter: 'blur(1px)'
        }} />)}
        </div>
        
        {/* Remove sound waves animation */}
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            {/* Text content - order changes on mobile vs desktop */}
            <div className="flex-1 max-w-2xl text-center md:text-left order-1 md:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight animate-fadeIn">
                <TypewriterText text="Dorry, l'assistante IA qui révolutionne vos réunions" className="block bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent" />
              </h1>
              
              {/* Image positioned after title on mobile only */}
              <div className="flex md:hidden justify-center items-center relative mb-6 animate-fadeInUp" style={{
              animationDelay: '0.5s'
            }}>
                <div className="relative">
                  <div className="hero-image w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center transform-gpu transition-transform duration-300 overflow-hidden">
                    <img src="/lovable-uploads/769b9b8e-e57b-4e05-85eb-d7dfc432dd29.png" alt="Dorry AI Assistant" className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 md:mb-8 px-2 md:px-0 animate-fadeInUp" style={{
              animationDelay: '0.7s'
            }}>
                Captez chaque moment, analysez en profondeur, et obtenez des comptes rendus précis sans lever le petit doigt.
              </p>
              <div className="flex flex-col items-center md:justify-start mb-8 md:mb-0 animate-fadeInUp" style={{
              animationDelay: '0.9s'
            }}>
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
            <div className="hidden md:flex flex-1 justify-center items-center relative order-2 animate-fadeInRight" style={{
            animationDelay: '0.5s'
          }}>
              <div className="relative">
                <div className="hero-image w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center transform-gpu transition-transform duration-300 overflow-hidden">
                  <img src="/lovable-uploads/769b9b8e-e57b-4e05-85eb-d7dfc432dd29.png" alt="Dorry AI Assistant" className="w-full h-full object-contain" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full animate-pulse"></div>
                
                {/* Cercles concentriques animés */}
                {Array.from({
                length: 3
              }).map((_, i) => <div key={i} className="absolute inset-0 rounded-full border border-cyan-400/30" style={{
                animation: `ripple 3s ease-out infinite ${i * 0.5}s`
              }}></div>)}
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

      {/* Section Concrètement à quoi sert Dorry - Workflow complet */}
      <section className="py-16 md:py-32 bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {Array.from({
          length: 20
        }).map((_, i) => <div key={i} className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-10" style={{
          width: `${Math.random() * 15 + 5}px`,
          height: `${Math.random() * 15 + 5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite ${Math.random() * 5}s`,
          filter: 'blur(2px)'
        }} />)}
        </div>
        
        {/* Lignes de connexion animées */}
        <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 1px, transparent 1px), radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        backgroundPosition: '0 0, 25px 25px',
        animation: 'connectionMove 60s linear infinite'
      }}></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-fadeIn">
              Concrètement à quoi sert Dorry ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-2 md:px-0 animate-fadeInUp" style={{
            animationDelay: '0.2s'
          }}>
              L'assistant IA qui transforme tes échanges en synthèse claire et actionnable
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-16">
            <div className="flex-1 relative order-2 md:order-1 animate-fadeInLeft" style={{
            animationDelay: '0.4s'
          }}>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                <img src="/lovable-uploads/60b9c7c7-d7aa-4c2a-91c4-5839d83373b6.png" alt="Dorry AI Data Analysis" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 animate-pulse"></div>
                
                {/* Overlay avec effet de données */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300 bg-slate-900/70 backdrop-blur-sm p-6">
                    <div className="text-cyan-400 mb-4">
                      <FileText className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-center text-lg font-semibold mb-2">Dorry automatise tout le processus</p>
                    <p className="text-center text-sm">De l'enregistrement à la synthèse, sans effort humain</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-6 md:space-y-8 order-1 md:order-2 animate-fadeInRight" style={{
            animationDelay: '0.4s'
          }}>
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
                <p className="text-gray-300 leading-relaxed">
                  Dorry est une intelligence artificielle spécialisée dans le suivi des porteurs de projet, conçue pour les accompagnateurs. Elle automatise la prise de notes, l'analyse de rendez-vous et la génération de comptes-rendus personnalisés, le tout… sans effort humain !
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
                <p className="text-xl text-white leading-relaxed">
                  <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Dorry écoute, comprend et synthétise pour toi.</span><br />
                  Il te suffit d'enregistrer ton rendez-vous, Dorry s'occupe du reste.
                </p>
              </div>
            </div>
          </div>
          
          {/* Titre de la section workflow */}
          <h3 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-10 animate-fadeIn" style={{
          animationDelay: '0.6s'
        }}>
            Comment ça marche ?
          </h3>
          
          {/* Workflow steps */}
          <div className="max-w-4xl mx-auto relative">
            {/* Ligne verticale de connexion */}
            <div className="absolute top-0 bottom-0 left-8 md:left-10 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-500 z-0"></div>
            
            {/* Étapes du workflow */}
            {[{
            icon: <Mic className="w-6 h-6" />,
            title: "Réception d'un enregistrement audio",
            description: "Tu envoies à Dorry l'enregistrement vocal d'un entretien ou d'un échange avec un porteur de projet."
          }, {
            icon: <FileText className="w-6 h-6" />,
            title: "Transcription et journalisation",
            description: "Dorry transcrit l'audio de façon fidèle (grâce à l'IA Whisper d'OpenAI), tout en conservant la confidentialité et la sécurité des données."
          }, {
            icon: <User className="w-6 h-6" />,
            title: "Identification automatique",
            description: "Dorry reconnaît instantanément l'accompagnateur associé à l'échange grâce à l'ID envoyé, sans erreur ni confusion."
          }, {
            icon: <FileCheck className="w-6 h-6" />,
            title: "Extraction intelligente d'informations clés",
            description: "Grâce à son moteur d'analyse, Dorry extrait automatiquement le nom et les coordonnées du porteur, l'adresse, et tout autre élément pertinent évoqué pendant la discussion."
          }, {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Analyse sentimentale avancée",
            description: "Dorry analyse la motivation, la clarté du projet, le niveau d'urgence et les émotions dominantes du porteur. Elle attribue des scores et détecte les besoins d'accompagnement spécifiques."
          }, {
            icon: <FileSpreadsheet className="w-6 h-6" />,
            title: "Synthèse structurée et personnalisée",
            description: "Dorry rédige pour toi un compte-rendu lisible, structuré et directement actionnable, sans jargon technique. Chaque synthèse est ultra-personnalisée."
          }, {
            icon: <Mail className="w-6 h-6" />,
            title: "Envoi automatique du compte-rendu",
            description: "Le rapport final est envoyé directement à l'accompagnateur par email (aucune intervention humaine nécessaire !)."
          }].map((step, index) => <div key={index} ref={el => workflowStepsRef.current[index] = el} className={`relative pl-16 md:pl-20 mb-10 transform transition-all duration-700 ${visibleWorkflowSteps.includes(index) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{
            transitionDelay: `${index * 100}ms`
          }}>
                <div className="absolute left-0 top-0 w-16 md:w-20 h-16 md:h-20 flex items-center justify-center z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 shadow-lg">
                    {step.icon}
                  </div>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-lg transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
                  <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>)}
          </div>
          
          {/* Stats animés */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn" style={{
          animationDelay: '0.8s'
        }}>
            {[{
            end: 87,
            suffix: "%",
            label: "de temps gagné sur la rédaction",
            icon: <Clock className="w-8 h-8" />
          }, {
            end: 98,
            suffix: "%",
            label: "de précision dans les analyses",
            icon: <Brain className="w-8 h-8" />
          }, {
            end: 5,
            suffix: " min",
            label: "pour un compte rendu complet",
            icon: <FileText className="w-8 h-8" />
          }].map((stat, index) => <div key={index} className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
                <div className="text-cyan-400 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <p className="text-base sm:text-lg text-slate-300">{stat.label}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Fonctionnalités Section - Redesigned with more animations */}
      <section className="py-16 md:py-32 bg-slate-900 relative overflow-hidden" ref={featuresRef}>
        <div className="absolute inset-0 z-0">
          {Array.from({
          length: 15
        }).map((_, i) => <div key={i} className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-10" style={{
          width: `${Math.random() * 20 + 10}px`,
          height: `${Math.random() * 20 + 10}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 20 + 10}s ease-in-out infinite ${Math.random() * 5}s`,
          filter: 'blur(3px)'
        }} />)}
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16 animate-fadeIn">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Fonctionnalités qui font la différence
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-2 md:px-0">
              Découvrez comment Dorry simplifie votre quotidien professionnel
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Feature Showcase - Left Side */}
            <div className="flex-1 order-2 md:order-1 animate-fadeInLeft" style={{
            animationDelay: '0.3s'
          }}>
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Feature Icons with Animation */}
                {[{
                icon: <Mic className="w-full h-full" />,
                position: 'top-0 left-0',
                color: 'from-cyan-400 to-blue-500'
              }, {
                icon: <Brain className="w-full h-full" />,
                position: 'top-0 right-0',
                color: 'from-blue-500 to-purple-500'
              }, {
                icon: <Search className="w-full h-full" />,
                position: 'bottom-0 left-0',
                color: 'from-purple-500 to-cyan-400'
              }, {
                icon: <FileText className="w-full h-full" />,
                position: 'bottom-0 right-0',
                color: 'from-cyan-400 to-blue-500'
              }].map((item, index) => <div key={index} className={`absolute w-1/2 h-1/2 p-6 ${item.position} transition-all duration-500 transform`} style={{
                opacity: activeFeature === index ? 1 : 0.3,
                transform: activeFeature === index ? 'scale(1.1)' : 'scale(0.9)',
                filter: activeFeature === index ? 'none' : 'blur(1px)'
              }}>
                    <div className={`w-full h-full rounded-2xl bg-slate-800/50 backdrop-blur-sm flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r ${item.color} p-4 border border-slate-700/50 shadow-lg`}>
                      {item.icon}
                    </div>
                  </div>)}
                
                {/* Central connecting element */}
                
                
                {/* Connecting lines */}
                {Array.from({
                length: 4
              }).map((_, i) => <div key={i} className="absolute top-1/2 left-1/2 w-1/3 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 origin-left" style={{
                transform: `rotate(${i * 90}deg)`,
                opacity: activeFeature === i ? 1 : 0.3,
                transition: 'opacity 0.5s ease'
              }}></div>)}
              </div>
            </div>
            
            {/* Feature Details - Right Side */}
            <div className="flex-1 order-1 md:order-2 animate-fadeInRight" style={{
            animationDelay: '0.3s'
          }}>
              <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50 shadow-lg">
                {[{
                title: "Parlez, Dorry écoute",
                description: "Enregistrez vos réunions ou entretiens, même en mains libres, avec une qualité audio exceptionnelle. Dorry capture chaque mot, chaque nuance, même quand vous êtes concentré sur l'essentiel.",
                icon: <Mic className="w-10 h-10 md:w-12 md:h-12" />
              }, {
                title: "Analyse instantanée par IA",
                description: "Dorry comprend chaque échange, détecte les points clés, les adresses, les RDV pris. L'IA identifie les décisions et les actions à entreprendre avec une précision remarquable.",
                icon: <Brain className="w-10 h-10 md:w-12 md:h-12" />
              }, {
                title: "Détection avancée",
                description: "Repère automatiquement les adresses et vérifie si votre porteur de projet est en QPV. Dorry reste connectée et attentive, même quand l'humain décroche.",
                icon: <Search className="w-10 h-10 md:w-12 md:h-12" />
              }, {
                title: "Compte rendu détaillé",
                description: "Recevez une synthèse claire livrée en moins de 5 minutes, complète, prête à être archivée. Un compte-rendu structuré et précis disponible en quelques minutes.",
                icon: <FileText className="w-10 h-10 md:w-12 md:h-12" />
              }].map((feature, index) => <div key={index} className={`transition-all duration-500 transform ${activeFeature === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`} style={{
                display: activeFeature === index ? 'block' : 'none'
              }}>
                    <div className="flex items-center mb-4">
                      <div className="text-cyan-400 mr-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-lg text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Feature navigation */}
                    <div className="mt-8 flex justify-center space-x-2">
                      {Array.from({
                    length: 4
                  }).map((_, i) => <button key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFeature === i ? 'bg-cyan-400 w-6' : 'bg-slate-600'}`} onClick={() => setActiveFeature(i)}></button>)}
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir Dorry - Section simplifiée et améliorée */}
      <section className="py-16 md:py-32 bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-slate-900/50"></div>
          {Array.from({
          length: 10
        }).map((_, i) => <div key={i} className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-10" style={{
          width: `${Math.random() * 30 + 20}px`,
          height: `${Math.random() * 30 + 20}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 25 + 15}s ease-in-out infinite ${Math.random() * 5}s`,
          filter: 'blur(5px)'
        }} />)}
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16 animate-fadeIn">
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
            description: "Plus besoin de rédiger ou de mémoriser chaque échange. Concentrez-vous sur l'humain, Dorry s'occupe du reste.",
            delay: 0.1,
            color: "from-cyan-400 to-blue-500"
          }, {
            icon: <Shield className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Fiabilité sans faille",
            description: "Finis les oublis de compte rendu, même après une journée chargée.",
            delay: 0.2,
            color: "from-blue-500 to-purple-500"
          }, {
            icon: <Sparkles className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Analyse IA intelligente",
            description: "Dorry reste connectée et attentive, même quand l'humain décroche. Chaque détail important est capturé.",
            delay: 0.3,
            color: "from-purple-500 to-blue-500"
          }, {
            icon: <TrendingUp className="w-10 h-10 md:w-12 md:h-12" />,
            title: "Évolutif & innovant",
            description: "Des mises à jour régulières : Scoring automatique, recommandations intelligentes, messages WhatsApp personnalisés.",
            delay: 0.4,
            color: "from-blue-500 to-cyan-400"
          }].map((benefit, index) => <div key={index} className="p-6 md:p-8 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg transform transition-all duration-500 hover:translate-y-[-10px] hover:shadow-xl animate-fadeInUp" style={{
            animationDelay: `${benefit.delay}s`
          }}>
                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${benefit.color} mb-4 md:mb-6`}>
                  {benefit.icon}
                </div>
                <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r ${benefit.color}`}>
                  {benefit.title}
                </h3>
                <p className="text-slate-300">{benefit.description}</p>
                
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              </div>)}
          </div>
          
          {/* Témoignages */}
          
        </div>
      </section>

      {/* CTA Section - Enhanced with more animations */}
      <section className="py-16 md:py-32 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 relative overflow-hidden">
        {/* Particules animées améliorées */}
        <div className="absolute inset-0 z-0">
          {Array.from({
          length: 40
        }).map((_, i) => <div key={i} className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20" style={{
          width: `${Math.random() * 8 + 2}px`,
          height: `${Math.random() * 8 + 2}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 15 + 5}s ease-in-out infinite ${Math.random() * 5}s`,
          filter: 'blur(1px)'
        }} />)}
        </div>
        
        {/* Vagues animées */}
        <div className="absolute bottom-0 left-0 right-0 h-20 opacity-30">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
            <path fill="url(#gradient)" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" style={{
            animation: 'wave 15s ease-in-out infinite'
          }}></path>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 max-w-4xl mx-auto animate-fadeIn">
            Rejoignez la nouvelle génération d'accompagnateurs augmentés par l'IA !
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 md:mb-12 max-w-2xl mx-auto px-2 md:px-0 animate-fadeInUp" style={{
          animationDelay: '0.2s'
        }}>
            L'esprit libre, le suivi assuré. Essayez dès maintenant et faites la différence.
          </p>
          <div className="animate-fadeInUp" style={{
          animationDelay: '0.4s'
        }}>
            <ConfettiButton href="/support" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-xl text-lg sm:text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all">
              Demander l'accès
            </ConfettiButton>
          </div>
          
          {/* Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 animate-fadeInUp" style={{
          animationDelay: '0.6s'
        }}>
            {[{
            text: "IA avancée",
            color: "from-cyan-400 to-blue-500"
          }, {
            text: "Sécurisé",
            color: "from-blue-500 to-purple-500"
          }, {
            text: "Confidentiel",
            color: "from-purple-500 to-blue-500"
          }, {
            text: "Rapide",
            color: "from-blue-500 to-cyan-400"
          }].map((badge, index) => <div key={index} className={`px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} text-slate-900 font-semibold text-sm shadow-lg`}>
                {badge.text}
              </div>)}
          </div>
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
                  <a href="/support" className="block text-slate-300 hover:text-cyan-400 transition-colors">Contact</a>
                  
                  
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

      <style>
        {`
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
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(50px, -30px);
          }
          50% {
            transform: translate(20px, 50px);
          }
          75% {
            transform: translate(-30px, 20px);
          }
        }
        
        @keyframes connectionMove {
          0% {
            background-position: 0 0, 25px 25px;
          }
          100% {
            background-position: 1000px 1000px, 1025px 1025px;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes soundWave {
          0%, 100% {
            height: 10px;
          }
          50% {
            height: 40px;
          }
        }
        
        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-fadeInLeft {
          animation: fadeInLeft 1s ease-out forwards;
        }
        
        .animate-fadeInRight {
          animation: fadeInRight 1s ease-out forwards;
        }
        `}
      </style>
    </div>;
};
export default Landing;