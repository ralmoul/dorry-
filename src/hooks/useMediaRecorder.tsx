
import { useState, useRef, useCallback } from 'react';

export const useMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
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
      
      // Arrêter le stream
      stream.getTracks().forEach(track => track.stop());
    };

    // Enregistrement continu sans limite de temps
    mediaRecorder.start();
    setIsRecording(true);
    console.log('🔴 Enregistrement démarré');
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('⏹️ Arrêt de l\'enregistrement...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setRecordingBlob(null);
  }, []);

  return {
    isRecording,
    recordingBlob,
    startRecording,
    stopRecording,
    clearRecording
  };
};
