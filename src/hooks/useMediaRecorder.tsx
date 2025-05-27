
import { useState, useRef, useCallback } from 'react';

export const useMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    console.log('🎤 Demande de permission pour le microphone...');
    
    // Configuration audio optimisée pour mobile et desktop
    const audioConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        // Paramètres compatibles mobile/desktop
        sampleRate: { ideal: 44100, min: 16000 },
        channelCount: { ideal: 1 },
        // Ajout de contraintes pour mobile
        latency: { ideal: 0.01 },
        volume: { ideal: 1.0 }
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      console.log('✅ Permission accordée, création du MediaRecorder...');
      
      // Détection du format supporté avec priorité pour la compatibilité
      let mimeType = '';
      const formats = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];

      for (const format of formats) {
        if (MediaRecorder.isTypeSupported(format)) {
          mimeType = format;
          console.log(`✅ Format supporté: ${format}`);
          break;
        }
      }

      if (!mimeType) {
        console.warn('⚠️ Aucun format audio supporté détecté, utilisation du format par défaut');
        mimeType = 'audio/webm'; // Fallback
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        // Configuration pour améliorer la qualité sur mobile
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingBlob(null);

      mediaRecorder.ondataavailable = (event) => {
        console.log('📊 Données audio reçues, taille:', event.data.size);
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('⏹️ Enregistrement arrêté, création du blob...');
        const finalMimeType = mediaRecorderRef.current?.mimeType || mimeType;
        const audioBlob = new Blob(chunksRef.current, { type: finalMimeType });
        console.log('📦 Blob créé, taille:', audioBlob.size, 'bytes, type:', finalMimeType);
        
        // Vérification de la taille du blob
        if (audioBlob.size === 0) {
          console.error('❌ Blob audio vide détecté');
        } else {
          console.log('✅ Blob audio valide créé');
        }
        
        setRecordingBlob(audioBlob);
        
        // Arrêter le stream
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('🔇 Track audio arrêté:', track.kind);
        });
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ Erreur MediaRecorder:', event);
      };

      // Démarrage avec intervalle pour mobile
      // Sur mobile, il est recommandé d'utiliser des intervalles pour éviter les pertes de données
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        console.log('📱 Appareil mobile détecté, utilisation d\'intervalles courts');
        mediaRecorder.start(1000); // Chunks de 1 seconde pour mobile
      } else {
        console.log('💻 Appareil desktop détecté, enregistrement continu');
        mediaRecorder.start(); // Enregistrement continu pour desktop
      }
      
      setIsRecording(true);
      console.log('🔴 Enregistrement démarré avec le format:', mimeType);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'accès au microphone:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('⏹️ Arrêt de l\'enregistrement...');
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } catch (error) {
        console.error('❌ Erreur lors de l\'arrêt:', error);
      }
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setRecordingBlob(null);
    console.log('🗑️ Enregistrement effacé');
  }, []);

  return {
    isRecording,
    recordingBlob,
    startRecording,
    stopRecording,
    clearRecording
  };
};
