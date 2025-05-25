
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const WEBHOOK_URL = 'https://n8n-4m8i.onrender.com/webhook-test/d4e8f563-b641-484a-8e40-8ef6564362f2';

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        await sendAudioToWebhook(audioBlob);
        
        // Arrêter le stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collecter les données toutes les secondes
      setIsRecording(true);
      
      toast({
        title: "Enregistrement démarré",
        description: "Votre assistant vocal intelligent vous écoute...",
      });
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Vérifiez les autorisations.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      toast({
        title: "Enregistrement terminé",
        description: "Transmission de votre message à l'intelligence automatisée...",
      });
    }
  }, [isRecording, toast]);

  const sendAudioToWebhook = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('userId', user?.id || 'unknown');
      formData.append('userEmail', user?.email || 'unknown');
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Message transmis",
          description: "Vos idées ont été automatiquement transmises à votre intelligence.",
        });
      } else {
        throw new Error('Erreur de transmission');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur de transmission",
        description: "Impossible de transmettre le message. Vérifiez votre connexion.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  };
};
