
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

const WEBHOOK_URL = 'https://n8n-4m8i.onrender.com/webhook-test/d4e8f563-b641-484a-8e40-8ef6564362f2';

interface WebhookData {
  audioBlob: Blob;
  duration: number;
  deviceInfo: {
    userAgent: string;
    isMobile: boolean;
    platform: string;
  };
  timestamp: string;
}

export const sendToWebhook = async (data: WebhookData): Promise<boolean> => {
  try {
    console.log('📡 Envoi vers webhook avec:', {
      audioBlobSize: data.audioBlob.size,
      duration: data.duration,
      deviceInfo: data.deviceInfo,
      timestamp: data.timestamp
    });

    // Déterminer l'extension basée sur le type MIME
    const mimeType = data.audioBlob.type;
    const extension = mimeType.includes('ogg') ? 'ogg' : 
                    mimeType.includes('webm') ? 'webm' : 
                    mimeType.includes('mp4') ? 'mp4' : 'wav';

    console.log(`🎵 Format audio détecté: ${mimeType}, extension: ${extension}`);

    // Créer le FormData
    const formData = new FormData();
    formData.append('audio', data.audioBlob, `recording.${extension}`);
    formData.append('duration', data.duration.toString());
    formData.append('deviceInfo', JSON.stringify(data.deviceInfo));
    formData.append('timestamp', data.timestamp);

    console.log('📦 FormData créé avec les champs:', Array.from(formData.keys()));

    const response = await fetch('https://hook.eu2.make.com/w6l4q86t46q78n8nfpwaxe3w1bi78wvi', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('❌ Erreur webhook:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('📄 Détails erreur:', errorText);
      throw new Error(`Erreur webhook: ${response.status}`);
    }

    const result = await response.text();
    console.log('✅ Réponse webhook:', result);
    return true;

  } catch (error) {
    console.error('💥 Erreur lors de l\'envoi vers le webhook:', error);
    return false;
  }
};

// Fonction pour extraire l'ID de l'application depuis l'URL
const getApplicationId = (): string => {
  try {
    // L'URL Lovable a le format: https://{app-id}.lovableproject.com
    const hostname = window.location.hostname;
    if (hostname.includes('lovableproject.com')) {
      const appId = hostname.split('.')[0];
      console.log('🆔 [WEBHOOK] ID Application détecté:', appId);
      return appId;
    }
    
    // Fallback pour les URLs localhost ou autres
    console.log('🆔 [WEBHOOK] URL locale détectée, utilisation de l\'ID par défaut');
    return 'localhost-dev';
  } catch (error) {
    console.error('❌ [WEBHOOK] Erreur lors de l\'extraction de l\'ID app:', error);
    return 'unknown-app';
  }
};

export const sendAudioToWebhook = async (audioBlob: Blob, user: User | null) => {
  console.log('🚀 [WEBHOOK] DÉBUT - URL utilisée:', WEBHOOK_URL);
  console.log('🚀 [WEBHOOK] DÉBUT - Taille audio:', audioBlob.size, 'bytes');
  console.log('🚀 [WEBHOOK] DÉBUT - Type audio original:', audioBlob.type);
  console.log('🚀 [WEBHOOK] DÉBUT - Utilisateur:', user?.email || 'non connecté');
  
  // Obtenir l'ID de l'application
  const applicationId = getApplicationId();
  console.log('🆔 [WEBHOOK] ID de l\'application:', applicationId);
  
  // Détection de la plateforme pour logging
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) || 
                   ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0);
  
  const platform = isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop';
  console.log('📱 [WEBHOOK] Plateforme détectée:', platform);
  
  // Vérification stricte de l'URL
  if (WEBHOOK_URL !== 'https://n8n-4m8i.onrender.com/webhook-test/d4e8f563-b641-484a-8e40-8ef6564362f2') {
    console.error('❌ [WEBHOOK] ERREUR CRITIQUE: URL incorrecte!');
    throw new Error('URL webhook incorrecte');
  }
  
  // Vérification de la taille du fichier
  if (audioBlob.size === 0) {
    console.error('❌ [WEBHOOK] ERREUR: Fichier audio vide!');
    throw new Error('Fichier audio vide - problème d\'enregistrement');
  }
  
  if (audioBlob.size > 25 * 1024 * 1024) { // 25MB limit
    console.error('❌ [WEBHOOK] ERREUR: Fichier trop volumineux:', audioBlob.size, 'bytes');
    throw new Error('Fichier audio trop volumineux (max 25MB)');
  }
  
  console.log('✅ [WEBHOOK] Taille du fichier validée');
  
  try {
    // Gestion intelligente du format selon la plateforme
    let finalAudioBlob = audioBlob;
    let fileExtension = 'ogg';
    let finalMimeType = 'audio/ogg;codecs=opus';
    
    // Adaptation du format selon la plateforme d'origine
    if (isIOS) {
      // iOS produit souvent du MP4/AAC
      if (audioBlob.type.includes('mp4') || audioBlob.type.includes('aac')) {
        fileExtension = 'mp4';
        finalMimeType = audioBlob.type || 'audio/mp4';
        console.log('🍎 [WEBHOOK] Conservation du format iOS natif:', finalMimeType);
      } else {
        // Force vers OGG pour compatibilité avec le backend
        finalAudioBlob = new Blob([audioBlob], { type: 'audio/ogg;codecs=opus' });
        console.log('🍎 [WEBHOOK] Conversion iOS vers OGG/Opus');
      }
    } else if (isAndroid) {
      // Android produit généralement du WebM/Opus ou OGG
      if (audioBlob.type.includes('webm')) {
        fileExtension = 'webm';
        finalMimeType = audioBlob.type || 'audio/webm;codecs=opus';
        console.log('🤖 [WEBHOOK] Conservation du format Android natif:', finalMimeType);
      } else if (audioBlob.type.includes('ogg')) {
        fileExtension = 'ogg';
        finalMimeType = audioBlob.type || 'audio/ogg;codecs=opus';
        console.log('🤖 [WEBHOOK] Conservation du format Android OGG:', finalMimeType);
      } else {
        // Force vers WebM pour Android
        finalAudioBlob = new Blob([audioBlob], { type: 'audio/webm;codecs=opus' });
        fileExtension = 'webm';
        finalMimeType = 'audio/webm;codecs=opus';
        console.log('🤖 [WEBHOOK] Conversion Android vers WebM/Opus');
      }
    } else {
      // Desktop - force OGG/Opus comme demandé
      if (!audioBlob.type.includes('ogg')) {
        finalAudioBlob = new Blob([audioBlob], { type: 'audio/ogg;codecs=opus' });
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
    
    const formData = new FormData();
    
    // Créer un nom de fichier avec la bonne extension
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `recording_${platform.toLowerCase()}_${user?.id || 'unknown'}_${Date.now()}.${fileExtension}`;
    
    console.log('📝 [WEBHOOK] Nom du fichier:', fileName);
    
    // Ajouter tous les champs au FormData, y compris l'ID de l'application
    formData.append('audio', finalAudioBlob, fileName);
    formData.append('applicationId', applicationId);
    formData.append('userId', user?.id || 'unknown');
    formData.append('userEmail', user?.email || 'unknown');
    formData.append('userFirstName', user?.firstName || 'unknown');
    formData.append('userLastName', user?.lastName || 'unknown');
    formData.append('userCompany', user?.company || 'unknown');
    formData.append('timestamp', timestamp);
    formData.append('audioSize', finalAudioBlob.size.toString());
    formData.append('audioType', finalMimeType);
    formData.append('audioFormat', fileExtension);
    formData.append('platform', platform);
    formData.append('originalType', audioBlob.type || 'unknown');
    formData.append('userAgent', navigator.userAgent);

    console.log('📦 [WEBHOOK] FormData préparé avec ID app:', {
      applicationId,
      fileName,
      audioSize: finalAudioBlob.size,
      audioType: finalMimeType,
      audioFormat: fileExtension,
      platform,
      originalType: audioBlob.type,
      userId: user?.id || 'unknown',
      userEmail: user?.email || 'unknown'
    });

    console.log('🌐 [WEBHOOK] ENVOI vers:', WEBHOOK_URL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ [WEBHOOK] TIMEOUT après 30 secondes');
      controller.abort();
    }, 30000);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📨 [WEBHOOK] RÉPONSE reçue:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });

    if (response.ok) {
      let responseData;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('📋 [WEBHOOK] Réponse JSON:', responseData);
        } else {
          responseData = await response.text();
          console.log('📄 [WEBHOOK] Réponse texte:', responseData);
        }
      } catch (parseError) {
        console.log('⚠️ [WEBHOOK] Impossible de parser la réponse:', parseError);
        responseData = 'Réponse reçue mais non parsable';
      }
      
      console.log('✅ [WEBHOOK] SUCCÈS - Transmission réussie!', {
        platform,
        format: finalMimeType,
        size: finalAudioBlob.size,
        applicationId
      });
      
      return { 
        success: true, 
        message: `Message vocal ${platform} transmis avec succès vers N8N`,
        response: responseData,
        url: WEBHOOK_URL,
        format: finalMimeType,
        platform,
        applicationId
      };
    } else {
      console.error('❌ [WEBHOOK] ERREUR HTTP:', {
        status: response.status,
        statusText: response.statusText,
        platform,
        applicationId
      });
      
      let errorBody;
      try {
        errorBody = await response.text();
        console.error('📄 [WEBHOOK] Corps de l\'erreur:', errorBody);
      } catch (e) {
        console.error('⚠️ [WEBHOOK] Impossible de lire le corps de l\'erreur');
      }
      
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}${errorBody ? ' - ' + errorBody : ''}`);
    }
  } catch (error) {
    console.error('💥 [WEBHOOK] ERREUR CRITIQUE:', {
      platform,
      originalType: audioBlob.type,
      size: audioBlob.size,
      applicationId,
      error: error instanceof Error ? error.message : String(error)
    });
    
    let errorMessage = `Transmission impossible vers N8N depuis ${platform}.`;
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = `Timeout: La transmission ${platform} vers N8N a pris trop de temps.`;
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = `Erreur de connexion ${platform} vers N8N. Vérifiez votre connexion internet.`;
      } else if (error.message.includes('NetworkError')) {
        errorMessage = `Erreur réseau ${platform}. Le serveur N8N n'est peut-être pas accessible.`;
      } else {
        errorMessage = `Erreur N8N ${platform}: ${error.message}`;
      }
    }

    // Sauvegarder localement en cas d'échec - avec fileExtension défini correctement
    try {
      // Déterminer l'extension depuis le type MIME
      const localFileExtension = audioBlob.type.includes('ogg') ? 'ogg' : 
                                 audioBlob.type.includes('webm') ? 'webm' : 
                                 audioBlob.type.includes('mp4') ? 'mp4' : 'wav';
      
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('💾 [WEBHOOK] Audio sauvegardé localement pour', platform, '- URL:', audioUrl);
      
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording_backup_${platform.toLowerCase()}_${applicationId}_${Date.now()}.${localFileExtension}`;
      console.log('⬇️ [WEBHOOK] Lien de téléchargement créé:', a.download);
    } catch (saveError) {
      console.error('💥 [WEBHOOK] Impossible de sauvegarder localement:', saveError);
    }

    throw new Error(errorMessage);
  } finally {
    console.log('🏁 [WEBHOOK] Processus terminé pour:', platform, 'vers', WEBHOOK_URL, 'avec app ID:', applicationId);
  }
};
