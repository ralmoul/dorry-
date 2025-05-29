import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Pause, Play, Send, Edit3, Trash2, Check, X, RefreshCw } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { RecordingConfirmation } from '@/components/ui/RecordingConfirmation';
import { ConsentModal } from '@/components/ui/ConsentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { sendAudioToWebhook } from '@/services/webhookService';

interface VoiceRecorderProps {
  onOpenSettings: () => void;
  onOpenUpcomingFeatures: () => void;
}

interface Recording {
  id: string;
  name: string;
  date: Date;
  duration: number;
  blob?: Blob;
  blobData?: string; // base64 encoded blob data
  blobType?: string; // mime type of the blob
  userId: string;
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
  
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(5));
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveformRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Load recordings from localStorage on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserRecordings();
    }
  }, [user?.id]);

  // Clean up expired recordings (older than 7 days) and filter by last 7 days
  useEffect(() => {
    const cleanupAndFilterRecordings = () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      setRecordings(prev => {
        // Filter recordings from the last 7 days (not just 7 recordings)
        const filtered = prev.filter(rec => new Date(rec.date) > sevenDaysAgo);
        // Sort by date (most recent first)
        const sorted = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (sorted.length !== prev.length) {
          saveUserRecordings(sorted);
        }
        return sorted;
      });
    };

    if (user?.id) {
      cleanupAndFilterRecordings();
      const interval = setInterval(cleanupAndFilterRecordings, 60 * 60 * 1000); // Check every hour
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  // Set up the callback for when recording is confirmed
  useEffect(() => {
    const handleNewRecording = (blob: Blob, duration: number) => {
      console.log('🎵 [VOICE_RECORDER] Nouveau enregistrement reçu:', { duration, size: blob.size });
      addNewRecording(blob, duration);
    };
    
    setRecordingConfirmedCallback(handleNewRecording);
  }, [setRecordingConfirmedCallback, user?.id]);

  // Convert blob to base64 for storage
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:mime;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Convert base64 back to blob
  const base64ToBlob = (base64: string, type: string): Blob => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type });
      
      console.log('🔄 [VOICE_RECORDER] Blob reconstitué:', {
        size: blob.size,
        type: blob.type,
        isBlob: blob instanceof Blob,
        constructor: blob.constructor.name
      });
      
      return blob;
    } catch (error) {
      console.error('❌ [VOICE_RECORDER] Erreur lors de la reconstitution du blob:', error);
      throw error;
    }
  };

  const loadUserRecordings = async () => {
    const savedRecordings = localStorage.getItem(`dorry_recordings_${user?.id}`);
    if (savedRecordings) {
      try {
        const parsed = JSON.parse(savedRecordings);
        const recordingsWithDates = await Promise.all(parsed.map(async (rec: any) => {
          const recording: Recording = {
            ...rec,
            date: new Date(rec.date)
          };

          // Reconstitute blob from base64 if available
          if (rec.blobData && rec.blobType) {
            try {
              // Vérification des données avant reconstitution
              if (typeof rec.blobData === 'string' && rec.blobData.length > 0) {
                recording.blob = base64ToBlob(rec.blobData, rec.blobType);
                console.log('✅ [VOICE_RECORDER] Blob reconstitué pour:', rec.id, {
                  originalSize: rec.blobData.length,
                  finalSize: recording.blob.size,
                  type: recording.blob.type,
                  isValidBlob: recording.blob instanceof Blob
                });
              } else {
                console.warn('⚠️ [VOICE_RECORDER] Données blob invalides pour:', rec.id);
              }
            } catch (error) {
              console.error('❌ [VOICE_RECORDER] Erreur lors de la reconstitution du blob pour', rec.id, ':', error);
              // On continue sans le blob
            }
          }

          return recording;
        }));
        
        // Filter recordings from the last 7 days and sort by date
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const filtered = recordingsWithDates.filter((rec: Recording) => new Date(rec.date) > sevenDaysAgo);
        const sorted = filtered.sort((a: Recording, b: Recording) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        console.log('📂 [VOICE_RECORDER] Enregistrements chargés:', sorted.length);
        setRecordings(sorted);
      } catch (error) {
        console.error('❌ [VOICE_RECORDER] Erreur lors du chargement:', error);
      }
    }
  };

  const saveUserRecordings = async (recs: Recording[]) => {
    if (user?.id) {
      console.log('💾 [VOICE_RECORDER] Sauvegarde de', recs.length, 'enregistrements');
      
      // Convert blobs to base64 for storage
      const recordingsForStorage = await Promise.all(recs.map(async (rec) => {
        const recordingForStorage: any = {
          id: rec.id,
          name: rec.name,
          date: rec.date,
          duration: rec.duration,
          userId: rec.userId
        };

        // Convert blob to base64 if it exists
        if (rec.blob && rec.blob instanceof Blob && rec.blob.size > 0) {
          try {
            recordingForStorage.blobData = await blobToBase64(rec.blob);
            recordingForStorage.blobType = rec.blob.type;
            console.log('💾 [VOICE_RECORDER] Blob sauvegardé pour:', rec.id, 'type:', rec.blob.type, 'taille:', rec.blob.size);
          } catch (error) {
            console.error('❌ [VOICE_RECORDER] Erreur lors de la conversion du blob:', error);
          }
        }

        return recordingForStorage;
      }));

      localStorage.setItem(`dorry_recordings_${user.id}`, JSON.stringify(recordingsForStorage));
    }
  };

  const addNewRecording = async (blob: Blob, duration: number) => {
    if (!user?.id) {
      console.error('❌ [VOICE_RECORDER] Pas d\'utilisateur connecté');
      return;
    }

    // Vérification que le blob est valide avant de sauvegarder
    if (!blob || !(blob instanceof Blob) || blob.size === 0) {
      console.error('❌ [VOICE_RECORDER] Blob invalide, enregistrement non sauvegardé');
      return;
    }

    const newRecording: Recording = {
      id: Date.now().toString(),
      name: '',
      date: new Date(),
      duration,
      blob,
      userId: user.id
    };

    console.log('✅ [VOICE_RECORDER] Ajout nouvel enregistrement:', newRecording.id, 'avec blob de taille:', blob.size);

    setRecordings(prev => {
      // Add new recording at the beginning (most recent first)
      const updated = [newRecording, ...prev];
      
      // Filter recordings from the last 7 days only
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const filtered = updated.filter(rec => new Date(rec.date) > sevenDaysAgo);
      
      console.log('📝 [VOICE_RECORDER] Historique mis à jour:', filtered.length, 'enregistrements');
      saveUserRecordings(filtered);
      return filtered;
    });
  };

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

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDefaultName = (date: Date) => {
    return `Enregistrement du ${formatDateDisplay(date)}, ${formatTimeDisplay(date)}`;
  };

  const handleStartEdit = (recording: Recording) => {
    setEditingId(recording.id);
    setEditingName(recording.name || getDefaultName(recording.date));
  };

  const handleSaveEdit = () => {
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
    const isDuplicate = recordings.some(rec => 
      rec.id !== editingId && 
      (rec.name || getDefaultName(rec.date)).toLowerCase() === trimmedName.toLowerCase()
    );

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

    const updatedRecordings = recordings.map(rec => 
      rec.id === editingId ? { ...rec, name: trimmedName } : rec
    );
    setRecordings(updatedRecordings);
    saveUserRecordings(updatedRecordings);
    setEditingId(null);
    setEditingName('');
    
    toast({
      title: "✅ Nom mis à jour !",
      description: "Le nom de l'enregistrement a été modifié avec succès"
    });
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

  const handlePlay = (recording: Recording) => {
    if (playingId === recording.id) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    if (!recording.blob) {
      toast({
        title: "Erreur",
        description: "Enregistrement non disponible",
        variant: "destructive"
      });
      return;
    }

    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(URL.createObjectURL(recording.blob));
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
  };

  const handleDelete = (recordingId: string) => {
    const updatedRecordings = recordings.filter(rec => rec.id !== recordingId);
    setRecordings(updatedRecordings);
    saveUserRecordings(updatedRecordings);
    
    if (playingId === recordingId && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }

    toast({
      title: "Enregistrement supprimé",
      description: "L'enregistrement a été supprimé avec succès"
    });
  };

  const handleResend = async (recording: Recording) => {
    console.log('🔄 [VOICE_RECORDER] Tentative de renvoi pour:', recording.id);
    console.log('📊 [VOICE_RECORDER] Recording object détaillé:', {
      id: recording.id,
      hasBlob: !!recording.blob,
      blobType: recording.blob?.constructor?.name,
      blobSize: recording.blob?.size,
      mimeType: recording.blob?.type,
      isBlob: recording.blob instanceof Blob,
      blobToString: recording.blob?.toString()
    });

    if (!recording.blob) {
      console.error('❌ [VOICE_RECORDER] Pas de blob disponible');
      toast({
        title: "Erreur",
        description: "Enregistrement non disponible pour le renvoi. Seuls les nouveaux enregistrements peuvent être renvoyés.",
        variant: "destructive"
      });
      return;
    }

    // Vérification stricte que c'est bien un Blob natif
    if (!(recording.blob instanceof Blob) || recording.blob.constructor.name !== 'Blob') {
      console.error('❌ [VOICE_RECORDER] L\'objet n\'est pas un Blob valide:', {
        type: typeof recording.blob,
        constructor: recording.blob?.constructor?.name,
        isBlob: recording.blob instanceof Blob
      });
      toast({
        title: "Erreur",
        description: "L'enregistrement n'est pas un blob valide.",
        variant: "destructive"
      });
      return;
    }

    // Vérification que le blob n'est pas vide
    if (recording.blob.size === 0) {
      console.error('❌ [VOICE_RECORDER] Blob vide');
      toast({
        title: "Erreur",
        description: "L'enregistrement est vide.",
        variant: "destructive"
      });
      return;
    }

    // Vérification du type MIME
    if (!recording.blob.type || !recording.blob.type.startsWith('audio/')) {
      console.warn('⚠️ [VOICE_RECORDER] Type MIME manquant ou invalide:', recording.blob.type);
      // On continue quand même car certains navigateurs peuvent avoir des types MIME vides
    }

    console.log('✅ [VOICE_RECORDER] Blob validé pour le renvoi:', {
      size: recording.blob.size,
      type: recording.blob.type,
      isBlob: recording.blob instanceof Blob,
      constructor: recording.blob.constructor.name
    });

    setResendingId(recording.id);
    
    try {
      console.log('🚀 [VOICE_RECORDER] Envoi du blob vers sendAudioToWebhook...');
      const result = await sendAudioToWebhook(recording.blob, user);
      
      console.log('✅ [VOICE_RECORDER] Renvoi réussi:', result);
      
      toast({
        title: "Enregistrement renvoyé",
        description: "L'enregistrement a été renvoyé avec succès vers l'IA",
      });
    } catch (error) {
      console.error('❌ [VOICE_RECORDER] Erreur lors du renvoi:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de renvoyer l'enregistrement.";
      
      toast({
        title: "Erreur de renvoi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setResendingId(null);
    }
  };

  const getDaysUntilExpiry = (date: Date) => {
    const now = new Date();
    const diffTime = 7 * 24 * 60 * 60 * 1000 - (now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Determine what to display for the user greeting
  const getUserGreeting = () => {
    if (isAuthenticated && user?.firstName) {
      return `Bonjour, ${user.firstName}`;
    }
    return 'Bonjour, Utilisateur';
  };
  
  return (
    <>
      {/* Modal de consentement RGPD */}
      <ConsentModal
        isOpen={showConsentModal}
        onConsentGiven={handleConsentGiven}
        onConsentRefused={handleConsentRefused}
      />

      <div className="flex flex-col min-h-screen px-4 sm:px-6 relative overflow-hidden">
        {/* Particules d'arrière-plan */}
        <div className="absolute inset-0 z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue opacity-20" 
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              }} 
              animate={{
                x: [
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
                ],
                y: [
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), 
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
                ]
              }} 
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }} 
            />
          ))}
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-10 md:pt-14">
          <AnimatePresence mode="wait">
            {showConfirmation ? (
              <motion.div 
                key="confirmation" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                transition={{ duration: 0.3 }} 
                className="w-full max-w-sm sm:max-w-md"
              >
                <RecordingConfirmation 
                  onSend={confirmSend} 
                  onCancel={cancelRecording} 
                  isProcessing={isProcessing} 
                />
              </motion.div>
            ) : (
              <motion.div 
                key="recorder" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.3 }} 
                className="flex flex-col items-center w-full max-w-4xl"
              >
                {/* Titre principal avec espacement ajusté */}
                <motion.h2 
                  className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent px-2" 
                  initial={{ opacity: 0, y: -20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                >
                  Votre assistante vocal intelligente vous écoute
                </motion.h2>
                
                <AnimatePresence mode="wait">
                  {isRecording ? (
                    <motion.div 
                      key="recording" 
                      initial={{ opacity: 0, scale: 0.8 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.8 }} 
                      className="text-white text-sm sm:text-lg mb-8 sm:mb-10 md:mb-12 text-center"
                    >
                      {isPaused ? 'Enregistrement en pause' : 'Enregistrement en cours...'} {formatRecordingTime(recordingTime)}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="instruction" 
                      initial={{ opacity: 0, scale: 0.8 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.8 }} 
                      className="text-white text-sm sm:text-lg mb-8 sm:mb-10 md:mb-12 text-center px-4"
                    >
                      Appuyer sur le micro pour commencer
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Visualisation des ondes vocales avec espacement ajusté */}
                <div className="relative mb-8 sm:mb-10 md:mb-12">
                  {/* Cercles concentriques animés */}
                  <AnimatePresence>
                    {isRecording && !isPaused && (
                      <>
                        <motion.div 
                          initial={{ scale: 0, opacity: 0.7 }} 
                          animate={{ scale: 1.5, opacity: 0 }} 
                          exit={{ scale: 0, opacity: 0 }} 
                          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-bright-turquoise" 
                        />
                        <motion.div 
                          initial={{ scale: 0, opacity: 0.5 }} 
                          animate={{ scale: 1.2, opacity: 0 }} 
                          exit={{ scale: 0, opacity: 0 }} 
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.3 }} 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-electric-blue" 
                        />
                      </>
                    )}
                  </AnimatePresence>
                  
                  {/* Visualisation des ondes autour du bouton */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
                    <div className="flex items-center justify-center w-full h-full">
                      {waveform.map((height, index) => (
                        <motion.div 
                          key={index} 
                          className="w-1 mx-0.5 rounded-full bg-gradient-to-t from-bright-turquoise to-electric-blue" 
                          style={{
                            height: `${height}px`,
                            opacity: isRecording && !isPaused ? 0.8 : 0.3
                          }} 
                          animate={{
                            height: `${height}px`,
                            opacity: isRecording && !isPaused ? 0.8 : 0.3
                          }} 
                          transition={{ duration: 0.1 }} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Contrôles d'enregistrement */}
                  <div className="flex items-center justify-center space-x-4">
                    {/* Bouton pause/reprise (seulement visible pendant l'enregistrement) */}
                    {isRecording && (
                      <motion.button 
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0, opacity: 0 }} 
                        onClick={handlePauseResumeClick} 
                        className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center focus:outline-none bg-gradient-to-r from-yellow-500 to-orange-500" 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        {isPaused ? (
                          <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                        ) : (
                          <Pause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                        )}
                      </motion.button>
                    )}

                    {/* Bouton du micro principal */}
                    <motion.button 
                      onClick={handleMicClick} 
                      className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center focus:outline-none ${
                        isRecording 
                          ? 'bg-gradient-to-r from-red-500 to-red-600' 
                          : 'bg-gradient-to-r from-bright-turquoise to-electric-blue'
                      }`} 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      animate={{
                        boxShadow: isRecording && !isPaused 
                          ? [
                              '0 0 0 0 rgba(239, 68, 68, 0)', 
                              '0 0 0 15px rgba(239, 68, 68, 0.3)', 
                              '0 0 0 0 rgba(239, 68, 68, 0)'
                            ] 
                          : [
                              '0 0 0 0 rgba(0, 184, 212, 0)', 
                              '0 0 0 10px rgba(0, 184, 212, 0.3)', 
                              '0 0 0 0 rgba(0, 184, 212, 0)'
                            ]
                      }} 
                      transition={{
                        boxShadow: { repeat: Infinity, duration: 1.5 }
                      }}
                    >
                      <motion.div 
                        animate={{
                          scale: isRecording && !isPaused ? [1, 1.2, 1] : 1
                        }} 
                        transition={{
                          scale: {
                            repeat: isRecording && !isPaused ? Infinity : 0,
                            duration: 1
                          }
                        }}
                      >
                        {isRecording ? (
                          <Send className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                        ) : (
                          <Mic className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                        )}
                      </motion.div>
                    </motion.button>
                  </div>
                </div>

                {/* Historique des enregistrements */}
                <div className="w-full max-w-3xl mt-8">
                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-xl font-semibold text-white mb-4 text-center">
                      Vos enregistrements des 7 derniers jours
                    </h3>
                    
                    {recordings.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🐟</div>
                        <p className="text-slate-300 text-sm">
                          Ici, la mémoire, c'est 7 jours : assez pour ne rien rater, pas assez pour s'inquiéter !
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <AnimatePresence>
                          {recordings.map((recording) => (
                            <motion.div
                              key={recording.id}
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
                                  onClick={() => handlePlay(recording)}
                                  className={`flex-shrink-0 w-8 h-8 ${
                                    playingId === recording.id 
                                      ? 'text-orange-400 hover:bg-orange-400/10' 
                                      : 'text-cyan-400 hover:bg-cyan-400/10'
                                  }`}
                                >
                                  <Play className="w-4 h-4" />
                                </Button>

                                {/* Name and date */}
                                <div className="flex-1 min-w-0">
                                  {editingId === recording.id ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        maxLength={50}
                                        className="bg-slate-600 border-slate-500 text-white text-sm"
                                        placeholder="Nom de l'enregistrement..."
                                        autoFocus
                                      />
                                      <div className="flex gap-1 flex-shrink-0">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={handleSaveEdit}
                                          className="text-green-400 hover:bg-green-400/10 w-8 h-8"
                                        >
                                          <Check className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={handleCancelEdit}
                                          className="text-red-400 hover:bg-red-400/10 w-8 h-8"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="font-medium text-white text-sm truncate">
                                        {recording.name || getDefaultName(recording.date)}
                                      </div>
                                      <div className="text-xs text-slate-400 flex items-center justify-between">
                                        <span>{formatDateDisplay(recording.date)}, {formatTimeDisplay(recording.date)}</span>
                                        <span className="text-orange-400">
                                          Expire dans {getDaysUntilExpiry(recording.date)} jour(s)
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Action buttons */}
                                {editingId !== recording.id && (
                                  <div className="flex gap-1 flex-shrink-0">
                                    {/* Bouton de renvoi - seulement visible si le blob existe */}
                                    {recording.blob && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleResend(recording)}
                                        disabled={resendingId === recording.id}
                                        className="text-cyan-400 hover:bg-cyan-400/10 w-8 h-8 disabled:opacity-50"
                                        title="Renvoyer vers l'IA"
                                      >
                                        {resendingId === recording.id ? (
                                          <RefreshCw className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Send className="w-3 h-3" />
                                        )}
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleStartEdit(recording)}
                                      className="text-slate-400 hover:bg-slate-600 hover:text-white w-8 h-8"
                                      title="Renommer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete(recording.id)}
                                      className="text-red-400 hover:bg-red-400/10 w-8 h-8"
                                      title="Supprimer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              {editingId === recording.id && (
                                <div className="mt-2 text-xs text-slate-400">
                                  {editingName.length}/50 caractères
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        
                        <div className="text-center mt-6">
                          <div className="text-3xl mb-2">🐟</div>
                          <p className="text-slate-400 text-xs">
                            Vos enregistrements sont strictement confidentiels et automatiquement supprimés après 7 jours.<br/>
                            Dorry ne partage rien sans votre accord.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
