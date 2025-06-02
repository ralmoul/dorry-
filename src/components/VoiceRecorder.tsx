
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  Download, 
  Edit3, 
  Check, 
  X,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceWaves } from '@/components/ui/VoiceWaves';
import { AIVisualizer } from '@/components/ui/AIVisualizer';
import { RecordingConfirmation } from '@/components/ui/RecordingConfirmation';
import { ConsentModal } from '@/components/ui/ConsentModal';
import { useVoiceRecordings } from '@/hooks/useVoiceRecordings';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useConsentManager } from '@/hooks/useConsentManager';
import { useToast } from '@/components/ui/use-toast';
import { VoiceRecording } from '@/types/auth';

interface VoiceRecorderProps {
  onOpenSettings?: () => void;
  onOpenUpcomingFeatures?: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onOpenSettings,
  onOpenUpcomingFeatures
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showRecordingConfirmation, setShowRecordingConfirmation] = useState(false);
  const [recordingToSave, setRecordingToSave] = useState<{ blob: Blob; duration: number } | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentPlayingRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();
  const { 
    showConsentModal, 
    requestConsent, 
    giveConsent, 
    refuseConsent 
  } = useConsentManager();

  const {
    recordings,
    allRecordings,
    isLoading: recordingsLoading,
    showAll,
    hasMore,
    totalCount,
    displayedCount,
    toggleShowAll,
    saveRecording,
    updateRecordingName,
    deleteRecording,
    getRecordingBlob
  } = useVoiceRecordings();

  const {
    isRecording: isRecordingActive,
    recordingTime,
    startRecording,
    stopRecording
  } = useAudioRecorder();

  useEffect(() => {
    return () => {
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }
      if (currentPlayingRef.current) {
        currentPlayingRef.current.pause();
        currentPlayingRef.current = null;
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setIsRecording(true);
      console.log('🎙️ Recording started successfully');
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'enregistrement. Vérifiez les permissions du microphone.",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
      console.log('⏹️ Recording stopped');
    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      setIsRecording(false);
    }
  };

  const handleSaveRecording = async (name?: string) => {
    if (!recordingToSave) return;

    const result = await saveRecording(recordingToSave.blob, recordingToSave.duration, name);
    
    if (result.success) {
      toast({
        title: "Succès",
        description: result.message,
        variant: "default"
      });
    } else {
      toast({
        title: "Erreur",
        description: result.message,
        variant: "destructive"
      });
    }

    setRecordingToSave(null);
    setShowRecordingConfirmation(false);
  };

  const handleDiscardRecording = () => {
    setRecordingToSave(null);
    setShowRecordingConfirmation(false);
  };

  const handlePlayRecording = (recording: VoiceRecording) => {
    if (currentPlayingId === recording.id && isPlaying) {
      // Pause current recording
      if (currentPlayingRef.current) {
        currentPlayingRef.current.pause();
      }
      setIsPlaying(false);
      setCurrentPlayingId(null);
      return;
    }

    // Stop any currently playing audio
    if (currentPlayingRef.current) {
      currentPlayingRef.current.pause();
      currentPlayingRef.current = null;
    }

    try {
      const blob = getRecordingBlob(recording);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onplay = () => {
        setIsPlaying(true);
        setCurrentPlayingId(recording.id);
      };
      
      audio.onpause = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
        URL.revokeObjectURL(url);
        currentPlayingRef.current = null;
      };

      currentPlayingRef.current = audio;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Erreur",
          description: "Impossible de lire l'enregistrement",
          variant: "destructive"
        });
      });
      
    } catch (error) {
      console.error('Error creating audio blob:', error);
      toast({
        title: "Erreur",
        description: "Impossible de lire l'enregistrement",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (recording: VoiceRecording) => {
    try {
      const blob = getRecordingBlob(recording);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${recording.name || 'enregistrement'}_${new Date(recording.created_at).toLocaleDateString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading recording:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'enregistrement",
        variant: "destructive"
      });
    }
  };

  const handleEditName = (recording: VoiceRecording) => {
    setEditingId(recording.id);
    setEditingName(recording.name || '');
  };

  const handleSaveName = async () => {
    if (!editingId) return;

    const result = await updateRecordingName(editingId, editingName);
    
    if (result.success) {
      toast({
        title: "Succès",
        description: result.message,
        variant: "default"
      });
    } else {
      toast({
        title: "Erreur",
        description: result.message,
        variant: "destructive"
      });
    }

    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteClick = (recordingId: string) => {
    setDeleteConfirmId(recordingId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    const result = await deleteRecording(deleteConfirmId);
    
    if (result.success) {
      toast({
        title: "Succès",
        description: result.message,
        variant: "default"
      });
    } else {
      toast({
        title: "Erreur",
        description: result.message,
        variant: "destructive"
      });
    }

    setDeleteConfirmId(null);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Recording Interface */}
      <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-bright-turquoise">
            Enregistreur Vocal IA
          </CardTitle>
          <CardDescription className="text-slate-300">
            Cliquez sur le microphone pour commencer l'enregistrement
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {/* Recording Button */}
          <div className="relative">
            <Button
              size="lg"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isRecordingActive && !isRecording}
              className={cn(
                "w-24 h-24 rounded-full transition-all duration-300 shadow-lg",
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50" 
                  : "bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 shadow-bright-turquoise/30"
              )}
            >
              {isRecording ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </Button>
            
            {isRecording && <VoiceWaves />}
          </div>

          {/* Recording Duration */}
          {isRecording && (
            <div className="flex items-center space-x-2 text-bright-turquoise">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-mono">
                {formatDuration(recordingTime)}
              </span>
            </div>
          )}

          {/* AI Visualization */}
          <AIVisualizer 
            isRecording={isRecording}
            onRecordingToggle={() => {}}
            isProcessing={false}
          />
        </CardContent>
      </Card>

      {/* Recordings History */}
      <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-bright-turquoise">
              Historique des enregistrements
            </CardTitle>
            <Badge variant="secondary" className="bg-bright-turquoise/10 text-bright-turquoise">
              {showAll ? `${totalCount} enregistrements` : `${displayedCount}/${totalCount}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {recordingsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bright-turquoise mx-auto"></div>
              <p className="text-slate-400 mt-2">Chargement...</p>
            </div>
          ) : recordings.length === 0 ? (
            <div className="text-center py-8">
              <MicOff className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">Aucun enregistrement pour le moment</p>
              <p className="text-sm text-slate-500 mt-2">
                Cliquez sur le microphone pour créer votre premier enregistrement
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recordings.map((recording) => (
                <Card key={recording.id} className="bg-background/50 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {editingId === recording.id ? (
                            <div className="flex items-center space-x-2 flex-1">
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                placeholder="Nom de l'enregistrement"
                                className="bg-background/50 border-slate-600"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveName();
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                autoFocus
                              />
                              <Button size="sm" variant="ghost" onClick={handleSaveName}>
                                <Check className="w-4 h-4 text-green-400" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                                <X className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <h3 className="font-medium text-white">
                                {recording.name || 'Enregistrement sans nom'}
                              </h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditName(recording)}
                                className="text-slate-400 hover:text-white"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(recording.duration)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(recording.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePlayRecording(recording)}
                          className="text-bright-turquoise hover:bg-bright-turquoise/10"
                        >
                          {currentPlayingId === recording.id && isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(recording)}
                          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(recording.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Show More/Less Button */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={toggleShowAll}
                    className="border-bright-turquoise/20 text-bright-turquoise hover:bg-bright-turquoise/10"
                  >
                    {showAll ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Voir moins
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Voir plus ({totalCount - displayedCount} restants)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ConsentModal
        isOpen={showConsentModal}
        onConsent={giveConsent}
        onCancel={refuseConsent}
      />

      <RecordingConfirmation
        open={showRecordingConfirmation}
        onSave={handleSaveRecording}
        onDiscard={handleDiscardRecording}
        duration={recordingToSave?.duration || 0}
      />

      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-background border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Supprimer l'enregistrement</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet enregistrement ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
