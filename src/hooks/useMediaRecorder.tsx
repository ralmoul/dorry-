
import { useState, useRef, useCallback } from 'react';

export const useMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    console.log('🎤 Demande de permission pour le microphone...');
    
    // Détection mobile améliorée
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0) ||
                     window.innerWidth <= 768;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    console.log('📱 Détection appareil:', {
      isMobile,
      isIOS,
      isAndroid,
      userAgent: navigator.userAgent,
      touchPoints: navigator.maxTouchPoints,
      windowWidth: window.innerWidth
    });
    
    // Configuration audio optimisée par plateforme
    let audioConstraints;
    
    if (isIOS) {
      // Configuration spéciale pour iOS (Safari a des limitations)
      audioConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 22050, // Réduction pour iOS
          channelCount: 1,
          volume: 1.0
        }
      };
      console.log('🍎 Configuration iOS appliquée');
    } else if (isAndroid) {
      // Configuration pour Android
      audioConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
          volume: 1.0
        }
      };
      console.log('🤖 Configuration Android appliquée');
    } else if (isMobile) {
      // Autres mobiles
      audioConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 22050,
          channelCount: 1
        }
      };
      console.log('📱 Configuration mobile générique appliquée');
    } else {
      // Desktop
      audioConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 48000, min: 16000 },
          channelCount: { ideal: 2, min: 1 }
        }
      };
      console.log('💻 Configuration desktop appliquée');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      streamRef.current = stream;
      console.log('✅ Stream audio obtenu:', {
        tracks: stream.getAudioTracks().length,
        settings: stream.getAudioTracks()[0]?.getSettings(),
        capabilities: stream.getAudioTracks()[0]?.getCapabilities()
      });
      
      // Sélection intelligente du format selon la plateforme
      let selectedFormat = '';
      let selectedMimeType = '';
      
      // Formats par ordre de préférence selon la plateforme
      const formatsByPlatform = {
        ios: [
          'audio/mp4',
          'audio/aac',
          'audio/wav',
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus',
          'audio/ogg'
        ],
        android: [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus',
          'audio/ogg',
          'audio/mp4',
          'audio/wav'
        ],
        desktop: [
          'audio/ogg;codecs=opus',
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg',
          'audio/mp4',
          'audio/wav'
        ]
      };

      let formats;
      if (isIOS) {
        formats = formatsByPlatform.ios;
        console.log('🍎 Utilisation des formats iOS');
      } else if (isAndroid) {
        formats = formatsByPlatform.android;
        console.log('🤖 Utilisation des formats Android');
      } else {
        formats = formatsByPlatform.desktop;
        console.log('💻 Utilisation des formats desktop');
      }

      // Test de compatibilité des formats
      for (const format of formats) {
        if (MediaRecorder.isTypeSupported(format)) {
          selectedFormat = format;
          selectedMimeType = format;
          console.log(`✅ Format sélectionné: ${format}`);
          break;
        } else {
          console.log(`❌ Format non supporté: ${format}`);
        }
      }

      if (!selectedFormat) {
        console.warn('⚠️ Aucun format préféré supporté, utilisation par défaut');
        selectedFormat = '';
        selectedMimeType = 'audio/webm'; // Fallback générique
      }

      // Configuration MediaRecorder adaptative
      const recorderOptions: MediaRecorderOptions = {};
      if (selectedFormat) {
        recorderOptions.mimeType = selectedFormat;
      }
      
      // Bitrate adaptatif selon la plateforme
      if (isMobile) {
        recorderOptions.audioBitsPerSecond = isIOS ? 32000 : 48000; // Plus bas pour iOS
      } else {
        recorderOptions.audioBitsPerSecond = 64000;
      }

      console.log('🎛️ Options MediaRecorder:', recorderOptions);

      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingBlob(null);

      mediaRecorder.ondataavailable = (event) => {
        console.log('📊 Chunk reçu:', {
          size: event.data.size,
          type: event.data.type,
          timestamp: Date.now(),
          platform: isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop'
        });
        
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log('✅ Chunk ajouté, total:', chunksRef.current.length);
        } else {
          console.warn('⚠️ Chunk vide reçu');
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('⏹️ Enregistrement arrêté, assemblage des chunks...');
        console.log('📦 Nombre de chunks:', chunksRef.current.length);
        console.log('📊 Détails des chunks:', chunksRef.current.map((chunk, i) => ({
          index: i,
          size: chunk.size,
          type: chunk.type
        })));
        
        if (chunksRef.current.length === 0) {
          console.error('❌ Aucun chunk audio disponible');
          setRecordingBlob(null);
          return;
        }

        const totalSize = chunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
        console.log('📊 Taille totale des chunks:', totalSize, 'bytes');

        if (totalSize === 0) {
          console.error('❌ Taille totale nulle malgré la présence de chunks');
          setRecordingBlob(null);
          return;
        }

        // Créer le blob avec le bon type MIME selon la plateforme
        let finalMimeType;
        if (selectedMimeType) {
          finalMimeType = selectedMimeType;
        } else if (chunksRef.current[0]?.type) {
          finalMimeType = chunksRef.current[0].type;
        } else {
          // Fallback selon la plateforme
          finalMimeType = isIOS ? 'audio/mp4' : 'audio/webm';
        }
        
        console.log('🎯 Type MIME final sélectionné:', finalMimeType);
        
        const audioBlob = new Blob(chunksRef.current, { type: finalMimeType });
        
        console.log('📦 Blob final créé:', {
          size: audioBlob.size,
          type: audioBlob.type,
          chunks: chunksRef.current.length,
          platform: isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop',
          originalFormat: selectedFormat,
          finalMimeType
        });
        
        if (audioBlob.size === 0) {
          console.error('❌ Blob audio final vide');
          setRecordingBlob(null);
        } else {
          console.log('✅ Blob audio valide créé');
          setRecordingBlob(audioBlob);
        }
        
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
          target: event.target,
          platform: isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop'
        });
      };

      mediaRecorder.onstart = () => {
        console.log('🔴 Enregistrement démarré:', {
          format: selectedFormat || 'défaut',
          platform: isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop',
          state: mediaRecorder.state
        });
      };

      // Intervalle adaptatif selon la plateforme et les capacités
      let chunkInterval;
      if (isIOS) {
        chunkInterval = 1000; // Plus long pour iOS (stabilité)
      } else if (isAndroid) {
        chunkInterval = 750; // Moyen pour Android
      } else if (isMobile) {
        chunkInterval = 800; // Sécuritaire pour autres mobiles
      } else {
        chunkInterval = 1000; // Standard pour desktop
      }
      
      console.log(`⏱️ Démarrage avec intervalle de ${chunkInterval}ms pour`, {
        platform: isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop'
      });
      
      mediaRecorder.start(chunkInterval);
      setIsRecording(true);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'accès au microphone:', error);
      const err = error as Error;
      console.error('❌ Détails de l\'erreur:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        platform: isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop'
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
