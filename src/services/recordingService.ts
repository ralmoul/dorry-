
import { supabase } from '@/integrations/supabase/client';

export interface VoiceRecording {
  id: string;
  user_id: string;
  name: string | null;
  duration: number;
  blob_data: string;
  blob_type: string;
  created_at: string;
  updated_at: string;
}

export const recordingService = {
  // Récupérer tous les enregistrements de l'utilisateur des 7 derniers jours
  async getUserRecordings(): Promise<VoiceRecording[]> {
    console.log('🔍 [RECORDING_SERVICE] Récupération des enregistrements utilisateur...');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data, error } = await supabase
      .from('voice_recordings')
      .select('*')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ [RECORDING_SERVICE] Erreur lors de la récupération:', error);
      throw error;
    }
    
    console.log('✅ [RECORDING_SERVICE] Enregistrements récupérés:', data?.length || 0);
    return data || [];
  },

  // Sauvegarder un nouvel enregistrement
  async saveRecording(recording: {
    name?: string;
    duration: number;
    blob_data: string;
    blob_type: string;
  }): Promise<VoiceRecording> {
    console.log('💾 [RECORDING_SERVICE] Sauvegarde d\'un nouvel enregistrement...');
    
    // Récupérer l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ [RECORDING_SERVICE] Utilisateur non connecté:', userError);
      throw new Error('Utilisateur non connecté');
    }
    
    const { data, error } = await supabase
      .from('voice_recordings')
      .insert({
        name: recording.name || null,
        duration: recording.duration,
        blob_data: recording.blob_data,
        blob_type: recording.blob_type,
        user_id: user.id,
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ [RECORDING_SERVICE] Erreur lors de la sauvegarde:', error);
      throw error;
    }
    
    console.log('✅ [RECORDING_SERVICE] Enregistrement sauvegardé:', data.id);
    return data;
  },

  // Mettre à jour le nom d'un enregistrement
  async updateRecordingName(id: string, name: string): Promise<void> {
    console.log('✏️ [RECORDING_SERVICE] Mise à jour du nom:', id);
    
    const { error } = await supabase
      .from('voice_recordings')
      .update({ name })
      .eq('id', id);
    
    if (error) {
      console.error('❌ [RECORDING_SERVICE] Erreur lors de la mise à jour:', error);
      throw error;
    }
    
    console.log('✅ [RECORDING_SERVICE] Nom mis à jour');
  },

  // Supprimer un enregistrement
  async deleteRecording(id: string): Promise<void> {
    console.log('🗑️ [RECORDING_SERVICE] Suppression de l\'enregistrement:', id);
    
    const { error } = await supabase
      .from('voice_recordings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ [RECORDING_SERVICE] Erreur lors de la suppression:', error);
      throw error;
    }
    
    console.log('✅ [RECORDING_SERVICE] Enregistrement supprimé');
  }
};
