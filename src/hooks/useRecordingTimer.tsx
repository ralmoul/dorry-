
import { useState, useRef, useEffect } from 'react';

export const useRecordingTimer = (isRecording: boolean, isPaused: boolean = false) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      // Continuer le timer seulement si on enregistre ET qu'on n'est pas en pause
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      // Arrêter le timer si on est en pause, mais ne pas remettre à zéro
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset seulement si on n'est plus en train d'enregistrer du tout
    if (!isRecording) {
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { recordingTime, formatTime };
};
