
import { useState, useRef, useCallback } from 'react';
import { detectDevice } from '@/utils/deviceDetection';
import { getAudioConstraints } from '@/utils/audioConstraints';
import { getSupportedAudioFormat, getRecorderOptions, getChunkInterval } from '@/utils/audioFormats';
import { createAudioBlob } from '@/utils/audioBlobProcessor';

export const useMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    console.log('🎤 Demande de permission pour le microphone...');
    
    const deviceInfo = detectDevice();
    console.log('📱 Détection appareil:', {
      ...deviceInfo,
      userAgent: navigator.userAgent,
      touchPoints: navigator.maxTouchPoints,
      windowWidth: window.innerWidth
    });
    
    const audioConstraints = getAudioConstraints(deviceInfo);
    console.log(`${deviceInfo.isIOS ? '🍎' : deviceInfo.isAndroid ? '🤖' : deviceInfo.isMobile ? '📱' : '💻'} Configuration ${deviceInfo.platform} appliquée`);

    try {
      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      streamRef.current = stream;
      console.log('✅ Stream audio obtenu:', {
        tracks: stream.getAudioTracks().length,
        settings: stream.getAudioTracks()[0]?.getSettings(),
        capabilities: stream.getAudioTracks()[0]?.getCapabilities()
      });
      
      const audioFormat = getSupportedAudioFormat(deviceInfo);
      const recorderOptions = getRecorderOptions(audioFormat, deviceInfo.isMobile, deviceInfo.isIOS);
      
      console.log('🎛️ Options MediaRecorder:', recorderOptions);

      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingBlob(null);
      setIsPaused(false);

      mediaRecorder.ondataavailable = (event) => {
        console.log('📊 Chunk reçu:', {
          size: event.data.size,
          type: event.data.type,
          timestamp: Date.now(),
          platform: deviceInfo.platform
        });
        
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log('✅ Chunk ajouté, total:', chunksRef.current.length);
        } else {
          console.warn('⚠️ Chunk vide reçu');
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = createAudioBlob(chunksRef.current, audioFormat.mimeType, deviceInfo);
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
          target: event.target,
          platform: deviceInfo.platform
        });
      };

      mediaRecorder.onstart = () => {
        console.log('🔴 Enregistrement démarré:', {
          format: audioFormat.mimeType || 'défaut',
          platform: deviceInfo.platform,
          state: mediaRecorder.state
        });
      };

      mediaRecorder.onpause = () => {
        console.log('⏸️ Enregistrement en pause');
        setIsPaused(true);
      };

      mediaRecorder.onresume = () => {
        console.log('▶️ Enregistrement repris');
        setIsPaused(false);
      };

      const chunkInterval = getChunkInterval(deviceInfo);
      console.log(`⏱️ Démarrage avec intervalle de ${chunkInterval}ms pour ${deviceInfo.platform}`);
      
      mediaRecorder.start(chunkInterval);
      setIsRecording(true);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'accès au microphone:', error);
      const err = error as Error;
      console.error('❌ Détails de l\'erreur:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        platform: deviceInfo.platform
      });
      
      // Nettoyage en cas d'erreur
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      throw error;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      console.log('⏸️ Mise en pause de l\'enregistrement...');
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.pause();
          console.log('✅ Enregistrement mis en pause');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la pause:', error);
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      console.log('▶️ Reprise de l\'enregistrement...');
      try {
        if (mediaRecorderRef.current.state === 'paused') {
          mediaRecorderRef.current.resume();
          console.log('✅ Enregistrement repris');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la reprise:', error);
      }
    }
  }, [isRecording, isPaused]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('⏹️ Demande d\'arrêt de l\'enregistrement...');
      console.log('📊 État MediaRecorder:', mediaRecorderRef.current.state);
      
      try {
        if (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          setIsPaused(false);
          console.log('✅ Arrêt demandé');
        } else {
          console.warn('⚠️ MediaRecorder pas en cours d\'enregistrement:', mediaRecorderRef.current.state);
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'arrêt:', error);
        setIsRecording(false);
        setIsPaused(false);
      }
    } else {
      console.warn('⚠️ Pas d\'enregistrement en cours à arrêter');
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setRecordingBlob(null);
    chunksRef.current = [];
    setIsPaused(false);
    
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
    isPaused,
    recordingBlob,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    clearRecording
  };
};
