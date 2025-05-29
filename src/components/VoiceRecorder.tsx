
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Pause, Play, Send } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { RecordingConfirmation } from '@/components/ui/RecordingConfirmation';
import { useAuth } from '@/hooks/useAuth';

interface VoiceRecorderProps {
  onOpenSettings: () => void;
  onOpenUpcomingFeatures: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onOpenSettings,
  onOpenUpcomingFeatures
}) => {
  const {
    user,
    isAuthenticated
  } = useAuth();
  const {
    isRecording,
    isPaused,
    isProcessing,
    showConfirmation,
    recordingTime,
    formatTime,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    confirmSend,
    cancelRecording
  } = useAudioRecorder();
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(5));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveformRef = useRef<NodeJS.Timeout | null>(null);

  console.log('🎤 [VOICE_RECORDER] Auth state:', {
    isAuthenticated,
    user: user ? {
      id: user.id,
      firstName: user.firstName
    } : null
  });

  // Simule l'animation des ondes vocales
  useEffect(() => {
    if (isRecording && !isPaused) {
      waveformRef.current = setInterval(() => {
        setWaveform(prev => prev.map(() => Math.floor(Math.random() * 30) + 5));
      }, 150);
      timerRef.current = setInterval(() => {
        // Le timer est maintenant géré par useAudioRecorder
      }, 1000);
    } else {
      if (waveformRef.current) clearInterval(waveformRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setWaveform(Array(20).fill(5));
    }
    return () => {
      if (waveformRef.current) clearInterval(waveformRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePauseResumeClick = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  // Determine what to display for the user greeting
  const getUserGreeting = () => {
    if (isAuthenticated && user?.firstName) {
      return `Bonjour, ${user.firstName}`;
    }
    return 'Bonjour, Utilisateur';
  };

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 relative overflow-hidden">
      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        {Array.from({
        length: 20
      }).map((_, i) => <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue opacity-20" initial={{
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
      }} animate={{
        x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)],
        y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)]
      }} transition={{
        duration: Math.random() * 20 + 10,
        repeat: Infinity,
        ease: "linear"
      }} />)}
      </div>
      
      {/* Header */}
      <AnimatePresence>
        {!showConfirmation}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center pt-8 sm:pt-10 md:pt-14">
        <AnimatePresence mode="wait">
          {showConfirmation ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm sm:max-w-md"
            >
              <RecordingConfirmation
                onSend={confirmSend}
                onCancel={cancelRecording}
                isProcessing={isProcessing}
              />
            </motion.div>
          ) : (
            <motion.div
              key="recorder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center w-full max-w-4xl"
            >
              {/* Titre principal avec espacement ajusté */}
              <motion.h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent px-2" initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
                Votre assistante vocal intelligente vous écoute
              </motion.h2>
              
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div
                    key="recording"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-white text-sm sm:text-lg mb-8 sm:mb-10 md:mb-12 text-center"
                  >
                    {isPaused ? 'Enregistrement en pause' : 'Enregistrement en cours...'} {formatTime(recordingTime)}
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
              
              {/* Visualisation des ondes vocales avec espacement ajusté */}
              <div className="relative mb-8 sm:mb-10 md:mb-12">
                {/* Cercles concentriques animés */}
                <AnimatePresence>
                  {isRecording && !isPaused && <>
                      <motion.div initial={{
                  scale: 0,
                  opacity: 0.7
                }} animate={{
                  scale: 1.5,
                  opacity: 0
                }} exit={{
                  scale: 0,
                  opacity: 0
                }} transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeOut"
                }} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-bright-turquoise" />
                      <motion.div initial={{
                  scale: 0,
                  opacity: 0.5
                }} animate={{
                  scale: 1.2,
                  opacity: 0
                }} exit={{
                  scale: 0,
                  opacity: 0
                }} transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeOut",
                  delay: 0.3
                }} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-electric-blue" />
                    </>}
                </AnimatePresence>
                
                {/* Visualisation des ondes autour du bouton */}
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
                
                {/* Contrôles d'enregistrement */}
                <div className="flex items-center justify-center space-x-4">
                  {/* Bouton pause/reprise (seulement visible pendant l'enregistrement) */}
                  {isRecording && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={handlePauseResumeClick}
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

                  {/* Bouton du micro principal */}
                  <motion.button
                    onClick={handleMicClick}
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
              
              {/* Carte d'information avec espacement plus grand */}
              <motion.div className="w-full max-w-xs sm:max-w-md bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-slate-700" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3,
            duration: 0.6
          }}>
                <div className="flex items-center mb-6 sm:mb-7">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue flex items-center justify-center">
                    <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="ml-3 text-base sm:text-lg font-semibold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
                    IA & automatisation
                  </h3>
                </div>
                
                <p className="text-white mb-6 sm:mb-7 text-sm sm:text-base">Dorry reçoit vos audios et :</p>
                
                <ul className="space-y-4 sm:space-y-5">
                  {["Analyse ce qui a été dit", "Détecte les informations du porteur de projet", "Identifie si la personne est en QPV", "Vous envoie directement le compte rendu dans votre boîte mail"].map((item, index) => <motion.li key={index} className="flex items-start" initial={{
                opacity: 0,
                x: -10
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: 0.4 + index * 0.1,
                duration: 0.5
              }}>
                      <span className="text-bright-turquoise mr-3 mt-1 text-sm sm:text-base">•</span>
                      <span className="text-white text-sm sm:text-base leading-relaxed">{item}</span>
                    </motion.li>)}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
