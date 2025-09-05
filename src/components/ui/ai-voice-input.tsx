"use client";

import { Mic, Send, Square } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  onSend?: (audioBlob: Blob, duration: number) => void;
  className?: string;
}

export function AIVoiceInput({
  onStart,
  onStop,
  onSend,
  className
}: AIVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording) {
      onStart?.();
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRecording, onStart]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setHasRecording(true);
        onStop?.(time);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setTime(0);
    } catch (error) {
      console.error('Erreur microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend?.(audioBlob, time);
      // Reset après envoi
      setHasRecording(false);
      setAudioBlob(null);
      setTime(0);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else if (!hasRecording) {
      startRecording();
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-4">
        
        {/* Bouton principal */}
        <button
          className="w-16 h-16 rounded-full flex items-center justify-center bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors"
          type="button"
          onClick={handleMicClick}
        >
          {isRecording ? (
            <Square className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Timer */}
        <span className="font-mono text-sm text-white">
          {formatTime(time)}
        </span>

        {/* Visualiseur simple */}
        {isRecording && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-6 bg-white/50 rounded animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {/* Status */}
        <p className="text-xs text-white/70">
          {isRecording ? "Enregistrement..." : hasRecording ? "Prêt à envoyer" : "Cliquez pour enregistrer"}
        </p>

        {/* Bouton d'envoi */}
        {hasRecording && (
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-colors"
          >
            <Send className="w-4 h-4" />
            Envoyer
          </button>
        )}
      </div>
    </div>
  );
}
