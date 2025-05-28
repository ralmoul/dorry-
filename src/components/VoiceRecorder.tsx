
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onOpenSettings: () => void;
  onOpenUpcomingFeatures: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onOpenSettings,
  onOpenUpcomingFeatures,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(5));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveformRef = useRef<NodeJS.Timeout | null>(null);
  
  // Simule l'animation des ondes vocales
  useEffect(() => {
    if (isRecording) {
      waveformRef.current = setInterval(() => {
        setWaveform(prev => 
          prev.map(() => Math.floor(Math.random() * 30) + 5)
        );
      }, 150);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
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
  }, [isRecording]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue opacity-20"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) 
            }}
            animate={{ 
              x: [
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
              ],
              y: [
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), 
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              ] 
            }}
            transition={{ 
              duration: Math.random() * 20 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8 z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Dorry
          </h1>
          <span className="ml-4 text-gray-300">Bonjour, thomas</span>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenUpcomingFeatures}
            className="text-gray-300 hover:text-white"
          >
            <span className="text-xl">✨</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className="text-gray-300 hover:text-white"
          >
            <span className="text-xl">⚙️</span>
          </motion.button>
        </div>
      </div>
      
      {/* Titre principal avec animation */}
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Votre assistante vocal intelligente vous écoute
      </motion.h2>
      
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div 
            key="recording"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-white text-xl mb-8"
          >
            Enregistrement en cours... {formatTime(recordingTime)}
          </motion.div>
        ) : (
          <motion.div 
            key="instruction"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-gray-300 text-xl mb-8"
          >
            Appuyer sur le micro pour commencer
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Visualisation des ondes vocales */}
      <div className="relative mb-8">
        {/* Cercles concentriques animés */}
        <AnimatePresence>
          {isRecording && (
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
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-bright-turquoise"
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
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-electric-blue"
              />
            </>
          )}
        </AnimatePresence>
        
        {/* Visualisation des ondes autour du bouton */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center">
          <div className="flex items-center justify-center w-full h-full">
            {waveform.map((height, index) => (
              <motion.div
                key={index}
                className="w-1 mx-0.5 rounded-full bg-gradient-to-t from-bright-turquoise to-electric-blue"
                style={{ 
                  height: `${height}px`,
                  opacity: isRecording ? 0.8 : 0.3
                }}
                animate={{ 
                  height: `${height}px`,
                  opacity: isRecording ? 0.8 : 0.3
                }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>
        </div>
        
        {/* Bouton du micro */}
        <motion.button
          onClick={handleMicClick}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center focus:outline-none ${
            isRecording 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : 'bg-gradient-to-r from-bright-turquoise to-electric-blue'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: isRecording 
              ? ['0 0 0 0 rgba(239, 68, 68, 0)', '0 0 0 15px rgba(239, 68, 68, 0.3)', '0 0 0 0 rgba(239, 68, 68, 0)'] 
              : ['0 0 0 0 rgba(0, 184, 212, 0)', '0 0 0 10px rgba(0, 184, 212, 0.3)', '0 0 0 0 rgba(0, 184, 212, 0)']
          }}
          transition={{ 
            boxShadow: { 
              repeat: Infinity, 
              duration: 1.5 
            }
          }}
        >
          <motion.span 
            className="text-white text-2xl"
            animate={{ 
              scale: isRecording ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              scale: { 
                repeat: isRecording ? Infinity : 0, 
                duration: 1 
              }
            }}
          >
            🎤
          </motion.span>
        </motion.button>
      </div>
      
      {/* Carte d'information */}
      <motion.div 
        className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue flex items-center justify-center">
            <span className="text-white text-lg">⚡</span>
          </div>
          <h3 className="ml-3 text-xl font-semibold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            IA & automatisation
          </h3>
        </div>
        
        <p className="text-gray-300 mb-4">Dorry reçoit vos audios et :</p>
        
        <ul className="space-y-3">
          {[
            "Analyse ce qui a été dit",
            "Détecte les informations du porteur de projet",
            "Identifie si la personne est en QPV",
            "Vous envoie directement le compte rendu dans votre boîte mail"
          ].map((item, index) => (
            <motion.li 
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            >
              <span className="text-bright-turquoise mr-2">•</span>
              <span className="text-gray-200">{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
