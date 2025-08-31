
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/ui/animated-shader-hero';

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleExploreFeatures = () => {
    // Scroll vers la section suivante ou naviguer vers une page de fonctionnalités
    const nextSection = document.querySelector('#about-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Hero
      trustBadge={{
        text: "Approuvé par plus de 1000+ entreprises",
        icons: ["🚀"]
      }}
      headline={{
        line1: "Dorry, votre assistante IA",
        line2: "pour des réunions parfaites"
      }}
      subtitle="Captez chaque moment, analysez en profondeur, et obtenez des comptes rendus précis automatiquement. L'intelligence artificielle au service de votre productivité."
      buttons={{
        primary: {
          text: "Commencer gratuitement",
          onClick: handleGetStarted
        },
        secondary: {
          text: "Découvrir les fonctionnalités",
          onClick: handleExploreFeatures
        }
      }}
    />
  );
};
