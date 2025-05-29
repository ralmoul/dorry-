
import { MIME_TYPES } from './constants';
import { PlatformInfo } from './platformDetection';

export interface AudioProcessingResult {
  finalAudioBlob: Blob;
  fileExtension: string;
  finalMimeType: string;
}

export const processAudioBlob = (audioBlob: Blob, platformInfo: PlatformInfo): AudioProcessingResult => {
  const { isIOS, isAndroid, platform } = platformInfo;
  
  let finalAudioBlob = audioBlob;
  let fileExtension = 'ogg';
  let finalMimeType = MIME_TYPES.OGG;
  
  if (isIOS) {
    if (audioBlob.type.includes('mp4') || audioBlob.type.includes('aac')) {
      fileExtension = 'mp4';
      finalMimeType = audioBlob.type || MIME_TYPES.MP4;
      console.log('🍎 [WEBHOOK] Conservation du format iOS natif:', finalMimeType);
    } else {
      finalAudioBlob = new Blob([audioBlob], { type: MIME_TYPES.OGG });
      console.log('🍎 [WEBHOOK] Conversion iOS vers OGG/Opus');
    }
  } else if (isAndroid) {
    if (audioBlob.type.includes('webm')) {
      fileExtension = 'webm';
      finalMimeType = audioBlob.type || MIME_TYPES.WEBM;
      console.log('🤖 [WEBHOOK] Conservation du format Android natif:', finalMimeType);
    } else if (audioBlob.type.includes('ogg')) {
      fileExtension = 'ogg';
      finalMimeType = audioBlob.type || MIME_TYPES.OGG;
      console.log('🤖 [WEBHOOK] Conservation du format Android OGG:', finalMimeType);
    } else {
      finalAudioBlob = new Blob([audioBlob], { type: MIME_TYPES.WEBM });
      fileExtension = 'webm';
      finalMimeType = MIME_TYPES.WEBM;
      console.log('🤖 [WEBHOOK] Conversion Android vers WebM/Opus');
    }
  } else {
    if (!audioBlob.type.includes('ogg')) {
      finalAudioBlob = new Blob([audioBlob], { type: MIME_TYPES.OGG });
      console.log('💻 [WEBHOOK] Conversion Desktop vers OGG/Opus');
    } else {
      finalMimeType = audioBlob.type;
      console.log('💻 [WEBHOOK] Conservation du format Desktop OGG');
    }
  }
  
  console.log('🎙️ [WEBHOOK] Format final:', {
    mimeType: finalMimeType,
    extension: fileExtension,
    size: finalAudioBlob.size,
    platform
  });
  
  return { finalAudioBlob, fileExtension, finalMimeType };
};

export const createFileName = (platform: string, propertyId: string, extension: string): string => {
  return `recording_${platform.toLowerCase()}_${propertyId}_${Date.now()}.${extension}`;
};

export const createBackupDownload = (audioBlob: Blob, platform: string, propertyId: string): void => {
  try {
    const localFileExtension = audioBlob.type.includes('ogg') ? 'ogg' : 
                               audioBlob.type.includes('webm') ? 'webm' : 
                               audioBlob.type.includes('mp4') ? 'mp4' : 'wav';
    
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log('💾 [WEBHOOK] Audio sauvegardé localement pour', platform, '- URL:', audioUrl);
    
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `recording_backup_${platform.toLowerCase()}_${propertyId}_${Date.now()}.${localFileExtension}`;
    console.log('⬇️ [WEBHOOK] Lien de téléchargement créé:', a.download);
  } catch (saveError) {
    console.error('💥 [WEBHOOK] Impossible de sauvegarder localement:', saveError);
  }
};
