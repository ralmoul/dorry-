
import { DeviceInfo } from './deviceDetection';

export interface AudioFormat {
  mimeType: string;
  extension: string;
}

export const getSupportedAudioFormat = (deviceInfo: DeviceInfo): AudioFormat => {
  const { isIOS, isAndroid } = deviceInfo;
  
  // Formats par ordre de préférence selon la plateforme
  const formatsByPlatform = {
    ios: [
      { mimeType: 'audio/mp4', extension: 'mp4' },
      { mimeType: 'audio/aac', extension: 'aac' },
      { mimeType: 'audio/wav', extension: 'wav' },
      { mimeType: 'audio/webm;codecs=opus', extension: 'webm' },
      { mimeType: 'audio/webm', extension: 'webm' },
      { mimeType: 'audio/ogg;codecs=opus', extension: 'ogg' },
      { mimeType: 'audio/ogg', extension: 'ogg' }
    ],
    android: [
      { mimeType: 'audio/webm;codecs=opus', extension: 'webm' },
      { mimeType: 'audio/webm', extension: 'webm' },
      { mimeType: 'audio/ogg;codecs=opus', extension: 'ogg' },
      { mimeType: 'audio/ogg', extension: 'ogg' },
      { mimeType: 'audio/mp4', extension: 'mp4' },
      { mimeType: 'audio/wav', extension: 'wav' }
    ],
    desktop: [
      { mimeType: 'audio/ogg;codecs=opus', extension: 'ogg' },
      { mimeType: 'audio/webm;codecs=opus', extension: 'webm' },
      { mimeType: 'audio/webm', extension: 'webm' },
      { mimeType: 'audio/ogg', extension: 'ogg' },
      { mimeType: 'audio/mp4', extension: 'mp4' },
      { mimeType: 'audio/wav', extension: 'wav' }
    ]
  };

  let formats: AudioFormat[];
  if (isIOS) {
    formats = formatsByPlatform.ios;
    console.log('🍎 Utilisation des formats iOS');
  } else if (isAndroid) {
    formats = formatsByPlatform.android;
    console.log('🤖 Utilisation des formats Android');
  } else {
    formats = formatsByPlatform.desktop;
    console.log('💻 Utilisation des formats desktop');
  }

  // Test de compatibilité des formats
  for (const format of formats) {
    if (MediaRecorder.isTypeSupported(format.mimeType)) {
      console.log(`✅ Format sélectionné: ${format.mimeType}`);
      return format;
    } else {
      console.log(`❌ Format non supporté: ${format.mimeType}`);
    }
  }

  console.warn('⚠️ Aucun format préféré supporté, utilisation par défaut');
  return { mimeType: 'audio/webm', extension: 'webm' };
};

export const getRecorderOptions = (format: AudioFormat, isMobile: boolean, isIOS: boolean): MediaRecorderOptions => {
  const options: MediaRecorderOptions = {};
  
  if (format.mimeType) {
    options.mimeType = format.mimeType;
  }
  
  // Bitrate adaptatif selon la plateforme
  if (isMobile) {
    options.audioBitsPerSecond = isIOS ? 32000 : 48000; // Plus bas pour iOS
  } else {
    options.audioBitsPerSecond = 64000;
  }

  return options;
};

export const getChunkInterval = (deviceInfo: DeviceInfo): number => {
  const { isIOS, isAndroid, isMobile } = deviceInfo;
  
  if (isIOS) {
    return 1000; // Plus long pour iOS (stabilité)
  } else if (isAndroid) {
    return 750; // Moyen pour Android
  } else if (isMobile) {
    return 800; // Sécuritaire pour autres mobiles
  } else {
    return 1000; // Standard pour desktop
  }
};
