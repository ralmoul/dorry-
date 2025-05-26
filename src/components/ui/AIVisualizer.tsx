
import { useEffect, useState } from 'react';

interface AIVisualizerProps {
  isRecording: boolean;
  className?: string;
  onRecordingToggle: () => void;
  isProcessing: boolean;
}

export const AIVisualizer = ({ isRecording, className = '', onRecordingToggle, isProcessing }: AIVisualizerProps) => {
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
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-bright-turquoise/20 to-electric-blue/20 animate-pulse-ai"></div>
          <div className="absolute inset-3 sm:inset-4 w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-bright-turquoise/40 to-electric-blue/40 animate-pulse-ai"></div>
          <div 
            className="absolute inset-6 sm:inset-8 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue animate-glow cursor-pointer flex items-center justify-center text-lg sm:text-2xl font-bold text-dark-navy transition-all duration-300 hover:scale-105 z-30"
            onClick={onRecordingToggle}
            style={{ 
              opacity: isProcessing ? 0.5 : 1,
              pointerEvents: isProcessing ? 'none' : 'auto'
            }}
          >
            {isProcessing ? '⟳' : '🎤'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        {/* Cercles pulsants - couche de fond */}
        <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-bright-turquoise/20 to-electric-blue/20 animate-pulse-ai z-10"></div>
        <div className="absolute inset-1 sm:inset-2 w-22 h-22 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-bright-turquoise/30 to-electric-blue/30 animate-pulse-ai z-10" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute inset-3 sm:inset-4 w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-bright-turquoise/40 to-electric-blue/40 animate-pulse-ai z-10" style={{ animationDelay: '1s' }}></div>
        
        {/* Ondes sonores - couche intermédiaire */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex items-end space-x-0.5 sm:space-x-1">
            {waves.map((height, index) => (
              <div
                key={index}
                className="w-0.5 sm:w-1 bg-gradient-to-t from-bright-turquoise to-electric-blue rounded-full animate-wave"
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 0.1}s`,
                  maxHeight: '30px'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Centre lumineux avec bouton intégré - couche de premier plan */}
        <div 
          className="absolute inset-6 sm:inset-8 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 animate-glow cursor-pointer flex items-center justify-center text-lg sm:text-2xl font-bold text-white transition-all duration-300 hover:scale-105 z-30"
          onClick={onRecordingToggle}
        >
          ⏹
        </div>
      </div>
    </div>
  );
};
