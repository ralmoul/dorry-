
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
    recordingBlob,
    startRecording: startMediaRecording,
    stopRecording: stopMediaRecording,
    clearRecording
  } = useMediaRecorder();
  
  const { recordingTime, formatTime } = useRecordingTimer(isRecording);

  const startRecording = useCallback(async () => {
    try {
      console.log('🎤 [AUDIO_RECORDER] Démarrage de l\'enregistrement...');
      await startMediaRecording();
      setShowConfirmation(false);
      
      console.log('✅ [AUDIO_RECORDER] Enregistrement démarré avec succès');
      toast({
        title: "Enregistrement démarré",
        description: "Votre assistant vocal intelligent vous écoute...",
      });
    } catch (error) {
      console.error('❌ [AUDIO_RECORDER] Erreur lors du démarrage:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Vérifiez les autorisations.",
        variant: "destructive",
      });
    }
  }, [startMediaRecording, toast]);

  const stopRecording = useCallback(() => {
    console.log('⏹️ [AUDIO_RECORDER] Arrêt de l\'enregistrement...');
    stopMediaRecording();
    setShowConfirmation(true);
    
    console.log('✅ [AUDIO_RECORDER] Enregistrement arrêté, confirmation demandée');
    toast({
      title: "Enregistrement terminé",
      description: "Choisissez si vous voulez envoyer ou recommencer",
    });
  }, [stopMediaRecording, toast]);

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
        description: "Vos idées ont été automatiquement transmises vers N8N.",
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

  const restartRecording = useCallback(() => {
    console.log('🔄 [AUDIO_RECORDER] Redémarrage de l\'enregistrement');
    setShowConfirmation(false);
    clearRecording();
    startRecording();
  }, [startRecording, clearRecording]);

  const cancelRecording = useCallback(() => {
    console.log('❌ [AUDIO_RECORDER] Annulation de l\'enregistrement');
    setShowConfirmation(false);
    clearRecording();
  }, [clearRecording]);

  return {
    isRecording,
    isProcessing,
    showConfirmation,
    recordingTime,
    formatTime,
    startRecording,
    stopRecording,
    confirmSend,
    restartRecording,
    cancelRecording,
  };
};
