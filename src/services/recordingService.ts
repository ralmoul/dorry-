
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
    
    // Vérifier que l'utilisateur est connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ [RECORDING_SERVICE] Utilisateur non connecté:', userError);
      throw new Error('Utilisateur non connecté');
    }
    
    console.log('👤 [RECORDING_SERVICE] Utilisateur connecté:', user.id);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    console.log('📅 [RECORDING_SERVICE] Recherche depuis:', sevenDaysAgo.toISOString());
    
    const { data, error } = await supabase
      .from('voice_recordings')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ [RECORDING_SERVICE] Erreur lors de la récupération:', error);
      console.error('❌ [RECORDING_SERVICE] Détails de l\'erreur:', JSON.stringify(error, null, 2));
      throw error;
    }
    
    console.log('✅ [RECORDING_SERVICE] Enregistrements récupérés:', data?.length || 0);
    console.log('📊 [RECORDING_SERVICE] Données récupérées:', data);
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
      console.error('❌ [RECORDING_SERVICE] Utilisateur non connecté pour la sauvegarde:', userError);
      throw new Error('Utilisateur non connecté');
    }
    
    console.log('👤 [RECORDING_SERVICE] Sauvegarde pour utilisateur:', user.id);
    console.log('📝 [RECORDING_SERVICE] Données à sauvegarder:', {
      name: recording.name || null,
      duration: recording.duration,
      blob_size: recording.blob_data.length,
      blob_type: recording.blob_type,
      user_id: user.id,
    });
    
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
      console.error('❌ [RECORDING_SERVICE] Détails de l\'erreur:', JSON.stringify(error, null, 2));
      console.error('❌ [RECORDING_SERVICE] Données tentées:', {
        name: recording.name || null,
        duration: recording.duration,
        blob_data_length: recording.blob_data.length,
        blob_type: recording.blob_type,
        user_id: user.id,
      });
      throw error;
    }
    
    console.log('✅ [RECORDING_SERVICE] Enregistrement sauvegardé avec succès:', data.id);
    console.log('📊 [RECORDING_SERVICE] Données sauvegardées:', data);
    return data;
  },

  // Mettre à jour le nom d'un enregistrement
  async updateRecordingName(id: string, name: string): Promise<void> {
    console.log('✏️ [RECORDING_SERVICE] Mise à jour du nom:', id);
    
    // Vérifier que l'utilisateur est connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ [RECORDING_SERVICE] Utilisateur non connecté:', userError);
      throw new Error('Utilisateur non connecté');
    }
    
    const { error } = await supabase
      .from('voice_recordings')
      .update({ name })
      .eq('id', id)
      .eq('user_id', user.id); // S'assurer que l'utilisateur ne peut modifier que ses propres enregistrements
    
    if (error) {
      console.error('❌ [RECORDING_SERVICE] Erreur lors de la mise à jour:', error);
      throw error;
    }
    
    console.log('✅ [RECORDING_SERVICE] Nom mis à jour');
  },

  // Supprimer un enregistrement
  async deleteRecording(id: string): Promise<void> {
    console.log('🗑️ [RECORDING_SERVICE] Suppression de l\'enregistrement:', id);
    
    // Vérifier que l'utilisateur est connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ [RECORDING_SERVICE] Utilisateur non connecté:', userError);
      throw new Error('Utilisateur non connecté');
    }
    
    const { error } = await supabase
      .from('voice_recordings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // S'assurer que l'utilisateur ne peut supprimer que ses propres enregistrements
    
    if (error) {
      console.error('❌ [RECORDING_SERVICE] Erreur lors de la suppression:', error);
      throw error;
    }
    
    console.log('✅ [RECORDING_SERVICE] Enregistrement supprimé');
  }
};
