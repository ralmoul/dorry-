
import { useState, useCallback } from 'react';
import { logConsentToDatabase } from '@/services/consentLogger';
import { useAuth } from '@/hooks/useAuth';

export const useConsentManager = () => {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const { user } = useAuth();

  const requestConsent = useCallback(() => {
    console.log('🔒 [CONSENT_MANAGER] Demande de consentement...');
    setShowConsentModal(true);
  }, []);

  const giveConsent = useCallback(async () => {
    console.log('✅ [CONSENT_MANAGER] Consentement donné par l\'utilisateur');
    setShowConsentModal(false);
    
    // Journaliser le consentement en base de données
    if (user?.id) {
      console.log('📝 [CONSENT_MANAGER] Logging du consentement pour l\'utilisateur:', user.id);
      
      const logResult = await logConsentToDatabase(user.id, true, 'voice_recording');
      
      if (logResult.success) {
        console.log('✅ [CONSENT_MANAGER] Consentement loggé avec succès dans la base');
      } else {
        console.error('❌ [CONSENT_MANAGER] Échec du logging du consentement:', logResult.error);
        // Note: on continue le flux même si le logging échoue pour ne pas bloquer l'utilisateur
      }
    } else {
      console.warn('⚠️ [CONSENT_MANAGER] Pas d\'utilisateur connecté, impossible de logger le consentement');
    }
  }, [user]);

  const refuseConsent = useCallback(async () => {
    console.log('❌ [CONSENT_MANAGER] Consentement refusé par l\'utilisateur');
    setShowConsentModal(false);
    
    // Journaliser le refus de consentement également pour traçabilité
    if (user?.id) {
      console.log('📝 [CONSENT_MANAGER] Logging du refus de consentement pour l\'utilisateur:', user.id);
      
      const logResult = await logConsentToDatabase(user.id, false, 'voice_recording');
      
      if (logResult.success) {
        console.log('✅ [CONSENT_MANAGER] Refus de consentement loggé avec succès');
      } else {
        console.error('❌ [CONSENT_MANAGER] Échec du logging du refus:', logResult.error);
      }
    }
  }, [user]);

  return {
    showConsentModal,
    requestConsent,
    giveConsent,
    refuseConsent
  };
};
