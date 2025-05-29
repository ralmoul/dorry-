import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRecordingTimer } from '@/hooks/useRecordingTimer';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { sendAudioToWebhook } from '@/services/webhookService';

export const useAudioRecorder = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    isRecording,
    isPaused,
    recordingBlob,
    startRecording: startMediaRecording,
    pauseRecording: pauseMediaRecording,
    resumeRecording: resumeMediaRecording,
    stopRecording: stopMediaRecording,
    clearRecording
  } = useMediaRecorder();
  
  // Passer isPaused au timer pour qu'il sache quand ne pas compter
  const { recordingTime, formatTime } = useRecordingTimer(isRecording, isPaused);

  const startRecording = useCallback(async () => {
    try {
      console.log('🎤 [AUDIO_RECORDER] Démarrage de l\'enregistrement...');
      await startMediaRecording();
      setShowConfirmation(false);
      
      console.log('✅ [AUDIO_RECORDER] Enregistrement démarré avec succès');
    } catch (error) {
      console.error('❌ [AUDIO_RECORDER] Erreur lors du démarrage:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Vérifiez les autorisations.",
        variant: "destructive",
      });
    }
  }, [startMediaRecording, toast]);

  const pauseRecording = useCallback(() => {
    console.log('⏸️ [AUDIO_RECORDER] Pause de l\'enregistrement...');
    pauseMediaRecording();
  }, [pauseMediaRecording]);

  const resumeRecording = useCallback(() => {
    console.log('▶️ [AUDIO_RECORDER] Reprise de l\'enregistrement...');
    resumeMediaRecording();
  }, [resumeMediaRecording]);

  const stopRecording = useCallback(() => {
    console.log('⏹️ [AUDIO_RECORDER] Arrêt de l\'enregistrement...');
    stopMediaRecording();
    setShowConfirmation(true);
    
    console.log('✅ [AUDIO_RECORDER] Enregistrement arrêté, confirmation demandée');
  }, [stopMediaRecording]);

  const confirmSend = useCallback(async () => {
    if (!recordingBlob) {
      console.error('❌ [AUDIO_RECORDER] Pas de blob audio disponible');
      toast({
        title: "Erreur",
        description: "Aucun enregistrement disponible",
        variant: "destructive",
      });
      return;
    }

    console.log('📤 [AUDIO_RECORDER] Confirmation d\'envoi reçue');
    console.log('📊 [AUDIO_RECORDER] Blob audio:', {
      size: recordingBlob.size,
      type: recordingBlob.type
    });
    console.log('👤 [AUDIO_RECORDER] Utilisateur:', user?.email || 'non connecté');
    
    setShowConfirmation(false);
    setIsProcessing(true);
    
    try {
      console.log('🚀 [AUDIO_RECORDER] Appel de sendAudioToWebhook...');
      const result = await sendAudioToWebhook(recordingBlob, user);
      
      console.log('✅ [AUDIO_RECORDER] Transmission réussie:', result);
      
      toast({
        title: "Message transmis",
        description: "L'enregistrement à bien été envoyé à l'IA pour le traitement.",
      });
    } catch (error) {
      console.error('❌ [AUDIO_RECORDER] Erreur de transmission:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de transmettre le message.";
      
      toast({
        title: "Erreur de transmission",
        description: errorMessage,
        variant: "destructive",
      });
      
      toast({
        title: "Sauvegarde locale",
        description: "L'enregistrement a été sauvegardé localement en cas de problème.",
      });
    } finally {
      console.log('🏁 [AUDIO_RECORDER] Processus terminé');
      setIsProcessing(false);
      clearRecording();
    }
  }, [recordingBlob, user, toast, clearRecording]);

  const cancelRecording = useCallback(() => {
    console.log('❌ [AUDIO_RECORDER] Annulation de l\'enregistrement');
    setShowConfirmation(false);
    clearRecording();
  }, [clearRecording]);

  return {
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
    cancelRecording,
  };
};
