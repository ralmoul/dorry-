
import { VoiceRecording } from '@/types/auth';

export class VoiceRecordingUtils {
  static getRecordingBlob(recording: VoiceRecording): Blob {
    try {
      const binaryString = atob(recording.blob_data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: recording.blob_type });
    } catch (error) {
      console.error('❌ [RECORDINGS] Error converting recording to blob:', error);
      throw new Error('Impossible de lire l\'enregistrement');
    }
  }
}
