import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const WEBHOOK_URL = 'https://n8n-4m8i.onrender.com/webhook-test/d4e8f563-b641-484a-8e40-8ef6564362f2';

  // Timer effect for recording time
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      setRecordingBlob(null);
      setShowConfirmation(false);
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setRecordingBlob(audioBlob);
        setShowConfirmation(true);
        
        // Arrêter le stream
        stream.getTracks().forEach(track => track.stop());
        
        toast({
          title: "Enregistrement terminé",
          description: "Choisissez si vous voulez envoyer ou recommencer",
        });
      };

      // Enregistrement continu sans limite de temps
      mediaRecorder.start();
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
    }
  }, [isRecording]);

  const confirmSend = useCallback(async () => {
    if (recordingBlob) {
      setShowConfirmation(false);
      setIsProcessing(true);
      await sendAudioToWebhook(recordingBlob);
    }
  }, [recordingBlob]);

  const restartRecording = useCallback(() => {
    setShowConfirmation(false);
    setRecordingBlob(null);
    startRecording();
  }, [startRecording]);

  const cancelRecording = useCallback(() => {
    setShowConfirmation(false);
    setRecordingBlob(null);
  }, []);

  const sendAudioToWebhook = async (audioBlob: Blob) => {
    console.log('Début de l\'envoi vers le webhook:', WEBHOOK_URL);
    console.log('Taille du fichier audio:', audioBlob.size, 'bytes');
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('userId', user?.id || 'unknown');
      formData.append('userEmail', user?.email || 'unknown');
      formData.append('timestamp', new Date().toISOString());

      console.log('Données à envoyer:', {
        audioSize: audioBlob.size,
        userId: user?.id,
        userEmail: user?.email,
        timestamp: new Date().toISOString()
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 secondes pour les longs enregistrements

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          // Pas de Content-Type pour FormData, le navigateur le définit automatiquement
        }
      });

      clearTimeout(timeoutId);

      console.log('Réponse du webhook:', response.status, response.statusText);

      if (response.ok) {
        const responseText = await response.text();
        console.log('Réponse du serveur:', responseText);
        
        toast({
          title: "Message transmis",
          description: "Vos idées ont été automatiquement transmises à votre intelligence.",
        });
      } else {
        console.error('Erreur HTTP:', response.status, response.statusText);
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur détaillée lors de l\'envoi:', error);
      
      let errorMessage = "Impossible de transmettre le message.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Timeout: La transmission a pris trop de temps.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Erreur de connexion. Vérifiez votre connexion internet ou réessayez plus tard.";
        } else if (error.message.includes('NetworkError')) {
          errorMessage = "Erreur réseau. Le serveur n'est peut-être pas accessible.";
        } else {
          errorMessage = `Erreur: ${error.message}`;
        }
      }
      
      toast({
        title: "Erreur de transmission",
        description: errorMessage,
        variant: "destructive",
      });

      try {
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Audio sauvegardé localement. URL:', audioUrl);
        toast({
          title: "Sauvegarde locale",
          description: "L'enregistrement a été sauvegardé localement.",
        });
      } catch (saveError) {
        console.error('Impossible de sauvegarder localement:', saveError);
      }
    } finally {
      setIsProcessing(false);
      setRecordingBlob(null);
    }
  };

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
