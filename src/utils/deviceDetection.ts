
export interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  platform: 'iOS' | 'Android' | 'Mobile' | 'Desktop';
}

export const detectDevice = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  
  // Détection iOS améliorée
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Détection Android améliorée
  const isAndroid = /Android/.test(userAgent);
  
  // Détection mobile améliorée
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent) || 
                   ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0) ||
                   window.innerWidth <= 768;
  
  const platform = isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop';
  
  return { isMobile, isIOS, isAndroid, platform };
};
