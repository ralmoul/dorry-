
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Cookie, Settings, Shield, BarChart3, Palette, Target } from 'lucide-react';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';
import { useIsMobile } from '@/hooks/use-mobile';

export const CookieBanner = () => {
  const { 
    showBanner, 
    preferences, 
    acceptAll, 
    rejectAll, 
    saveCustomPreferences,
    setShowBanner 
  } = useCookieConsent();
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>(preferences);
  const isMobile = useIsMobile();

  const handleCustomize = () => {
    setTempPreferences(preferences);
    setShowSettings(true);
  };

  const handleSaveCustom = () => {
    saveCustomPreferences(tempPreferences);
    setShowSettings(false);
  };

  const handleTempChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return;
    
    setTempPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const CookieOptionsContent = () => (
    <div className="space-y-4 py-4">
      <p className="text-slate-300 text-sm">
        Gérez vos préférences de cookies. Les cookies nécessaires sont requis pour le fonctionnement du site.
      </p>

      <div className="space-y-3">
        {/* Cookies nécessaires */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-white text-sm">Cookies nécessaires</h4>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                    Actifs
                  </span>
                  <Checkbox 
                    checked={true} 
                    disabled 
                    className="border-green-400 data-[state=checked]:bg-green-400 h-4 w-4" 
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Essentiels pour la sécurité et le fonctionnement de base.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies analytics */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-start gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-white text-sm">Cookies d'analyse</h4>
                <Checkbox 
                  checked={tempPreferences.analytics} 
                  onCheckedChange={(checked) => handleTempChange('analytics', checked === true)}
                  className="border-blue-400 data-[state=checked]:bg-blue-400 h-4 w-4 flex-shrink-0" 
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Nous aident à comprendre l'utilisation du site.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies personnalisation */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-start gap-2">
            <Palette className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-white text-sm">Cookies de personnalisation</h4>
                <Checkbox 
                  checked={tempPreferences.personalization} 
                  onCheckedChange={(checked) => handleTempChange('personalization', checked === true)}
                  className="border-purple-400 data-[state=checked]:bg-purple-400 h-4 w-4 flex-shrink-0" 
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Mémorisent vos préférences d'interface.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies marketing */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-orange-400 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-white text-sm">Cookies marketing</h4>
                <Checkbox 
                  checked={tempPreferences.marketing} 
                  onCheckedChange={(checked) => handleTempChange('marketing', checked === true)}
                  className="border-orange-400 data-[state=checked]:bg-orange-400 h-4 w-4 flex-shrink-0" 
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Contenu personnalisé et publicités pertinentes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button 
          onClick={handleSaveCustom}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm"
        >
          Enregistrer mes préférences
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowSettings(false)}
          className="border-slate-600 text-slate-300 hover:bg-slate-800 text-sm"
        >
          Annuler
        </Button>
      </div>
    </div>
  );

  if (!showBanner) return null;

  return (
    <>
      {/* Bannière principale */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-cyan-400/30 p-3 md:p-4 shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="flex items-start gap-2 md:gap-3 flex-1">
              <Cookie className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 flex-shrink-0 mt-0.5 md:mt-1" />
              <div className="text-white min-w-0">
                <h3 className="font-semibold text-sm md:text-base mb-1">🍪 Gestion des cookies</h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience sur Dorry.app.
                  {' '}
                  <a href="/cookie-policy" target="_blank" className="text-cyan-400 hover:text-cyan-300 underline">
                    En savoir plus
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                onClick={rejectAll}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-xs md:text-sm px-3 py-2"
              >
                Refuser
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCustomize}
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 text-xs md:text-sm px-3 py-2"
              >
                <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                Préférences
              </Button>
              <Button 
                onClick={acceptAll}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs md:text-sm px-3 py-2"
              >
                Accepter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal/Drawer de personnalisation */}
      {isMobile ? (
        <Drawer open={showSettings} onOpenChange={setShowSettings}>
          <DrawerContent className="bg-slate-900 border-cyan-400/30 text-white max-h-[85vh]">
            <DrawerHeader className="px-4 py-3">
              <DrawerTitle className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Préférences cookies
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4 overflow-y-auto">
              <CookieOptionsContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="w-[90vw] max-w-2xl mx-auto bg-slate-900 border border-cyan-400/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Personnaliser les cookies
              </DialogTitle>
            </DialogHeader>
            <CookieOptionsContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
