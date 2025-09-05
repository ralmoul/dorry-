"use client";

import { ChevronDown, ChevronUp, Volume2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceMessageProps {
  audioUrl: string;
  duration: number;
  transcription?: string;
  isUser?: boolean;
  className?: string;
}

export function VoiceMessage({
  audioUrl,
  duration,
  transcription,
  isUser = false,
  className
}: VoiceMessageProps) {
  const [showTranscription, setShowTranscription] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    const audio = new Audio(audioUrl);
    audio.play();
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className={cn(
      "flex", 
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl p-3",
        isUser 
          ? "bg-[#2f2f2f] text-white" 
          : "bg-[#1a1a1a] border border-[#404040] text-white"
      )}>
        {/* Message vocal */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlay}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              isUser 
                ? "bg-[#404040] hover:bg-[#505050]" 
                : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
            )}
          >
            <Volume2 className={cn(
              "w-4 h-4",
              isPlaying ? "animate-pulse" : ""
            )} />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {/* Onde sonore visuelle */}
              <div className="flex items-center gap-0.5">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-0.5 rounded-full bg-white/60",
                      isPlaying ? "animate-pulse" : ""
                    )}
                    style={{
                      height: `${8 + Math.random() * 16}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              
              <span className="text-xs text-white/60 ml-2">
                {formatDuration(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Bouton transcription */}
        {transcription && (
          <div className="mt-2">
            <button
              onClick={() => setShowTranscription(!showTranscription)}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white/80 transition-colors"
            >
              {showTranscription ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              Transcription
            </button>
            
            {showTranscription && (
              <div className="mt-2 p-2 bg-black/20 rounded-lg text-sm text-white/80 border border-white/10">
                {transcription}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
