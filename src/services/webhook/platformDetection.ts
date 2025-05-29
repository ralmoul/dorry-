
export interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  platform: string;
}

export const detectPlatform = (): PlatformInfo => {
  const userAgent = navigator.userAgent;
  
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent) || 
                   ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0);
  
  const platform = isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop';
  
  return { isIOS, isAndroid, isMobile, platform };
};

export const getApplicationId = (): string => {
  try {
    const hostname = window.location.hostname;
    if (hostname.includes('lovableproject.com')) {
      const appId = hostname.split('.')[0];
      console.log('🆔 [WEBHOOK] ID Application détecté:', appId);
      return appId;
    }
    
    console.log('🆔 [WEBHOOK] URL locale détectée, utilisation de l\'ID par défaut');
    return 'localhost-dev';
  } catch (error) {
    console.error('❌ [WEBHOOK] Erreur lors de l\'extraction de l\'ID app:', error);
    return 'unknown-app';
  }
};
