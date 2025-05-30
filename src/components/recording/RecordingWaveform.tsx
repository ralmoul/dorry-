
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecordingWaveformProps {
  isRecording: boolean;
  isPaused: boolean;
  waveform: number[];
}

export const RecordingWaveform: React.FC<RecordingWaveformProps> = ({
  isRecording,
  isPaused,
  waveform
}) => {
  return (
    <div className="relative mb-8 sm:mb-10 md:mb-12">
      {/* Animated concentric circles */}
      <AnimatePresence>
        {isRecording && !isPaused && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeOut"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-bright-turquoise"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeOut",
                delay: 0.3
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-electric-blue"
            />
          </>
        )}
      </AnimatePresence>

      {/* Waveform visualization around the button */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
        <div className="flex items-center justify-center w-full h-full">
          {waveform.map((height, index) => (
            <motion.div
              key={index}
              className="w-1 mx-0.5 rounded-full bg-gradient-to-t from-bright-turquoise to-electric-blue"
              style={{
                height: `${height}px`,
                opacity: isRecording && !isPaused ? 0.8 : 0.3
              }}
              animate={{
                height: `${height}px`,
                opacity: isRecording && !isPaused ? 0.8 : 0.3
              }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
