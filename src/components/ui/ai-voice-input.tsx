"use client";

import { Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number, audioBlob?: Blob) => void;
  visualizerBars?: number;
  className?: string;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  className
}: AIVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  // LOGIQUE AUDIO RÉELLE
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const startRecording = async () => {
    try {
      console.log('🎤 DÉBUT enregistrement - Demande microphone...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ MICROPHONE OK ! Stream:', stream);
      setAudioStream(stream);
      
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('🎵 Audio reçu:', event.data.size, 'bytes');
        }
      };
      
      recorder.onstop = () => {
        console.log('⏹️ STOP ! Création blob...');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        console.log('📦 BLOB:', { size: audioBlob.size, duration: time });
        
        // Nettoyer
        stream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
        
        // ENVOYER !
        console.log('📞 APPEL onStop...');
        onStop?.(time, audioBlob);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      onStart?.();
      console.log('🔴 ENREGISTREMENT DÉMARRÉ !');
      
    } catch (error) {
      console.error('❌ ERREUR:', error);
      alert(`Erreur microphone: ${error.message}`);
    }
  };

  const stopRecording = () => {
    console.log('🛑 stopRecording appelé, mediaRecorder:', mediaRecorder?.state);
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('🛑 ARRÊT du MediaRecorder...');
      mediaRecorder.stop();
      setMediaRecorder(null);
    } else {
      console.log('⚠️ Pas de MediaRecorder actif, appel direct onStop');
      // Si pas de MediaRecorder, on appelle quand même onStop
      if (time > 0) {
        console.log('📞 APPEL DIRECT onStop avec durée:', time);
        onStop?.(time, new Blob([], { type: 'audio/wav' })); // Blob vide pour test
      }
    }
  };

  // Timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording) {
      console.log('▶️ START enregistrement');
      startRecording();
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else if (!isRecording && time > 0) {
      console.log('⏹️ STOP enregistrement maintenant');
      stopRecording();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRecording, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    console.log('🖱️ CLICK DÉTECTÉ ! État actuel:', isRecording);
    console.log('🖱️ onStart fonction:', typeof onStart);
    console.log('🖱️ onStop fonction:', typeof onStop);
    
    if (isRecording) {
      console.log('🛑 ARRÊT demandé...');
      setIsRecording(false);
      setTime(0);
    } else {
      console.log('▶️ DÉMARRAGE demandé...');
      setTime(0);
      setIsRecording(true);
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            isRecording
              ? "bg-none"
              : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          )}
          type="button"
          onClick={handleClick}
        >
          {isRecording ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white cursor-pointer pointer-events-auto"
              style={{ animationDuration: "3s" }}
            />
          ) : (
            <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            isRecording
              ? "text-black/70 dark:text-white/70"
              : "text-black/30 dark:text-white/30"
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                isRecording
                  ? "bg-white/30"
                  : "bg-white/10 h-1"
              )}
              style={
                isRecording && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-xs text-black/70 dark:text-white/70">
          {isRecording ? "Listening..." : "Click to speak"}
        </p>
      </div>
    </div>
  );
}