
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRecordingTimer } from '@/hooks/useRecordingTimer';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { useConsentManager } from '@/hooks/useConsentManager';
import { sendAudioToWebhook } from '@/services/webhookService';

export const useAudioRecorder = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [onRecordingConfirmed, setOnRecordingConfirmed] = useState<((blob: Blob, duration: number) => void) | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    showConsentModal,
    requestConsent,
    giveConsent,
    refuseConsent
  } = useConsentManager();
  
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
  
  const { recordingTime, formatTime } = useRecordingTimer(isRecording, isPaused);

  const setRecordingConfirmedCallback = useCallback((callback: (blob: Blob, duration: number) => void) => {
    setOnRecordingConfirmed(() => callback);
  }, []);

  const startRecording = useCallback(async () => {
    console.log('🎤 [AUDIO_RECORDER] Tentative de démarrage de l\'enregistrement...');
    
    // Toujours demander le consentement avant d'enregistrer
    console.log('🔒 [AUDIO_RECORDER] Demande du consentement...');
    requestConsent();
  }, [requestConsent]);

  const handleConsentGiven = useCallback(async () => {
    console.log('🎉 [AUDIO_RECORDER] Consentement reçu, démarrage automatique...');
    giveConsent();
    
    try {
      console.log('✅ [AUDIO_RECORDER] Démarrage de l\'enregistrement...');
      await startMediaRecording();
      setShowConfirmation(false);
      
      console.log('✅ [AUDIO_RECORDER] Enregistrement démarré avec succès');
      
      toast({
        title: "Enregistrement démarré",
        description: "Votre message vocal est en cours d'enregistrement.",
      });
    } catch (error) {
      console.error('❌ [AUDIO_RECORDER] Erreur lors du démarrage:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Vérifiez les autorisations.",
        variant: "destructive",
      });
    }
  }, [giveConsent, startMediaRecording, toast]);

  const handleConsentRefused = useCallback(() => {
    console.log('❌ [AUDIO_RECORDER] Consentement refusé');
    refuseConsent();
    
    toast({
      title: "Consentement refusé",
      description: "L'enregistrement vocal ne sera pas disponible.",
      variant: "destructive",
    });
  }, [refuseConsent, toast]);

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

    // IMPORTANT: Ajouter à l'historique AVANT l'envoi pour que ça apparaisse immédiatement
    if (onRecordingConfirmed) {
      console.log('💾 [AUDIO_RECORDER] Ajout à l\'historique AVANT envoi...');
      onRecordingConfirmed(recordingBlob, recordingTime);
    }
    
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
  }, [recordingBlob, user, toast, clearRecording, onRecordingConfirmed, recordingTime]);

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
    setRecordingConfirmedCallback,
    // Consent management
    showConsentModal,
    handleConsentGiven,
    handleConsentRefused
  };
};
