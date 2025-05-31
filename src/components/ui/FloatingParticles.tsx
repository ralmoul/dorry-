
import { useEffect, useState, useMemo, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  delay: number;
  size: number;
  duration: number;
}

export const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Optimisation : réduire le nombre de particules sur mobile pour les performances
  const particleCount = useMemo(() => {
    return window.innerWidth > 768 ? 12 : 6; // Réduit de 15/6 à 12/6
  }, []);

  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 2 + 1, // Taille légèrement réduite
        duration: Math.random() * 8 + 12 // Durée légèrement réduite
      });
    }
    setParticles(newParticles);
  }, [particleCount]);

  useEffect(() => {
    generateParticles();
    // Optimisation : interval moins fréquent
    const interval = setInterval(generateParticles, 8000);
    
    return () => clearInterval(interval);
  }, [generateParticles]);

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            willChange: 'transform, opacity', // Optimisation GPU
          }}
        />
      ))}
    </div>
  );
};
