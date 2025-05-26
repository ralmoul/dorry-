
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
      await startMediaRecording();
      setShowConfirmation(false);
      
      toast({
        title: "Enregistrement démarré",
        description: "Votre assistant vocal intelligent vous écoute...",
      });
    } catch (error) {
      console.error('❌ Erreur lors du démarrage de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Vérifiez les autorisations.",
        variant: "destructive",
      });
    }
  }, [startMediaRecording, toast]);

  const stopRecording = useCallback(() => {
    stopMediaRecording();
    setShowConfirmation(true);
    
    toast({
      title: "Enregistrement terminé",
      description: "Choisissez si vous voulez envoyer ou recommencer",
    });
  }, [stopMediaRecording, toast]);

  const confirmSend = useCallback(async () => {
    if (recordingBlob) {
      console.log('✅ Confirmation d\'envoi reçue');
      setShowConfirmation(false);
      setIsProcessing(true);
      
      try {
        await sendAudioToWebhook(recordingBlob, user);
        toast({
          title: "Message transmis",
          description: "Vos idées ont été automatiquement transmises à votre intelligence.",
        });
      } catch (error) {
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
        setIsProcessing(false);
        clearRecording();
      }
    }
  }, [recordingBlob, user, toast, clearRecording]);

  const restartRecording = useCallback(() => {
    console.log('🔄 Redémarrage de l\'enregistrement');
    setShowConfirmation(false);
    clearRecording();
    startRecording();
  }, [startRecording, clearRecording]);

  const cancelRecording = useCallback(() => {
    console.log('❌ Annulation de l\'enregistrement');
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
