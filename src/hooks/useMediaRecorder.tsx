
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
    
    // Essayer MP4 en premier, puis fallback vers webm
    let mimeType = 'audio/mp4';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'audio/webm;codecs=opus';
      console.log('⚠️ MP4 non supporté, utilisation de WebM');
    } else {
      console.log('✅ Utilisation du format MP4');
    }
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: mimeType
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
      setRecordingBlob(audioBlob);
      
      // Arrêter le stream
      stream.getTracks().forEach(track => track.stop());
    };

    // Enregistrement continu sans limite de temps
    mediaRecorder.start();
    setIsRecording(true);
    console.log('🔴 Enregistrement démarré avec le format:', mimeType);
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
