"use client";

import { Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number, audioBlob?: Blob) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className
}: AIVoiceInputProps) {
  // VOTRE INTERFACE VISUELLE (inchangée)
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(false); // Toujours désactiver le mode demo
  
  // MA LOGIQUE AUDIO (ajoutée)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // LOGIQUE AUDIO COMPLÈTE AVEC DEBUG
  const startRealRecording = async () => {
    try {
      console.log('🎤 DEBUT startRealRecording - Demande accès microphone...');
      
      // Vérifier si getUserMedia existe
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia non supporté par ce navigateur');
      }
      
      console.log('📱 getUserMedia disponible, demande permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ MICROPHONE AUTORISÉ ! Stream reçu:', stream);
      setAudioStream(stream);
      
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      console.log('🎙️ MediaRecorder créé, état:', recorder.state);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('🎵 DONNÉES AUDIO REÇUES:', event.data.size, 'bytes');
        }
      };
      
      recorder.onstop = () => {
        console.log('⏹️ ENREGISTREMENT ARRÊTÉ, création blob...');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        console.log('📦 BLOB CRÉÉ:', { 
          size: audioBlob.size, 
          type: audioBlob.type,
          duration: time,
          chunks: audioChunksRef.current.length
        });
        
        // Nettoyer le stream
        stream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
        
        // APPEL CRITIQUE : onStop avec l'audio
        console.log('📞 APPEL onStop avec blob...');
        onStop?.(time, audioBlob);
        console.log('✅ onStop appelé !');
      };
      
      console.log('▶️ Démarrage enregistrement...');
      recorder.start();
      setMediaRecorder(recorder);
      onStart?.();
      console.log('✅ ENREGISTREMENT DÉMARRÉ ! État:', recorder.state);
      
    } catch (error) {
      console.error('❌ ERREUR MICROPHONE CRITIQUE:', error);
      console.error('Type erreur:', error.name);
      console.error('Message:', error.message);
      
      // Afficher une alerte pour debug
      alert(`ERREUR MICROPHONE: ${error.message}\n\nVérifiez que vous avez autorisé l'accès au microphone !`);
    }
  };

  const stopRealRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('🛑 Arrêt du MediaRecorder...');
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect submitted changé:', submitted);
    let intervalId: NodeJS.Timeout;

    if (submitted && !isDemo) {
      console.log('▶️ DÉMARRAGE enregistrement réel...');
      // Démarrer VRAIMENT l'enregistrement
      startRealRecording();
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else if (!submitted) {
      console.log('⏹️ ARRÊT enregistrement...');
      // Arrêter VRAIMENT l'enregistrement
      stopRealRecording();
      setTime(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [submitted, isDemo]);

  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


  const handleClick = () => {
    console.log('🖱️ CLICK sur le bouton micro, état actuel:', { submitted, isDemo });
    
    if (isDemo) {
      console.log('🎭 Mode demo désactivé');
      setIsDemo(false);
      setSubmitted(false);
    } else {
      const newSubmitted = !submitted;
      console.log('🔄 Changement état submitted:', submitted, '->', newSubmitted);
      setSubmitted(newSubmitted);
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            submitted
              ? "bg-none"
              : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          )}
          type="button"
          onClick={handleClick}
        >
          {submitted ? (
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
            submitted
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
                submitted
                  ? "bg-white/30"
                  : "bg-white/10 h-1"
              )}
              style={
                submitted && isClient
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
          {submitted ? "Listening..." : "Click to speak"}
        </p>
      </div>
    </div>
  );
}
