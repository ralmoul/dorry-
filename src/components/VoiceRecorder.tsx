import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Pause, Play, Send, Edit3, Trash2, Check, X, ChevronDown } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useVoiceRecordings } from '@/hooks/useVoiceRecordings';
import { RecordingConfirmation } from '@/components/ui/RecordingConfirmation';
import { ConsentModal } from '@/components/ui/ConsentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onOpenSettings: () => void;
  onOpenUpcomingFeatures: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onOpenSettings,
  onOpenUpcomingFeatures
}) => {
  const {
    user,
    isAuthenticated
  } = useAuth();
  const {
    isRecording,
    isPaused,
    isProcessing,
    showConfirmation,
    recordingTime,
    formatTime: formatRecordingTime,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    confirmSend,
    cancelRecording,
    showConsentModal,
    handleConsentGiven,
    handleConsentRefused,
    setRecordingConfirmedCallback
  } = useAudioRecorder();

  // Utilisation du hook Supabase pour la persistance
  const {
    recordings,
    isLoading: isLoadingRecordings,
    error: recordingsError,
    saveRecording,
    updateRecordingName,
    deleteRecording,
    getRecordingBlob
  } = useVoiceRecordings();
  
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(5));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showAllRecordings, setShowAllRecordings] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveformRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    toast
  } = useToast();

  // Set up the callback for when recording is confirmed
  useEffect(() => {
    const handleNewRecording = async (blob: Blob, duration: number) => {
      console.log('🎵 [VOICE_RECORDER] Nouveau enregistrement reçu:', {
        duration,
        size: blob.size
      });
      try {
        const result = await saveRecording(blob, duration);
        if (result.success) {
          toast({
            title: "✅ Enregistrement sauvegardé !",
            description: "Votre enregistrement a été sauvegardé et synchronisé."
          });
        } else {
          throw new Error(result.message || 'Erreur de sauvegarde');
        }
      } catch (error) {
        console.error('❌ [VOICE_RECORDER] Erreur sauvegarde:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder l'enregistrement",
          variant: "destructive"
        });
      }
    };
    setRecordingConfirmedCallback(handleNewRecording);
  }, [setRecordingConfirmedCallback, saveRecording, toast]);

  // Afficher les erreurs de chargement
  useEffect(() => {
    if (recordingsError) {
      toast({
        title: "Erreur de synchronisation",
        description: recordingsError,
        variant: "destructive"
      });
    }
  }, [recordingsError, toast]);

  // Simule l'animation des ondes vocales
  useEffect(() => {
    if (isRecording && !isPaused) {
      waveformRef.current = setInterval(() => {
        setWaveform(prev => prev.map(() => Math.floor(Math.random() * 30) + 5));
      }, 150);
      timerRef.current = setInterval(() => {
        // Le timer est maintenant géré par useAudioRecorder
      }, 1000);
    } else {
      if (waveformRef.current) clearInterval(waveformRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setWaveform(Array(20).fill(5));
    }
    return () => {
      if (waveformRef.current) clearInterval(waveformRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePauseResumeClick = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

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

  const handleStartEdit = (recording: any) => {
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

    // Check for duplicates
    const isDuplicate = recordings.some(rec => rec.id !== editingId && (rec.name || getDefaultName(rec.created_at)).toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate) {
      toast({
        title: "Erreur",
        description: "Ce nom existe déjà",
        variant: "destructive"
      });
      return;
    }

    // Check for special characters
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

  const handlePlay = (recording: any) => {
    if (playingId === recording.id) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }
    try {
      // Stop any current playback
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

  const getDaysUntilExpiry = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = 7 * 24 * 60 * 60 * 1000 - (now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine what to display for the user greeting
  const getUserGreeting = () => {
    if (isAuthenticated && user?.firstName) {
      return `Bonjour, ${user.firstName}`;
    }
    return 'Bonjour, Utilisateur';
  };

  // Détermine quels enregistrements afficher
  const getDisplayedRecordings = () => {
    if (showAllRecordings || recordings.length <= 5) {
      return recordings;
    }
    return recordings.slice(0, 5);
  };

  const displayedRecordings = getDisplayedRecordings();
  const hasMoreRecordings = recordings.length > 5;

  return <>
      {/* Modal de consentement RGPD */}
      <ConsentModal isOpen={showConsentModal} onConsentGiven={handleConsentGiven} onConsentRefused={handleConsentRefused} />

      <div className="flex flex-col min-h-screen px-4 sm:px-6 relative overflow-hidden">
        {/* Particules d'arrière-plan */}
        <div className="absolute inset-0 z-0">
          {Array.from({
          length: 20
        }).map((_, i) => <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue opacity-20" initial={{
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
        }} animate={{
          x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)],
          y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)]
        }} transition={{
          duration: Math.random() * 20 + 10,
          repeat: Infinity,
          ease: "linear"
        }} />)}
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-10 md:pt-14">
          <AnimatePresence mode="wait">
            {showConfirmation ? <motion.div key="confirmation" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} exit={{
            opacity: 0,
            scale: 0.9
          }} transition={{
            duration: 0.3
          }} className="w-full max-w-sm sm:max-w-md">
                <RecordingConfirmation onSend={confirmSend} onCancel={cancelRecording} isProcessing={isProcessing} />
              </motion.div> : <motion.div key="recorder" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.3
          }} className="flex flex-col items-center w-full max-w-4xl">
                {/* Titre principal avec espacement ajusté */}
                <motion.h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent px-2" initial={{
              opacity: 0,
              y: -20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }}>
                  Votre assistante vocal intelligente vous écoute
                </motion.h2>
                
                <AnimatePresence mode="wait">
                  {isRecording ? <motion.div key="recording" initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} exit={{
                opacity: 0,
                scale: 0.8
              }} className="text-white text-sm sm:text-lg mb-8 sm:mb-10 md:mb-12 text-center">
                      {isPaused ? 'Enregistrement en pause' : 'Enregistrement en cours...'} {formatRecordingTime(recordingTime)}
                    </motion.div> : <motion.div key="instruction" initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} exit={{
                opacity: 0,
                scale: 0.8
              }} className="text-white text-sm sm:text-lg mb-8 sm:mb-10 md:mb-12 text-center px-4">
                      Appuyer sur le micro pour commencer
                    </motion.div>}
                </AnimatePresence>
                
                {/* Visualisation des ondes vocales avec espacement ajusté */}
                <div className="relative mb-8 sm:mb-10 md:mb-12">
                  {/* Cercles concentriques animés */}
                  <AnimatePresence>
                    {isRecording && !isPaused && <>
                        <motion.div initial={{
                    scale: 0,
                    opacity: 0.7
                  }} animate={{
                    scale: 1.5,
                    opacity: 0
                  }} exit={{
                    scale: 0,
                    opacity: 0
                  }} transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeOut"
                  }} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-bright-turquoise" />
                        <motion.div initial={{
                    scale: 0,
                    opacity: 0.5
                  }} animate={{
                    scale: 1.2,
                    opacity: 0
                  }} exit={{
                    scale: 0,
                    opacity: 0
                  }} transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeOut",
                    delay: 0.3
                  }} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-electric-blue" />
                      </>}
                  </AnimatePresence>
                  
                  {/* Visualisation des ondes autour du bouton */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
                    <div className="flex items-center justify-center w-full h-full">
                      {waveform.map((height, index) => <motion.div key={index} className="w-1 mx-0.5 rounded-full bg-gradient-to-t from-bright-turquoise to-electric-blue" style={{
                    height: `${height}px`,
                    opacity: isRecording && !isPaused ? 0.8 : 0.3
                  }} animate={{
                    height: `${height}px`,
                    opacity: isRecording && !isPaused ? 0.8 : 0.3
                  }} transition={{
                    duration: 0.1
                  }} />)}
                    </div>
                  </div>
                  
                  {/* Contrôles d'enregistrement */}
                  <div className="flex items-center justify-center space-x-4">
                    {/* Bouton pause/reprise (seulement visible pendant l'enregistrement) */}
                    {isRecording && <motion.button initial={{
                  scale: 0,
                  opacity: 0
                }} animate={{
                  scale: 1,
                  opacity: 1
                }} exit={{
                  scale: 0,
                  opacity: 0
                }} onClick={handlePauseResumeClick} className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center focus:outline-none bg-gradient-to-r from-yellow-500 to-orange-500" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                        {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />}
                      </motion.button>}

                    {/* Bouton du micro principal */}
                    <motion.button onClick={handleMicClick} className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center focus:outline-none ${isRecording ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-bright-turquoise to-electric-blue'}`} whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} animate={{
                  boxShadow: isRecording && !isPaused ? ['0 0 0 0 rgba(239, 68, 68, 0)', '0 0 0 15px rgba(239, 68, 68, 0.3)', '0 0 0 0 rgba(239, 68, 68, 0)'] : ['0 0 0 0 rgba(0, 184, 212, 0)', '0 0 0 10px rgba(0, 184, 212, 0.3)', '0 0 0 0 rgba(0, 184, 212, 0)']
                }} transition={{
                  boxShadow: {
                    repeat: Infinity,
                    duration: 1.5
                  }
                }}>
                      <motion.div animate={{
                    scale: isRecording && !isPaused ? [1, 1.2, 1] : 1
                  }} transition={{
                    scale: {
                      repeat: isRecording && !isPaused ? Infinity : 0,
                      duration: 1
                    }
                  }}>
                        {isRecording ? <Send className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" /> : <Mic className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />}
                      </motion.div>
                    </motion.button>
                  </div>
                </div>

                {/* Historique des enregistrements */}
                <div className="w-full max-w-3xl mt-8">
                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-xl font-semibold text-white mb-4 text-center">
                      Vos enregistrements synchronisés
                    </h3>
                    
                    {isLoadingRecordings ? <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                        <p className="text-slate-300 text-sm">Synchronisation en cours...</p>
                      </div> : recordings.length === 0 ? <div className="text-center py-8">
                        <div className="text-4xl mb-4">🐟</div>
                        <p className="text-slate-300 text-sm">
                          Aucun enregistrement pour le moment. Vos enregistrements seront synchronisés sur tous vos appareils !
                        </p>
                      </div> : <div className="space-y-3">
                        <AnimatePresence>
                          {displayedRecordings.map(recording => <motion.div key={recording.id} initial={{
                      opacity: 0,
                      y: 20
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} exit={{
                      opacity: 0,
                      y: -20
                    }} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                              <div className="flex items-center justify-between gap-3">
                                {/* Play button */}
                                <Button variant="ghost" size="icon" onClick={() => handlePlay(recording)} className={`flex-shrink-0 w-8 h-8 ${playingId === recording.id ? 'text-orange-400 hover:bg-orange-400/10' : 'text-cyan-400 hover:bg-cyan-400/10'}`}>
                                  <Play className="w-4 h-4" />
                                </Button>

                                {/* Name and date */}
                                <div className="flex-1 min-w-0">
                                  {editingId === recording.id ? <div className="flex items-center gap-2">
                                      <Input value={editingName} onChange={e => setEditingName(e.target.value)} onKeyDown={handleKeyPress} maxLength={50} className="bg-slate-600 border-slate-500 text-white text-sm" placeholder="Nom de l'enregistrement..." autoFocus />
                                      <div className="flex gap-1 flex-shrink-0">
                                        <Button variant="ghost" size="icon" onClick={handleSaveEdit} className="text-green-400 hover:bg-green-400/10 w-8 h-8">
                                          <Check className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="text-red-400 hover:bg-red-400/10 w-8 h-8">
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div> : <div>
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
                                    </div>}
                                </div>

                                {/* Action buttons */}
                                {editingId !== recording.id && <div className="flex gap-1 flex-shrink-0">
                                    <Button variant="ghost" size="icon" onClick={() => handleStartEdit(recording)} className="text-slate-400 hover:bg-slate-600 hover:text-white w-8 h-8" title="Renommer">
                                      <Edit3 className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(recording.id)} className="text-red-400 hover:bg-red-400/10 w-8 h-8" title="Supprimer">
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>}
                              </div>
                              
                              {editingId === recording.id && <div className="mt-2 text-xs text-slate-400">
                                  {editingName.length}/50 caractères
                                </div>}
                            </motion.div>)}
                        </AnimatePresence>
                        
                        {/* Bouton "Voir plus" si il y a plus de 5 enregistrements */}
                        {hasMoreRecordings && !showAllRecordings && (
                          <div className="text-center mt-4">
                            <Button
                              variant="ghost"
                              onClick={() => setShowAllRecordings(true)}
                              className="text-cyan-400 hover:bg-cyan-400/10"
                            >
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Voir plus ({recordings.length - 5} autres)
                            </Button>
                          </div>
                        )}
                        
                        <div className="text-center mt-6">
                          <p className="text-slate-400 text-xs">
                            Vos enregistrements sont synchronisés sur tous vos appareils et automatiquement supprimés après 7 jours.<br />
                            Dorry ne partage rien sans votre accord.
                          </p>
                        </div>
                      </div>}
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </>;
};
