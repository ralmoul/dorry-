
import { DeviceInfo } from './deviceDetection';

export const getAudioConstraints = (deviceInfo: DeviceInfo): MediaStreamConstraints => {
  const { isIOS, isAndroid, isMobile } = deviceInfo;
  
  if (isIOS) {
    // Configuration spéciale pour iOS (Safari a des limitations)
    return {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 22050, // Réduction pour iOS
        channelCount: 1,
        volume: 1.0
      }
    };
  } else if (isAndroid) {
    // Configuration pour Android
    return {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
        channelCount: 1,
        volume: 1.0
      }
    };
  } else if (isMobile) {
    // Autres mobiles
    return {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 22050,
        channelCount: 1
      }
    };
  } else {
    // Desktop
    return {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: { ideal: 48000, min: 16000 },
        channelCount: { ideal: 2, min: 1 }
      }
    };
  }
};
