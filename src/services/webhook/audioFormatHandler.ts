
import { MIME_TYPES } from './constants';
import { detectPlatform } from './platformDetection';

export const determineAudioFormat = (audioBlob: Blob): {
  mimeType: string;
  extension: string;
} => {
  const platform = detectPlatform();
  let mimeType: string;
  let extension: string;

  if (platform.isIOS) {
    // iOS préfère généralement MP4/AAC
    if (audioBlob.type.includes('mp4') || audioBlob.type.includes('aac')) {
      mimeType = audioBlob.type;
      extension = audioBlob.type.includes('mp4') ? 'mp4' : 'aac';
    } else {
      mimeType = MIME_TYPES.MP4;
      extension = 'mp4';
    }
  } else if (platform.isAndroid) {
    // Android supporte bien WebM
    if (audioBlob.type.includes('webm')) {
      mimeType = audioBlob.type;
      extension = 'webm';
    } else if (audioBlob.type.includes('ogg')) {
      mimeType = audioBlob.type;
      extension = 'ogg';
    } else {
      mimeType = MIME_TYPES.WEBM;
      extension = 'webm';
    }
  } else {
    // Desktop - préférence pour OGG ou WebM
    if (audioBlob.type.includes('ogg')) {
      mimeType = audioBlob.type;
      extension = 'ogg';
    } else if (audioBlob.type.includes('webm')) {
      mimeType = audioBlob.type;
      extension = 'webm';
    } else {
      mimeType = MIME_TYPES.OGG;
      extension = 'ogg';
    }
  }

  console.log('🎵 [WEBHOOK] Format audio déterminé:', {
    platform: platform.platform,
    originalType: audioBlob.type,
    finalMimeType: mimeType,
    extension
  });

  return { mimeType, extension };
};

export const processAudioBlob = (audioBlob: Blob, platformInfo: any) => {
  const { mimeType, extension } = determineAudioFormat(audioBlob);
  
  console.log('🔄 [WEBHOOK] Traitement du blob audio:', {
    originalSize: audioBlob.size,
    originalType: audioBlob.type,
    finalMimeType: mimeType,
    extension,
    platform: platformInfo.platform
  });
  
  return {
    finalAudioBlob: audioBlob,
    fileExtension: extension,
    finalMimeType: mimeType
  };
};

export const createFileName = (platform: string, propertyId: string, extension: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `audio_${platform}_${propertyId}_${timestamp}.${extension}`;
  
  console.log('📝 [WEBHOOK] Nom de fichier créé:', fileName);
  
  return fileName;
};

export const createBackupDownload = (audioBlob: Blob, platform: string, propertyId: string) => {
  try {
    const { extension } = determineAudioFormat(audioBlob);
    const fileName = createFileName(platform, propertyId, extension);
    
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('💾 [WEBHOOK] Sauvegarde locale créée:', fileName);
  } catch (error) {
    console.error('❌ [WEBHOOK] Erreur lors de la sauvegarde locale:', error);
  }
};
