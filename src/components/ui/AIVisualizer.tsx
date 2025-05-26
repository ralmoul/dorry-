
import { useEffect, useState } from 'react';
import { Mic, Square } from 'lucide-react';

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
        <div className="relative w-32 h-32 lg:w-40 lg:h-40">
          {/* Cercles animés d'arrière-plan */}
          <div className="absolute inset-0 w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-r from-ai-cyan/20 to-ai-blue/20 animate-pulse"></div>
          <div className="absolute inset-4 w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-r from-ai-blue/30 to-ai-purple/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-8 w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-r from-ai-purple/40 to-ai-pink/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Bouton central avec effet glow */}
          <div 
            className="absolute inset-12 lg:inset-16 w-8 h-8 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-ai-cyan to-ai-blue mic-glow cursor-pointer flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-30 shadow-2xl"
            onClick={onRecordingToggle}
            style={{ 
              opacity: isProcessing ? 0.5 : 1,
              pointerEvents: isProcessing ? 'none' : 'auto'
            }}
          >
            {isProcessing ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-32 h-32 lg:w-40 lg:h-40">
        {/* Cercles pulsants - couche de fond */}
        <div className="absolute inset-0 w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-r from-ai-cyan/30 to-ai-blue/30 animate-pulse z-10"></div>
        <div className="absolute inset-2 w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-r from-ai-blue/40 to-ai-purple/40 animate-pulse z-10" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute inset-4 w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-r from-ai-purple/50 to-ai-pink/50 animate-pulse z-10" style={{ animationDelay: '0.6s' }}></div>
        
        {/* Ondes sonores - couche intermédiaire */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex items-end space-x-1">
            {waves.map((height, index) => (
              <div
                key={index}
                className="w-1 bg-gradient-to-t from-ai-cyan via-ai-blue to-ai-purple rounded-full animate-pulse"
                style={{
                  height: `${Math.min(height, 60)}%`,
                  animationDelay: `${index * 0.1}s`,
                  maxHeight: '40px'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Centre lumineux avec bouton stop */}
        <div 
          className="absolute inset-12 lg:inset-16 w-8 h-8 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 cursor-pointer flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-30 shadow-2xl mic-glow"
          onClick={onRecordingToggle}
        >
          <Square className="w-3 h-3 fill-current" />
        </div>
      </div>
    </div>
  );
};
