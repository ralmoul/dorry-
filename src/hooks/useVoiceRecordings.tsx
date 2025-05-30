
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { recordingService, VoiceRecording } from '@/services/recordingService';

interface Recording {
  id: string;
  name: string;
  date: Date;
  duration: number;
  blob?: Blob;
  userId: string;
}

export const useVoiceRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Convertir base64 en blob
  const base64ToBlob = useCallback((base64: string, type: string): Blob => {
    try {
      if (!base64 || typeof base64 !== 'string') {
        throw new Error('Base64 data is invalid or empty');
      }
      
      if (!type || typeof type !== 'string') {
        throw new Error('MIME type is invalid or empty');
      }

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type });
      
      if (!(blob instanceof Blob) || blob.size === 0) {
        throw new Error('Failed to create valid Blob object');
      }
      
      return blob;
    } catch (error) {
      console.error('❌ [VOICE_RECORDINGS] Erreur lors de la reconstitution du blob:', error);
      throw error;
    }
  }, []);

  // Convertir blob en base64
  const blobToBase64 = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Enlever le préfixe data:mime;base64,
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  // Charger les enregistrements depuis Supabase
  const loadRecordings = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      console.log('📂 [VOICE_RECORDINGS] Chargement des enregistrements...');
      const voiceRecordings = await recordingService.getUserRecordings();
      
      const recordingsWithBlobs = voiceRecordings.map((rec: VoiceRecording): Recording => {
        const recording: Recording = {
          id: rec.id,
          name: rec.name || '',
          date: new Date(rec.created_at),
          duration: rec.duration,
          userId: rec.user_id
        };

        if (rec.blob_data && rec.blob_type) {
          try {
            recording.blob = base64ToBlob(rec.blob_data, rec.blob_type);
          } catch (error) {
            console.error('❌ [VOICE_RECORDINGS] Échec reconstitution blob pour', rec.id, ':', error);
          }
        }

        return recording;
      });
      
      setRecordings(recordingsWithBlobs);
      console.log('✅ [VOICE_RECORDINGS] Enregistrements chargés:', recordingsWithBlobs.length);
    } catch (error) {
      console.error('❌ [VOICE_RECORDINGS] Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les enregistrements",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, base64ToBlob, toast]);

  // Ajouter un nouvel enregistrement
  const addRecording = useCallback(async (blob: Blob, duration: number) => {
    if (!user?.id) {
      console.error('❌ [VOICE_RECORDINGS] Pas d\'utilisateur connecté');
      return;
    }

    if (!blob || !(blob instanceof Blob) || blob.size === 0) {
      console.error('❌ [VOICE_RECORDINGS] Blob invalide');
      return;
    }

    try {
      console.log('💾 [VOICE_RECORDINGS] Ajout nouvel enregistrement...');
      const blobData = await blobToBase64(blob);
      
      const savedRecording = await recordingService.saveRecording({
        duration,
        blob_data: blobData,
        blob_type: blob.type
      });

      const newRecording: Recording = {
        id: savedRecording.id,
        name: '',
        date: new Date(savedRecording.created_at),
        duration: savedRecording.duration,
        blob,
        userId: savedRecording.user_id
      };

      setRecordings(prev => [newRecording, ...prev]);
      console.log('✅ [VOICE_RECORDINGS] Enregistrement ajouté');
    } catch (error) {
      console.error('❌ [VOICE_RECORDINGS] Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'enregistrement",
        variant: "destructive"
      });
    }
  }, [user?.id, blobToBase64, toast]);

  // Mettre à jour le nom d'un enregistrement
  const updateRecordingName = useCallback(async (id: string, name: string) => {
    try {
      await recordingService.updateRecordingName(id, name);
      setRecordings(prev => prev.map(rec => 
        rec.id === id ? { ...rec, name } : rec
      ));
      console.log('✅ [VOICE_RECORDINGS] Nom mis à jour');
    } catch (error) {
      console.error('❌ [VOICE_RECORDINGS] Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le nom",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Supprimer un enregistrement
  const deleteRecording = useCallback(async (id: string) => {
    try {
      await recordingService.deleteRecording(id);
      setRecordings(prev => prev.filter(rec => rec.id !== id));
      console.log('✅ [VOICE_RECORDINGS] Enregistrement supprimé');
      
      toast({
        title: "Enregistrement supprimé",
        description: "L'enregistrement a été supprimé avec succès"
      });
    } catch (error) {
      console.error('❌ [VOICE_RECORDINGS] Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'enregistrement",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Charger les enregistrements au montage et quand l'utilisateur change
  useEffect(() => {
    if (user?.id) {
      loadRecordings();
    } else {
      setRecordings([]);
    }
  }, [user?.id, loadRecordings]);

  return {
    recordings,
    isLoading,
    addRecording,
    updateRecordingName,
    deleteRecording,
    refreshRecordings: loadRecordings
  };
};
