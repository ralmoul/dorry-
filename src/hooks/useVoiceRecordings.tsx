
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { VoiceRecording } from '@/types/auth';
import { VoiceRecordingService } from '@/services/voiceRecordingService';
import { VoiceRecordingUtils } from '@/utils/voiceRecordingUtils';
import { useVoiceRecordingSubscription } from '@/hooks/useVoiceRecordingSubscription';

export const useVoiceRecordings = () => {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log('🔄 [RECORDINGS] Processing realtime update:', payload.eventType);
    
    switch (payload.eventType) {
      case 'INSERT':
        setRecordings(prev => [payload.new, ...prev]);
        break;
        
      case 'UPDATE':
        setRecordings(prev => prev.map(recording => 
          recording.id === payload.new.id ? payload.new : recording
        ));
        break;
        
      case 'DELETE':
        setRecordings(prev => prev.filter(recording => recording.id !== payload.old.id));
        break;
    }
  }, []);

  // Set up realtime subscription
  useVoiceRecordingSubscription({
    userId: user?.id,
    onUpdate: handleRealtimeUpdate,
    isAuthenticated
  });

  const loadRecordings = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const recordingsData = await VoiceRecordingService.loadRecordings(user.id);
      setRecordings(recordingsData);
    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error:', error);
      setError('Impossible de charger les enregistrements');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadRecordings();
    } else {
      setRecordings([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user, loadRecordings]);

  const saveRecording = async (
    audioBlob: Blob,
    duration: number,
    name?: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: 'Utilisateur non connecté' };
    }

    return VoiceRecordingService.saveRecording(user.id, audioBlob, duration, name);
  };

  const updateRecordingName = async (
    recordingId: string,
    newName: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: 'Utilisateur non connecté' };
    }

    return VoiceRecordingService.updateRecordingName(recordingId, user.id, newName);
  };

  const deleteRecording = async (
    recordingId: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: 'Utilisateur non connecté' };
    }

    return VoiceRecordingService.deleteRecording(recordingId, user.id);
  };

  const getRecordingBlob = (recording: VoiceRecording): Blob => {
    return VoiceRecordingUtils.getRecordingBlob(recording);
  };

  const cleanupOldRecordings = async () => {
    if (!user) return;
    return VoiceRecordingService.cleanupOldRecordings(user.id);
  };

  return {
    recordings,
    isLoading,
    error,
    saveRecording,
    updateRecordingName,
    deleteRecording,
    getRecordingBlob,
    cleanupOldRecordings,
    refreshRecordings: loadRecordings
  };
};
