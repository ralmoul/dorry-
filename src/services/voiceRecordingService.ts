
import { supabase } from '@/integrations/supabase/client';
import { VoiceRecording } from '@/types/auth';

export class VoiceRecordingService {
  static async loadRecordings(userId: string): Promise<VoiceRecording[]> {
    console.log('📊 [RECORDINGS] Loading recordings from Supabase...');
    
    const { data: recordingsData, error: fetchError } = await supabase
      .from('voice_recordings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ [RECORDINGS] Error loading recordings:', fetchError);
      throw new Error('Impossible de charger les enregistrements');
    }
    
    console.log('✅ [RECORDINGS] Recordings loaded:', recordingsData?.length || 0);
    return recordingsData || [];
  }

  static async saveRecording(
    userId: string,
    audioBlob: Blob,
    duration: number,
    name?: string
  ): Promise<{ success: boolean; message?: string }> {
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
        user_id: userId,
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
  }

  static async updateRecordingName(
    recordingId: string,
    userId: string,
    newName: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('✏️ [RECORDINGS] Updating recording name:', recordingId);
      
      const { error: updateError } = await supabase
        .from('voice_recordings')
        .update({ 
          name: newName.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordingId)
        .eq('user_id', userId);

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
  }

  static async deleteRecording(
    recordingId: string,
    userId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('🗑️ [RECORDINGS] Deleting recording:', recordingId);
      
      const { error: deleteError } = await supabase
        .from('voice_recordings')
        .delete()
        .eq('id', recordingId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('❌ [RECORDINGS] Error deleting recording:', deleteError);
        return { success: false, message: 'Erreur lors de la suppression' };
      }

      console.log('✅ [RECORDINGS] Recording deleted successfully');
      return { success: true, message: 'Enregistrement supprimé avec succès' };
      
    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error:', error);
      return { success: false, message: 'Une erreur inattendue est survenue' };
    }
  }

  static async cleanupOldRecordings(userId: string): Promise<void> {
    try {
      console.log('🧹 [RECORDINGS] Cleaning up old recordings...');
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { error: deleteError } = await supabase
        .from('voice_recordings')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', sevenDaysAgo.toISOString());

      if (deleteError) {
        console.error('❌ [RECORDINGS] Error during cleanup:', deleteError);
      } else {
        console.log('✅ [RECORDINGS] Old recordings cleaned up successfully');
      }
      
    } catch (error) {
      console.error('💥 [RECORDINGS] Unexpected error during cleanup:', error);
    }
  }
}
