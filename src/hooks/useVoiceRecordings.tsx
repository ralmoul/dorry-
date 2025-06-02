import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { VoiceRecording } from '@/types/auth';

export const useVoiceRecordings = () => {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadRecordings();
      setupRealtimeSubscription();
    } else {
      setRecordings([]);
      setIsLoading(false);
    }
    
    return () => {
      supabase.removeAllChannels();
    };
  }, [isAuthenticated, user]);

  const setupRealtimeSubscription = () => {
    if (!user) return;
    
    console.log('📡 [RECORDINGS] Setting up realtime subscription for voice recordings');
    
    const channel = supabase
      .channel('voice-recordings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voice_recordings',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📡 [RECORDINGS] Realtime update received:', payload);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe((status) => {
        console.log('📡 [RECORDINGS] Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleRealtimeUpdate = (payload: any) => {
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
  };

  const loadRecordings = async () => {
    if (!user) return;
    
    try {
      console.log('📊 [RECORDINGS] Loading recordings from Supabase...');
      setIsLoading(true);
      setError(null);
      
      const { data: recordingsData, error: fetchError } = await supabase
        .from('voice_recordings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('❌ [RECORDINGS] Error loading recordings:', fetchError);
        setError('Impossible de charger les enregistrements');
        return;
      }
      
      console.log('✅ [RECORDINGS] Recordings loaded:', recordingsData?.length || 0);
      setRecordings(recordingsData || []);
    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error:', error);
      setError('Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecording = async (
    audioBlob: Blob,
    duration: number,
    name?: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: 'Utilisateur non connecté' };
    }

    try {
      console.log('💾 [RECORDINGS] Saving recording...');
      
      // Convert blob to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const recordingData = {
        user_id: user.id,
        duration: Math.round(duration),
        blob_data: base64Data,
        blob_type: audioBlob.type,
        name: name || null
      };

      const { data: newRecording, error: insertError } = await supabase
        .from('voice_recordings')
        .insert([recordingData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ [RECORDINGS] Error saving recording:', insertError);
        return { success: false, message: 'Erreur lors de la sauvegarde' };
      }

      console.log('✅ [RECORDINGS] Recording saved successfully:', newRecording.id);
      return { success: true, message: 'Enregistrement sauvegardé avec succès' };
      
    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error:', error);
      return { success: false, message: 'Une erreur inattendue est survenue' };
    }
  };

  const updateRecordingName = async (
    recordingId: string,
    newName: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('✏️ [RECORDINGS] Updating recording name:', recordingId);
      
      const { error: updateError } = await supabase
        .from('voice_recordings')
        .update({ 
          name: newName.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordingId)
        .eq('user_id', user?.id);

      if (updateError) {
        console.error('❌ [RECORDINGS] Error updating name:', updateError);
        return { success: false, message: 'Erreur lors du renommage' };
      }

      console.log('✅ [RECORDINGS] Recording name updated successfully');
      return { success: true, message: 'Nom mis à jour avec succès' };
      
    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error:', error);
      return { success: false, message: 'Une erreur inattendue est survenue' };
    }
  };

  const deleteRecording = async (
    recordingId: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      console.error('❌ [RECORDINGS] No user authenticated for deletion');
      return { success: false, message: 'Utilisateur non connecté' };
    }

    try {
      console.log('🗑️ [RECORDINGS] Attempting to delete recording:', {
        recordingId,
        userId: user.id
      });
      
      // Vérifier d'abord que l'enregistrement existe et appartient à l'utilisateur
      const { data: existingRecording, error: checkError } = await supabase
        .from('voice_recordings')
        .select('id, user_id')
        .eq('id', recordingId)
        .eq('user_id', user.id)
        .single();

      if (checkError) {
        console.error('❌ [RECORDINGS] Error checking recording existence:', checkError);
        return { success: false, message: 'Enregistrement introuvable' };
      }

      if (!existingRecording) {
        console.error('❌ [RECORDINGS] Recording not found or not owned by user');
        return { success: false, message: 'Enregistrement introuvable ou non autorisé' };
      }

      console.log('✅ [RECORDINGS] Recording found, proceeding with deletion');

      // Procéder à la suppression
      const { error: deleteError } = await supabase
        .from('voice_recordings')
        .delete()
        .eq('id', recordingId)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('❌ [RECORDINGS] Supabase deletion error:', {
          error: deleteError,
          code: deleteError.code,
          message: deleteError.message,
          details: deleteError.details
        });
        return { success: false, message: `Erreur lors de la suppression: ${deleteError.message}` };
      }

      console.log('✅ [RECORDINGS] Recording deleted successfully from database');
      
      // Mettre à jour l'état local immédiatement pour une meilleure UX
      setRecordings(prev => prev.filter(recording => recording.id !== recordingId));
      
      return { success: true, message: 'Enregistrement supprimé avec succès' };
      
    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error during deletion:', error);
      return { success: false, message: 'Une erreur inattendue est survenue lors de la suppression' };
    }
  };

  const getRecordingBlob = (recording: VoiceRecording): Blob => {
    try {
      console.log('🎵 [RECORDINGS] Converting recording to blob:', {
        id: recording.id,
        blobType: recording.blob_type,
        dataLength: recording.blob_data?.length || 0
      });
      
      if (!recording.blob_data) {
        throw new Error('Pas de données audio disponibles');
      }
      
      // Decode base64 to binary
      const binaryString = atob(recording.blob_data);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: recording.blob_type || 'audio/webm' });
      
      console.log('✅ [RECORDINGS] Blob created successfully:', {
        size: blob.size,
        type: blob.type
      });
      
      return blob;
    } catch (error) {
      console.error('❌ [RECORDINGS] Error converting recording to blob:', error);
      throw new Error('Impossible de lire l\'enregistrement: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  // Cleanup old recordings (older than 7 days)
  const cleanupOldRecordings = async () => {
    if (!user) return;
    
    try {
      console.log('🧹 [RECORDINGS] Cleaning up old recordings...');
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { error: deleteError } = await supabase
        .from('voice_recordings')
        .delete()
        .eq('user_id', user.id)
        .lt('created_at', sevenDaysAgo.toISOString());

      if (deleteError) {
        console.error('❌ [RECORDINGS] Error during cleanup:', deleteError);
      } else {
        console.log('✅ [RECORDINGS] Old recordings cleaned up successfully');
      }
      
    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error during cleanup:', error);
    }
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
