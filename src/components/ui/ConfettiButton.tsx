
import { useState } from 'react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

interface ConfettiButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  href?: string;
}

export const ConfettiButton = ({ 
  children, 
  onClick, 
  className = '',
  variant = "default",
  size = "default",
  href
}: ConfettiButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const createConfetti = () => {
    const button = document.activeElement as HTMLElement;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const colors = ['#00d4aa', '#0066ff', '#6a11cb', '#00b8d4'];
    
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = `${rect.left + rect.width / 2}px`;
      confetti.style.top = `${rect.top + rect.height / 2}px`;
      confetti.style.width = '6px';
      confetti.style.height = '6px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.pointerEvents = 'none';
      confetti.style.borderRadius = '50%';
      confetti.style.zIndex = '9999';
      
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 150 + Math.random() * 100;
      const gravity = 500;
      const life = 1000 + Math.random() * 500;
      
      let startTime: number;
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = elapsed / life;
        
        if (progress >= 1) {
          confetti.remove();
          return;
        }
        
        const x = Math.cos(angle) * velocity * (elapsed / 1000);
        const y = Math.sin(angle) * velocity * (elapsed / 1000) + 
                  0.5 * gravity * Math.pow(elapsed / 1000, 2);
        
        confetti.style.transform = `translate(${x}px, ${y}px) rotate(${elapsed * 0.5}deg)`;
        confetti.style.opacity = (1 - progress).toString();
        
        requestAnimationFrame(animate);
      };
      
      document.body.appendChild(confetti);
      requestAnimationFrame(animate);
    }
  };

  const handleClick = () => {
    setIsAnimating(true);
    createConfetti();
    
    // Petit délai pour permettre à l'animation de démarrer avant la navigation
    setTimeout(() => {
      if (href) {
        navigate(href);
      }
      onClick?.();
    }, 100);
    
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`transition-all duration-300 ${isAnimating ? 'scale-105' : ''} ${className}`}
    >
      {children}
    </Button>
  );
};
