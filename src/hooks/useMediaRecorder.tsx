import { useState, useRef, useCallback } from 'react';

export const useMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    console.log('🎤 Demande de permission pour le microphone...');
    
    // Détection mobile/desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('📱 Appareil détecté:', isMobile ? 'Mobile' : 'Desktop');
    
    // Configuration audio spécifique mobile vs desktop
    const audioConstraints = isMobile ? {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
        channelCount: 1,
        volume: 1.0
      }
    } : {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: { ideal: 48000, min: 16000 },
        channelCount: { ideal: 2, min: 1 }
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      streamRef.current = stream;
      console.log('✅ Stream audio obtenu:', {
        tracks: stream.getAudioTracks().length,
        settings: stream.getAudioTracks()[0]?.getSettings()
      });
      
      // Force l'utilisation du format audio/ogg avec codec opus
      const preferredFormat = 'audio/ogg;codecs=opus';
      let selectedFormat = '';
      
      if (MediaRecorder.isTypeSupported(preferredFormat)) {
        selectedFormat = preferredFormat;
        console.log(`✅ Format préféré sélectionné: ${preferredFormat}`);
      } else {
        // Fallback vers d'autres formats ogg/opus si disponibles
        const fallbackFormats = [
          'audio/ogg',
          'audio/webm;codecs=opus',
          'audio/webm'
        ];
        
        for (const format of fallbackFormats) {
          if (MediaRecorder.isTypeSupported(format)) {
            selectedFormat = format;
            console.log(`⚠️ Format de fallback sélectionné: ${format}`);
            break;
          }
        }
      }

      if (!selectedFormat) {
        console.warn('⚠️ Aucun format supporté, utilisation par défaut');
        selectedFormat = ''; // Laisser le navigateur choisir
      }

      // Configuration MediaRecorder optimisée pour ogg/opus
      const recorderOptions: MediaRecorderOptions = {};
      if (selectedFormat) {
        recorderOptions.mimeType = selectedFormat;
      }
      
      // Bitrate optimisé pour opus
      recorderOptions.audioBitsPerSecond = 64000; // Optimal pour opus

      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingBlob(null);

      mediaRecorder.ondataavailable = (event) => {
        console.log('📊 Chunk reçu:', {
          size: event.data.size,
          type: event.data.type,
          timestamp: Date.now()
        });
        
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        } else {
          console.warn('⚠️ Chunk vide reçu');
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('⏹️ Enregistrement arrêté, assemblage des chunks...');
        console.log('📦 Nombre de chunks:', chunksRef.current.length);
        
        if (chunksRef.current.length === 0) {
          console.error('❌ Aucun chunk audio disponible');
          setRecordingBlob(null);
          return;
        }

        const totalSize = chunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
        console.log('📊 Taille totale des chunks:', totalSize, 'bytes');

        // Force l'utilisation du format ogg/opus
        const finalMimeType = preferredFormat;
        const audioBlob = new Blob(chunksRef.current, { type: finalMimeType });
        
        console.log('📦 Blob final créé avec format forcé:', {
          size: audioBlob.size,
          type: audioBlob.type,
          chunks: chunksRef.current.length,
          forcedFormat: finalMimeType
        });
        
        if (audioBlob.size === 0) {
          console.error('❌ Blob audio final vide');
        } else {
          console.log('✅ Blob audio valide créé en format ogg/opus');
        }
        
        setRecordingBlob(audioBlob);
        
        // Nettoyage du stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
            console.log('🔇 Track arrêté:', track.kind, track.label);
          });
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ Erreur MediaRecorder:', event);
        const errorEvent = event as ErrorEvent;
        console.error('❌ Détails de l\'erreur:', {
          error: errorEvent.error,
          message: errorEvent.message,
          type: event.type,
          target: event.target
        });
      };

      mediaRecorder.onstart = () => {
        console.log('🔴 Enregistrement démarré en format ogg/opus');
      };

      // Intervalle adaptatif selon l'appareil
      const chunkInterval = isMobile ? 500 : 1000; // Chunks plus fréquents sur mobile
      console.log(`⏱️ Démarrage avec intervalle de ${chunkInterval}ms`);
      
      mediaRecorder.start(chunkInterval);
      setIsRecording(true);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'accès au microphone:', error);
      const err = error as Error;
      console.error('❌ Détails de l\'erreur:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      // Nettoyage en cas d'erreur
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      throw error;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('⏹️ Demande d\'arrêt de l\'enregistrement...');
      console.log('📊 État MediaRecorder:', mediaRecorderRef.current.state);
      
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          console.log('✅ Arrêt demandé');
        } else {
          console.warn('⚠️ MediaRecorder pas en cours d\'enregistrement:', mediaRecorderRef.current.state);
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'arrêt:', error);
        setIsRecording(false);
      }
    } else {
      console.warn('⚠️ Pas d\'enregistrement en cours à arrêter');
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setRecordingBlob(null);
    chunksRef.current = [];
    
    // Nettoyage complet
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    
    console.log('🗑️ Enregistrement et ressources nettoyés');
  }, []);

  return {
    isRecording,
    recordingBlob,
    startRecording,
    stopRecording,
    clearRecording
  };
};
