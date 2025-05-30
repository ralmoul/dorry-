
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecording {
  id: string;
  name: string | null;
  original_name: string | null;
  duration: number;
  created_at: string;
  updated_at: string;
  blob_data: string;
  blob_type: string;
  status: 'active' | 'deleted';
  file_size: number | null;
  transcription: string | null;
}

export const useVoiceRecordings = () => {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

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

    console.log('📡 [RECORDINGS] Setting up realtime subscription for user:', user.id);
    
    const channel = supabase
      .channel(`user-recordings-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voice_recordings',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📡 [RECORDINGS] Realtime update:', payload);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleRealtimeUpdate = (payload: any) => {
    switch (payload.eventType) {
      case 'INSERT':
        if (payload.new.status === 'active') {
          setRecordings(prev => [payload.new, ...prev]);
          toast({
            title: "Nouvel enregistrement",
            description: "Votre enregistrement a été sauvegardé",
          });
        }
        break;
        
      case 'UPDATE':
        setRecordings(prev => prev.map(recording => 
          recording.id === payload.new.id ? payload.new : recording
        ).filter(recording => recording.status === 'active'));
        break;
        
      case 'DELETE':
        setRecordings(prev => prev.filter(recording => recording.id !== payload.old.id));
        toast({
          title: "Enregistrement supprimé",
          description: "L'enregistrement a été supprimé de votre historique",
          variant: "destructive",
        });
        break;
    }
  };

  const loadRecordings = async () => {
    if (!user) return;

    try {
      console.log('📊 [RECORDINGS] Loading recordings for user:', user.id);
      setIsLoading(true);

      const { data, error } = await supabase
        .from('voice_recordings')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [RECORDINGS] Error loading recordings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos enregistrements",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ [RECORDINGS] Recordings loaded:', data?.length || 0);
      setRecordings(data || []);

    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecording = async (
    audioBlob: Blob,
    duration: number,
    name?: string
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('💾 [RECORDINGS] Saving recording for user:', user.id);

      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64String = btoa(String.fromCharCode(...uint8Array));

      const recordingData = {
        user_id: user.id,
        name: name || null,
        original_name: name || `Enregistrement du ${new Date().toLocaleDateString('fr-FR')}`,
        duration: Math.round(duration),
        blob_data: base64String,
        blob_type: audioBlob.type,
        file_size: audioBlob.size,
        status: 'active'
      };

      const { error } = await supabase
        .from('voice_recordings')
        .insert([recordingData]);

      if (error) {
        console.error('❌ [RECORDINGS] Error saving recording:', error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder l'enregistrement",
          variant: "destructive"
        });
        return false;
      }

      console.log('✅ [RECORDINGS] Recording saved successfully');
      return true;

    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive"
      });
      return false;
    }
  };

  const renameRecording = async (recordingId: string, newName: string): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('✏️ [RECORDINGS] Renaming recording:', recordingId, 'to:', newName);

      const { error } = await supabase
        .from('voice_recordings')
        .update({ 
          name: newName,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordingId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ [RECORDINGS] Error renaming recording:', error);
        toast({
          title: "Erreur",
          description: "Impossible de renommer l'enregistrement",
          variant: "destructive"
        });
        return false;
      }

      console.log('✅ [RECORDINGS] Recording renamed successfully');
      toast({
        title: "Enregistrement renommé",
        description: `Nouveau nom: ${newName}`,
      });
      return true;

    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error:', error);
      return false;
    }
  };

  const deleteRecording = async (recordingId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('🗑️ [RECORDINGS] Deleting recording:', recordingId);

      const { error } = await supabase
        .from('voice_recordings')
        .update({ 
          status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('id', recordingId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ [RECORDINGS] Error deleting recording:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'enregistrement",
          variant: "destructive"
        });
        return false;
      }

      console.log('✅ [RECORDINGS] Recording deleted successfully');
      return true;

    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error:', error);
      return false;
    }
  };

  const getRecordingBlob = (recording: VoiceRecording): Blob | null => {
    try {
      const binaryString = atob(recording.blob_data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: recording.blob_type });
    } catch (error) {
      console.error('❌ [RECORDINGS] Error converting blob:', error);
      return null;
    }
  };

  // Cleanup old recordings (7 days)
  const cleanupOldRecordings = async (): Promise<void> => {
    try {
      const { error } = await supabase.rpc('cleanup_old_recordings');
      if (error) {
        console.error('❌ [RECORDINGS] Error cleaning up old recordings:', error);
      } else {
        console.log('🧹 [RECORDINGS] Old recordings cleaned up');
      }
    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error during cleanup:', error);
    }
  };

  return {
    recordings,
    isLoading,
    saveRecording,
    renameRecording,
    deleteRecording,
    getRecordingBlob,
    loadRecordings,
    cleanupOldRecordings,
  };
};
