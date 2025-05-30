
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecordingItem } from './RecordingItem';
import { VoiceRecording } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface RecordingHistoryProps {
  recordings: VoiceRecording[];
  isLoading: boolean;
  updateRecordingName: (id: string, name: string) => Promise<{ success: boolean; message?: string }>;
  deleteRecording: (id: string) => Promise<{ success: boolean; message?: string }>;
  getRecordingBlob: (recording: VoiceRecording) => Blob;
}

export const RecordingHistory: React.FC<RecordingHistoryProps> = ({
  recordings,
  isLoading,
  updateRecordingName,
  deleteRecording,
  getRecordingBlob
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDefaultName = (dateString: string) => {
    const date = new Date(dateString);
    return `Enregistrement du ${formatDateDisplay(dateString)}, ${formatTimeDisplay(dateString)}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = 7 * 24 * 60 * 60 * 1000 - (now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleStartEdit = (recording: VoiceRecording) => {
    setEditingId(recording.id);
    setEditingName(recording.name || getDefaultName(recording.created_at));
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const trimmedName = editingName.trim();
    
    if (trimmedName.length > 50) {
      toast({
        title: "Erreur",
        description: "Le nom ne peut pas dépasser 50 caractères",
        variant: "destructive"
      });
      return;
    }

    const isDuplicate = recordings.some(rec => 
      rec.id !== editingId && 
      (rec.name || getDefaultName(rec.created_at)).toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (isDuplicate) {
      toast({
        title: "Erreur",
        description: "Ce nom existe déjà",
        variant: "destructive"
      });
      return;
    }

    const hasSpecialChars = /[<>:"/\\|?*]/.test(trimmedName);
    if (hasSpecialChars) {
      toast({
        title: "Erreur",
        description: "Le nom contient des caractères interdits",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await updateRecordingName(editingId, trimmedName);
      if (result.success) {
        setEditingId(null);
        setEditingName('');
        toast({
          title: "✅ Nom mis à jour !",
          description: "Le nom de l'enregistrement a été modifié avec succès"
        });
      } else {
        throw new Error(result.message || 'Erreur lors du renommage');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le nom",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handlePlay = (recording: VoiceRecording) => {
    if (playingId === recording.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const blob = getRecordingBlob(recording);
      const audio = new Audio(URL.createObjectURL(blob));
      audioRef.current = audio;
      setPlayingId(recording.id);
      
      audio.addEventListener('ended', () => {
        setPlayingId(null);
        audioRef.current = null;
      });
      
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setPlayingId(null);
        toast({
          title: "Erreur",
          description: "Impossible de lire l'enregistrement",
          variant: "destructive"
        });
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Enregistrement non disponible",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (recordingId: string) => {
    try {
      const result = await deleteRecording(recordingId);
      if (result.success) {
        if (playingId === recordingId && audioRef.current) {
          audioRef.current.pause();
          setPlayingId(null);
        }
        toast({
          title: "Enregistrement supprimé",
          description: "L'enregistrement a été supprimé avec succès"
        });
      } else {
        throw new Error(result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'enregistrement",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mt-8">
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">
          Vos enregistrements synchronisés
        </h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-300 text-sm">Synchronisation en cours...</p>
          </div>
        ) : recordings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🐟</div>
            <p className="text-slate-300 text-sm">
              Aucun enregistrement pour le moment. Vos enregistrements seront synchronisés sur tous vos appareils !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {recordings.map(recording => (
                <RecordingItem
                  key={recording.id}
                  recording={recording}
                  isPlaying={playingId === recording.id}
                  isEditing={editingId === recording.id}
                  editingName={editingName}
                  onPlay={() => handlePlay(recording)}
                  onStartEdit={() => handleStartEdit(recording)}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDelete={() => handleDelete(recording.id)}
                  onNameChange={setEditingName}
                  onKeyPress={handleKeyPress}
                  formatDateDisplay={formatDateDisplay}
                  formatTimeDisplay={formatTimeDisplay}
                  formatDuration={formatDuration}
                  getDaysUntilExpiry={getDaysUntilExpiry}
                  getDefaultName={getDefaultName}
                />
              ))}
            </AnimatePresence>
            
            <div className="text-center mt-6">
              <p className="text-slate-400 text-xs">
                Vos enregistrements sont synchronisés sur tous vos appareils et automatiquement supprimés après 7 jours.<br />
                Dorry ne partage rien sans votre accord.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
