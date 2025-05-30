
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Edit3, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceRecording } from '@/types/auth';

interface RecordingItemProps {
  recording: VoiceRecording;
  isPlaying: boolean;
  isEditing: boolean;
  editingName: string;
  onPlay: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onNameChange: (name: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  formatDateDisplay: (dateString: string) => string;
  formatTimeDisplay: (dateString: string) => string;
  formatDuration: (seconds: number) => string;
  getDaysUntilExpiry: (dateString: string) => number;
  getDefaultName: (dateString: string) => string;
}

export const RecordingItem: React.FC<RecordingItemProps> = ({
  recording,
  isPlaying,
  isEditing,
  editingName,
  onPlay,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onNameChange,
  onKeyPress,
  formatDateDisplay,
  formatTimeDisplay,
  formatDuration,
  getDaysUntilExpiry,
  getDefaultName
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Play button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlay}
          className={`flex-shrink-0 w-8 h-8 ${
            isPlaying
              ? 'text-orange-400 hover:bg-orange-400/10'
              : 'text-cyan-400 hover:bg-cyan-400/10'
          }`}
        >
          <Play className="w-4 h-4" />
        </Button>

        {/* Name and date */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editingName}
                onChange={(e) => onNameChange(e.target.value)}
                onKeyDown={onKeyPress}
                maxLength={50}
                className="bg-slate-600 border-slate-500 text-white text-sm"
                placeholder="Nom de l'enregistrement..."
                autoFocus
              />
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSaveEdit}
                  className="text-green-400 hover:bg-green-400/10 w-8 h-8"
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancelEdit}
                  className="text-red-400 hover:bg-red-400/10 w-8 h-8"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="font-medium text-white text-sm truncate">
                {recording.name || getDefaultName(recording.created_at)}
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>
                  {formatDateDisplay(recording.created_at)}, {formatTimeDisplay(recording.created_at)} 
                  • {formatDuration(recording.duration)}
                </span>
                <span className="text-orange-400">
                  Expire dans {getDaysUntilExpiry(recording.created_at)} jour(s)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!isEditing && (
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onStartEdit}
              className="text-slate-400 hover:bg-slate-600 hover:text-white w-8 h-8"
              title="Renommer"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-red-400 hover:bg-red-400/10 w-8 h-8"
              title="Supprimer"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="mt-2 text-xs text-slate-400">
          {editingName.length}/50 caractères
        </div>
      )}
    </motion.div>
  );
};
