
import { useState } from 'react';

export const useConsentManager = () => {
  const [showConsentModal, setShowConsentModal] = useState(false);

  const requestConsent = () => {
    console.log('🔒 [CONSENT] Demande de consentement...');
    setShowConsentModal(true);
  };

  const giveConsent = () => {
    console.log('✅ [CONSENT] Consentement accordé');
    setShowConsentModal(false);
  };

  const refuseConsent = () => {
    console.log('❌ [CONSENT] Consentement refusé');
    setShowConsentModal(false);
  };

  return {
    showConsentModal,
    requestConsent,
    giveConsent,
    refuseConsent
  };
};
