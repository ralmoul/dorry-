
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
