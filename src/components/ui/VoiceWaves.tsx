
import { useEffect, useState } from 'react';

interface VoiceWavesProps {
  isActive?: boolean;
  className?: string;
}

export const VoiceWaves = ({ isActive = true, className = '' }: VoiceWavesProps) => {
  const [waves, setWaves] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setWaves(Array.from({ length: 12 }, () => Math.random() * 40 + 20));
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      setWaves(Array.from({ length: 12 }, () => 20));
    }
  }, [isActive]);

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {waves.map((height, index) => (
        <div
          key={index}
          className="voice-wave"
          style={{
            height: `${height}px`,
            animationDelay: `${index * 0.1}s`,
            animationDuration: isActive ? '1.5s' : '0s'
          }}
        />
      ))}
    </div>
  );
};
