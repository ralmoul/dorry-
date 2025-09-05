"use client";

import { ChevronDown, ChevronUp, Mic } from "lucide-react";
import { useState } from "react";

interface SimpleVoiceMessageProps {
  duration: number;
  transcription?: string;
  className?: string;
}

export function SimpleVoiceMessage({
  duration,
  transcription,
  className
}: SimpleVoiceMessageProps) {
  const [showTranscription, setShowTranscription] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`inline-block bg-[#2f2f2f] text-white px-4 py-2 rounded-3xl max-w-[80%] ${className}`}>
      <div className="flex items-center gap-2">
        <Mic className="w-4 h-4" />
        <span className="text-sm">Message vocal ({formatDuration(duration)})</span>
      </div>
      
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
            <div className="mt-1 p-2 bg-black/20 rounded text-xs text-white/80">
              {transcription}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
