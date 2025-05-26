
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

  const WEBHOOK_URL = 'https://n8n-4m8i.onrender.com/webhook/d4e8f563-b641-484a-8e40-8ef6564362f2';

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
      console.log('🎤 Demande de permission pour le microphone...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      console.log('✅ Permission accordée, création du MediaRecorder...');
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingBlob(null);
      setShowConfirmation(false);
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (event) => {
        console.log('📊 Données audio reçues, taille:', event.data.size);
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('⏹️ Enregistrement arrêté, création du blob...');
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        console.log('📦 Blob créé, taille:', audioBlob.size, 'bytes');
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
      console.log('🔴 Enregistrement démarré');
      
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
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('⏹️ Arrêt de l\'enregistrement...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const confirmSend = useCallback(async () => {
    if (recordingBlob) {
      console.log('✅ Confirmation d\'envoi reçue');
      setShowConfirmation(false);
      setIsProcessing(true);
      await sendAudioToWebhook(recordingBlob);
    }
  }, [recordingBlob]);

  const restartRecording = useCallback(() => {
    console.log('🔄 Redémarrage de l\'enregistrement');
    setShowConfirmation(false);
    setRecordingBlob(null);
    startRecording();
  }, [startRecording]);

  const cancelRecording = useCallback(() => {
    console.log('❌ Annulation de l\'enregistrement');
    setShowConfirmation(false);
    setRecordingBlob(null);
  }, []);

  const sendAudioToWebhook = async (audioBlob: Blob) => {
    console.log('🚀 [WEBHOOK] Début de l\'envoi vers:', WEBHOOK_URL);
    console.log('📊 [WEBHOOK] Taille du fichier audio:', audioBlob.size, 'bytes');
    console.log('👤 [WEBHOOK] Utilisateur:', user?.email || 'non connecté');
    
    try {
      const formData = new FormData();
      
      // Créer un nom de fichier unique avec timestamp
      const timestamp = new Date().toISOString();
      const fileName = `recording_${user?.id || 'unknown'}_${Date.now()}.webm`;
      
      formData.append('audio', audioBlob, fileName);
      formData.append('userId', user?.id || 'unknown');
      formData.append('userEmail', user?.email || 'unknown');
      formData.append('userFirstName', user?.firstName || 'unknown');
      formData.append('userLastName', user?.lastName || 'unknown');
      formData.append('userCompany', user?.company || 'unknown');
      formData.append('timestamp', timestamp);
      formData.append('audioSize', audioBlob.size.toString());
      formData.append('audioType', audioBlob.type);

      console.log('📤 [WEBHOOK] Données à envoyer:', {
        fileName,
        audioSize: audioBlob.size,
        audioType: audioBlob.type,
        userId: user?.id,
        userEmail: user?.email,
        userFirstName: user?.firstName,
        userLastName: user?.lastName,
        userCompany: user?.company,
        timestamp
      });

      console.log('🌐 [WEBHOOK] Envoi de la requête POST...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ [WEBHOOK] Timeout atteint, annulation...');
        controller.abort();
      }, 60000); // 60 secondes

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Pas de headers personnalisés pour FormData
      });

      clearTimeout(timeoutId);

      console.log('📨 [WEBHOOK] Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        let responseData;
        const contentType = response.headers.get('content-type');
        
        try {
          if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
            console.log('📋 [WEBHOOK] Réponse JSON:', responseData);
          } else {
            responseData = await response.text();
            console.log('📄 [WEBHOOK] Réponse texte:', responseData);
          }
        } catch (parseError) {
          console.log('⚠️ [WEBHOOK] Impossible de parser la réponse:', parseError);
          responseData = 'Réponse reçue mais non parsable';
        }
        
        console.log('✅ [WEBHOOK] Envoi réussi!');
        toast({
          title: "Message transmis",
          description: "Vos idées ont été automatiquement transmises à votre intelligence.",
        });
      } else {
        console.error('❌ [WEBHOOK] Erreur HTTP:', response.status, response.statusText);
        
        // Essayer de lire le corps de la réponse d'erreur
        let errorBody;
        try {
          errorBody = await response.text();
          console.error('📄 [WEBHOOK] Corps de l\'erreur:', errorBody);
        } catch (e) {
          console.error('⚠️ [WEBHOOK] Impossible de lire le corps de l\'erreur');
        }
        
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}${errorBody ? ' - ' + errorBody : ''}`);
      }
    } catch (error) {
      console.error('💥 [WEBHOOK] Erreur détaillée lors de l\'envoi:', error);
      
      let errorMessage = "Impossible de transmettre le message.";
      
      if (error instanceof Error) {
        console.error('📝 [WEBHOOK] Message d\'erreur:', error.message);
        console.error('🔍 [WEBHOOK] Stack trace:', error.stack);
        
        if (error.name === 'AbortError') {
          errorMessage = "Timeout: La transmission a pris trop de temps.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Erreur de connexion. Vérifiez votre connexion internet.";
        } else if (error.message.includes('NetworkError')) {
          errorMessage = "Erreur réseau. Le serveur n'est peut-être pas accessible.";
        } else if (error.message.includes('ERR_NETWORK')) {
          errorMessage = "Erreur réseau. Le webhook n'est peut-être pas accessible.";
        } else {
          errorMessage = `Erreur: ${error.message}`;
        }
      }
      
      toast({
        title: "Erreur de transmission",
        description: errorMessage,
        variant: "destructive",
      });

      // Sauvegarder localement en cas d'échec
      try {
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('💾 [WEBHOOK] Audio sauvegardé localement. URL:', audioUrl);
        
        // Optionnel: télécharger automatiquement le fichier
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = `recording_backup_${Date.now()}.webm`;
        console.log('⬇️ [WEBHOOK] Lien de téléchargement créé');
        
        toast({
          title: "Sauvegarde locale",
          description: "L'enregistrement a été sauvegardé localement en cas de problème.",
        });
      } catch (saveError) {
        console.error('💥 [WEBHOOK] Impossible de sauvegarder localement:', saveError);
      }
    } finally {
      setIsProcessing(false);
      setRecordingBlob(null);
      console.log('🏁 [WEBHOOK] Processus terminé');
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
