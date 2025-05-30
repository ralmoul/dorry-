
import { supabase } from '@/integrations/supabase/client';
import { ConsentLog, ConsentLogResponse } from '@/types/consent';

interface ConsentLogData {
  user_id: string;
  consent_type: string;
  consent_given: boolean;
  ip_address?: string;
  user_agent?: string;
  device_info?: any;
}

export const logConsentToDatabase = async (
  userId: string,
  consentGiven: boolean,
  consentType: string = 'voice_recording'
): Promise<ConsentLogResponse> => {
  try {
    console.log('🔒 [CONSENT_LOGGER] Logging consent to database:', {
      userId,
      consentGiven,
      consentType,
      timestamp: new Date().toISOString()
    });

    // Collecter les informations de device/browser pour traçabilité RGPD
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: new Date().toISOString()
    };

    // Préparer les données du log RGPD
    const logData: ConsentLogData = {
      user_id: userId,
      consent_type: consentType,
      consent_given: consentGiven,
      user_agent: navigator.userAgent,
      device_info: deviceInfo
    };

    // Note: L'IP pourrait être récupérée côté serveur avec une edge function
    // Pour la conformité RGPD, on log les métadonnées importantes

    // Insérer le log dans la base de données
    const { data, error } = await supabase
      .from('consent_logs')
      .insert([logData])
      .select();

    if (error) {
      console.error('❌ [CONSENT_LOGGER] Erreur lors de l\'insertion du log RGPD:', error);
      throw error;
    }

    console.log('✅ [CONSENT_LOGGER] Consentement RGPD loggé avec succès:', {
      logId: data?.[0]?.id,
      userId,
      consentGiven,
      timestamp: data?.[0]?.created_at
    });
    
    return { success: true, data: data as ConsentLog[] };

  } catch (error) {
    console.error('💥 [CONSENT_LOGGER] Erreur critique lors du logging RGPD:', error);
    // Ne pas bloquer le flux utilisateur en cas d'erreur de logging
    return { success: false, error };
  }
};

export const getConsentHistory = async (userId: string): Promise<ConsentLogResponse> => {
  try {
    console.log('📋 [CONSENT_LOGGER] Récupération de l\'historique RGPD pour:', userId);
    
    const { data, error } = await supabase
      .from('consent_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [CONSENT_LOGGER] Erreur lors de la récupération de l\'historique RGPD:', error);
      throw error;
    }

    console.log('✅ [CONSENT_LOGGER] Historique RGPD récupéré:', {
      userId,
      logsCount: data?.length || 0
    });

    return { success: true, data: data as ConsentLog[] };
  } catch (error) {
    console.error('💥 [CONSENT_LOGGER] Erreur lors de la récupération de l\'historique RGPD:', error);
    return { success: false, error };
  }
};
