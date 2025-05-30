
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useVoiceRecordings } from '@/hooks/useVoiceRecordings';
import { RecordingConfirmation } from '@/components/ui/RecordingConfirmation';
import { ConsentModal } from '@/components/ui/ConsentModal';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { RecordingWaveform } from '@/components/recording/RecordingWaveform';
import { RecordingHistory } from '@/components/recording/RecordingHistory';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onOpenSettings: () => void;
  onOpenUpcomingFeatures: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onOpenSettings,
  onOpenUpcomingFeatures
}) => {
  const { user, isAuthenticated } = useAuth();
  const {
    isRecording,
    isPaused,
    isProcessing,
    showConfirmation,
    recordingTime,
    formatTime: formatRecordingTime,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    confirmSend,
    cancelRecording,
    showConsentModal,
    handleConsentGiven,
    handleConsentRefused,
    setRecordingConfirmedCallback
  } = useAudioRecorder();

  const {
    recordings,
    isLoading: isLoadingRecordings,
    error: recordingsError,
    saveRecording,
    updateRecordingName,
    deleteRecording,
    getRecordingBlob
  } = useVoiceRecordings();

  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(5));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveformRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Set up the callback for when recording is confirmed
  useEffect(() => {
    const handleNewRecording = async (blob: Blob, duration: number) => {
      console.log('🎵 [VOICE_RECORDER] Nouveau enregistrement reçu:', {
        duration,
        size: blob.size
      });
      try {
        const result = await saveRecording(blob, duration);
        if (result.success) {
          toast({
            title: "✅ Enregistrement sauvegardé !",
            description: "Votre enregistrement a été sauvegardé et synchronisé."
          });
        } else {
          throw new Error(result.message || 'Erreur de sauvegarde');
        }
      } catch (error) {
        console.error('❌ [VOICE_RECORDER] Erreur sauvegarde:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder l'enregistrement",
          variant: "destructive"
        });
      }
    };
    setRecordingConfirmedCallback(handleNewRecording);
  }, [setRecordingConfirmedCallback, saveRecording, toast]);

  // Display loading errors
  useEffect(() => {
    if (recordingsError) {
      toast({
        title: "Erreur de synchronisation",
        description: recordingsError,
        variant: "destructive"
      });
    }
  }, [recordingsError, toast]);

  // Simulate voice wave animation
  useEffect(() => {
    if (isRecording && !isPaused) {
      waveformRef.current = setInterval(() => {
        setWaveform(prev => prev.map(() => Math.floor(Math.random() * 30) + 5));
      }, 150);
      timerRef.current = setInterval(() => {
        // Timer is now managed by useAudioRecorder
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

  return (
    <>
      {/* GDPR consent modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onConsentGiven={handleConsentGiven}
        onConsentRefused={handleConsentRefused}
      />

      <div className="flex flex-col min-h-screen px-4 sm:px-6 relative overflow-hidden">
        {/* Background particles */}
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
        
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-10 md:pt-14">
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
                {/* Main title with adjusted spacing */}
                <motion.h2
                  className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent px-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Votre assistante vocal intelligente vous écoute
                </motion.h2>
                
                {/* Waveform visualization with adjusted spacing */}
                <RecordingWaveform
                  isRecording={isRecording}
                  isPaused={isPaused}
                  waveform={waveform}
                />

                {/* Recording controls */}
                <RecordingControls
                  isRecording={isRecording}
                  isPaused={isPaused}
                  recordingTime={recordingTime}
                  formatRecordingTime={formatRecordingTime}
                  onMicClick={handleMicClick}
                  onPauseResumeClick={handlePauseResumeClick}
                />

                {/* Recording history */}
                <RecordingHistory
                  recordings={recordings}
                  isLoading={isLoadingRecordings}
                  updateRecordingName={updateRecordingName}
                  deleteRecording={deleteRecording}
                  getRecordingBlob={getRecordingBlob}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
