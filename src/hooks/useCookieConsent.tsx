
import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'dorry_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'dorry_cookie_preferences';

export const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours true car indispensables
    analytics: false,
    personalization: false,
    marketing: false
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentGiven) {
      setShowBanner(true);
    } else {
      // Charger les préférences existantes
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      personalization: true,
      marketing: true
    };
    
    setPreferences(allAccepted);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
    setShowBanner(false);
    
    // Activer tous les cookies autorisés
    applyCookiePreferences(allAccepted);
  };

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      personalization: false,
      marketing: false
    };
    
    setPreferences(onlyNecessary);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(onlyNecessary));
    setShowBanner(false);
    
    // N'activer que les cookies nécessaires
    applyCookiePreferences(onlyNecessary);
  };

  const saveCustomPreferences = (customPreferences: CookiePreferences) => {
    const finalPreferences = {
      ...customPreferences,
      necessary: true // Forcer necessary à true
    };
    
    setPreferences(finalPreferences);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(finalPreferences));
    setShowBanner(false);
    
    applyCookiePreferences(finalPreferences);
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    setShowBanner(true);
    setPreferences({
      necessary: true,
      analytics: false,
      personalization: false,
      marketing: false
    });
  };

  // Appliquer les préférences cookies (activer/désactiver les scripts tiers)
  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Analytics (ex: Google Analytics, etc.)
    if (prefs.analytics) {
      console.log('🍪 Analytics cookies enabled');
      // Ici on activerait Google Analytics ou autres outils de mesure
    } else {
      console.log('🚫 Analytics cookies disabled');
      // Ici on désactiverait/supprimerait les cookies analytics
    }

    // Personnalisation
    if (prefs.personalization) {
      console.log('🍪 Personalization cookies enabled');
      // Cookies pour mémoriser les préférences UI, langue, etc.
    } else {
      console.log('🚫 Personalization cookies disabled');
    }

    // Marketing
    if (prefs.marketing) {
      console.log('🍪 Marketing cookies enabled');
      // Cookies publicitaires, tracking, réseaux sociaux
    } else {
      console.log('🚫 Marketing cookies disabled');
    }
  };

  return {
    showBanner,
    preferences,
    acceptAll,
    rejectAll,
    saveCustomPreferences,
    resetConsent,
    setShowBanner
  };
};
