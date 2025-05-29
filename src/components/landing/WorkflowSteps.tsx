
import React, { useState, useEffect, useRef } from 'react';
import { Mic, FileText, User, FileCheck, BarChart3, FileSpreadsheet, Mail } from 'lucide-react';

export const WorkflowSteps = () => {
  const [visibleWorkflowSteps, setVisibleWorkflowSteps] = useState(0);
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: <Mic className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Réception d'un enregistrement audio",
      description: "Tu envoies à Dorry l'enregistrement vocal d'un entretien ou d'un échange avec un porteur de projet."
    },
    {
      icon: <FileText className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Transcription et journalisation",
      description: "Dorry transcrit l'audio de façon fidèle (grâce à l'IA Whisper d'OpenAI), tout en conservant la confidentialité et la sécurité des données."
    },
    {
      icon: <User className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Identification automatique",
      description: "Dorry reconnaît instantanément l'accompagnateur associé à l'échange grâce à l'ID envoyé, sans erreur ni confusion."
    },
    {
      icon: <FileCheck className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Extraction intelligente d'informations clés",
      description: "Grâce à son moteur d'analyse, Dorry extrait automatiquement le nom et les coordonnées du porteur, l'adresse, et tout autre élément pertinent évoqué pendant la discussion."
    },
    {
      icon: <BarChart3 className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Analyse sentimentale avancée",
      description: "Dorry analyse la motivation, la clarté du projet, le niveau d'urgence et les émotions dominantes du porteur. Elle attribue des scores et détecte les besoins d'accompagnement spécifiques."
    },
    {
      icon: <FileSpreadsheet className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Synthèse structurée et personnalisée",
      description: "Dorry rédige pour toi un compte-rendu lisible, structuré et directement actionnable, sans jargon technique. Chaque synthèse est ultra-personnalisée."
    },
    {
      icon: <Mail className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Envoi automatique du compte-rendu",
      description: "Le rapport final est envoyé directement à l'accompagnateur par email (aucune intervention humaine nécessaire !)."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedAnimation) {
            setHasStartedAnimation(true);
          }
        });
      },
      {
        threshold: 0.2, // L'animation se déclenche quand 20% de la section est visible
        rootMargin: '-50px 0px -50px 0px' // Marge pour s'assurer que la section est bien visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasStartedAnimation]);

  useEffect(() => {
    if (!hasStartedAnimation) return;

    const timer = setTimeout(() => {
      if (visibleWorkflowSteps < steps.length) {
        setVisibleWorkflowSteps(prev => prev + 1);
      }
    }, 800); // Délai augmenté de 300ms à 800ms

    return () => clearTimeout(timer);
  }, [visibleWorkflowSteps, steps.length, hasStartedAnimation]);

  return (
    <div ref={sectionRef} className="max-w-4xl mx-auto relative">
      {/* Ligne verticale de connexion - masquée sur très petit écran */}
      <div className="absolute top-0 bottom-0 left-6 md:left-8 lg:left-10 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-500 z-0 hidden sm:block"></div>
      
      {/* Étapes du workflow */}
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`relative pl-12 md:pl-16 lg:pl-20 mb-6 md:mb-8 lg:mb-10 transition-all duration-500 ${
            index < visibleWorkflowSteps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="absolute left-0 top-0 w-12 md:w-16 lg:w-20 h-12 md:h-16 lg:h-20 flex items-center justify-center z-10">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 shadow-lg">
              {step.icon}
            </div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg">
            <h4 className="text-lg md:text-xl font-semibold text-white mb-2">
              {step.title}
            </h4>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
