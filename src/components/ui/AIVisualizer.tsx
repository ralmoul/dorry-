
import { useEffect, useState } from 'react';

interface AIVisualizerProps {
  isRecording: boolean;
  className?: string;
}

export const AIVisualizer = ({ isRecording, className = '' }: AIVisualizerProps) => {
  const [waves, setWaves] = useState<number[]>([]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaves(prev => {
          const newWaves = Array.from({ length: 8 }, () => Math.random() * 100 + 20);
          return newWaves;
        });
      }, 150);

      return () => clearInterval(interval);
    } else {
      setWaves([]);
    }
  }, [isRecording]);

  if (!isRecording) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-bright-turquoise/20 to-electric-blue/20 animate-pulse-ai"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-bright-turquoise/40 to-electric-blue/40 animate-pulse-ai"></div>
          <div className="absolute inset-8 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue animate-glow"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Cercles pulsants */}
        <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-bright-turquoise/20 to-electric-blue/20 animate-pulse-ai"></div>
        <div className="absolute inset-2 w-28 h-28 rounded-full bg-gradient-to-r from-bright-turquoise/30 to-electric-blue/30 animate-pulse-ai" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-r from-bright-turquoise/40 to-electric-blue/40 animate-pulse-ai" style={{ animationDelay: '1s' }}></div>
        
        {/* Ondes sonores */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-end space-x-1">
            {waves.map((height, index) => (
              <div
                key={index}
                className="w-1 bg-gradient-to-t from-bright-turquoise to-electric-blue rounded-full animate-wave"
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 0.1}s`,
                  maxHeight: '40px'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Centre lumineux */}
        <div className="absolute inset-8 w-16 h-16 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue animate-glow"></div>
      </div>
    </div>
  );
};
