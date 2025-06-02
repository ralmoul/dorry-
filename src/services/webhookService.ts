
import { User } from '@/types/auth';
import { WEBHOOK_URL, AUDIO_LIMITS } from './webhook/constants';
import { detectPlatform, getApplicationId } from './webhook/platformDetection';
import { processAudioBlob, createFileName } from './webhook/audioFormatHandler';
import { validateUser, validateWebhookUrl, validateAudioFile } from './webhook/validation';
import { buildFormData } from './webhook/formDataBuilder';

// Interface pour les données webhook (legacy - à supprimer dans une future version)
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

// Fonction legacy pour compatibilité (à supprimer dans une future version)
export const sendToWebhook = async (data: WebhookData): Promise<boolean> => {
  try {
    console.log('📡 Envoi vers webhook avec:', {
      audioBlobSize: data.audioBlob.size,
      duration: data.duration,
      deviceInfo: data.deviceInfo,
      timestamp: data.timestamp
    });

    const mimeType = data.audioBlob.type;
    const extension = mimeType.includes('ogg') ? 'ogg' : 
                    mimeType.includes('webm') ? 'webm' : 
                    mimeType.includes('mp4') ? 'mp4' : 'wav';

    console.log(`🎵 Format audio détecté: ${mimeType}, extension: ${extension}`);

    const formData = new FormData();
    formData.append('audio', data.audioBlob, `recording.${extension}`);
    formData.append('duration', data.duration.toString());
    formData.append('deviceInfo', JSON.stringify(data.deviceInfo));
    formData.append('timestamp', data.timestamp);

    console.log('📦 FormData créé avec les champs:', Array.from(formData.keys()));

    const response = await fetch(WEBHOOK_URL, {
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

export const sendAudioToWebhook = async (audioBlob: Blob, user: User | null) => {
  console.log('🚀 [WEBHOOK] DÉBUT - URL utilisée:', WEBHOOK_URL);
  console.log('🚀 [WEBHOOK] DÉBUT - Taille audio:', audioBlob.size, 'bytes');
  console.log('🚀 [WEBHOOK] DÉBUT - Type audio original:', audioBlob.type);
  console.log('🚀 [WEBHOOK] DÉBUT - Utilisateur:', user?.email || 'non connecté');
  
  // Validations
  validateUser(user);
  validateWebhookUrl();
  validateAudioFile(audioBlob);
  
  // Détection de la plateforme
  const platformInfo = detectPlatform();
  console.log('📱 [WEBHOOK] Plateforme détectée:', platformInfo.platform);
  
  // Obtenir les identifiants
  const applicationId = getApplicationId();
  const propertyId = user!.id;
  console.log('🆔 [WEBHOOK] ID de l\'application:', applicationId);
  console.log('🆔 [WEBHOOK] Property ID:', propertyId);
  console.log('👤 [WEBHOOK] Utilisateur connecté:', user!.email);
  
  try {
    // Traitement du format audio
    const { finalAudioBlob, fileExtension, finalMimeType } = processAudioBlob(audioBlob, platformInfo);
    
    // Création du nom de fichier
    const fileName = createFileName(platformInfo.platform, propertyId, fileExtension);
    console.log('📝 [WEBHOOK] Nom du fichier:', fileName);
    
    // Construction du FormData
    const formData = buildFormData(
      finalAudioBlob,
      fileName,
      applicationId,
      propertyId,
      user!,
      platformInfo.platform,
      finalMimeType,
      fileExtension,
      audioBlob.type || 'unknown'
    );

    console.log('🌐 [WEBHOOK] ENVOI vers:', WEBHOOK_URL);
    
    // Configuration du timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ [WEBHOOK] TIMEOUT après 30 secondes');
      controller.abort();
    }, AUDIO_LIMITS.TIMEOUT);

    // Envoi de la requête
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
        platform: platformInfo.platform,
        format: finalMimeType,
        size: finalAudioBlob.size,
        applicationId,
        property_id: propertyId
      });
      
      return { 
        success: true, 
        message: `Message vocal ${platformInfo.platform} transmis avec succès vers N8N`,
        response: responseData,
        url: WEBHOOK_URL,
        format: finalMimeType,
        platform: platformInfo.platform,
        applicationId,
        property_id: propertyId
      };
    } else {
      console.error('❌ [WEBHOOK] ERREUR HTTP:', {
        status: response.status,
        statusText: response.statusText,
        platform: platformInfo.platform,
        applicationId,
        property_id: propertyId
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
      platform: platformInfo.platform,
      originalType: audioBlob.type,
      size: audioBlob.size,
      applicationId,
      property_id: propertyId,
      error: error instanceof Error ? error.message : String(error)
    });
    
    let errorMessage = `Transmission impossible vers N8N depuis ${platformInfo.platform}.`;
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = `Timeout: La transmission ${platformInfo.platform} vers N8N a pris trop de temps.`;
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = `Erreur de connexion ${platformInfo.platform} vers N8N. Vérifiez votre connexion internet.`;
      } else if (error.message.includes('NetworkError')) {
        errorMessage = `Erreur réseau ${platformInfo.platform}. Le serveur N8N n'est peut-être pas accessible.`;
      } else {
        errorMessage = `Erreur N8N ${platformInfo.platform}: ${error.message}`;
      }
    }

    // Note: Removed automatic backup download - only log the error
    console.log('💾 [WEBHOOK] Échec de transmission - pas de sauvegarde automatique');

    throw new Error(errorMessage);
  } finally {
    console.log('🏁 [WEBHOOK] Processus terminé pour:', platformInfo.platform, 'vers', WEBHOOK_URL, 'avec property_id:', propertyId);
  }
};
