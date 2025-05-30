
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Pause, Play, Send } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  formatRecordingTime: (time: number) => string;
  onMicClick: () => void;
  onPauseResumeClick: () => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  recordingTime,
  formatRecordingTime,
  onMicClick,
  onPauseResumeClick
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* Status text */}
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div
            key="recording"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-white text-sm sm:text-lg mb-8 sm:mb-10 md:mb-12 text-center"
          >
            {isPaused ? 'Enregistrement en pause' : 'Enregistrement en cours...'} {formatRecordingTime(recordingTime)}
          </motion.div>
        ) : (
          <motion.div
            key="instruction"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-white text-sm sm:text-lg mb-8 sm:mb-10 md:mb-12 text-center px-4"
          >
            Appuyer sur le micro pour commencer
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control buttons */}
      <div className="flex items-center justify-center space-x-4">
        {/* Pause/Resume button (only visible during recording) */}
        {isRecording && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onPauseResumeClick}
            className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center focus:outline-none bg-gradient-to-r from-yellow-500 to-orange-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPaused ? (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            ) : (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            )}
          </motion.button>
        )}

        {/* Main microphone button */}
        <motion.button
          onClick={onMicClick}
          className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center focus:outline-none ${
            isRecording
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : 'bg-gradient-to-r from-bright-turquoise to-electric-blue'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isRecording && !isPaused
              ? [
                  '0 0 0 0 rgba(239, 68, 68, 0)',
                  '0 0 0 15px rgba(239, 68, 68, 0.3)',
                  '0 0 0 0 rgba(239, 68, 68, 0)'
                ]
              : [
                  '0 0 0 0 rgba(0, 184, 212, 0)',
                  '0 0 0 10px rgba(0, 184, 212, 0.3)',
                  '0 0 0 0 rgba(0, 184, 212, 0)'
                ]
          }}
          transition={{
            boxShadow: {
              repeat: Infinity,
              duration: 1.5
            }
          }}
        >
          <motion.div
            animate={{
              scale: isRecording && !isPaused ? [1, 1.2, 1] : 1
            }}
            transition={{
              scale: {
                repeat: isRecording && !isPaused ? Infinity : 0,
                duration: 1
              }
            }}
          >
            {isRecording ? (
              <Send className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
            ) : (
              <Mic className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};
