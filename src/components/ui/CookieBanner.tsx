
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Cookie, Settings, Shield, BarChart3, Palette, Target } from 'lucide-react';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';

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

  const handleCustomize = () => {
    setTempPreferences(preferences);
    setShowSettings(true);
  };

  const handleSaveCustom = () => {
    saveCustomPreferences(tempPreferences);
    setShowSettings(false);
  };

  const handleTempChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Les cookies nécessaires ne peuvent pas être désactivés
    
    setTempPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Bannière principale */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-cyan-400/30 p-4 shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="text-white">
                <h3 className="font-semibold mb-1">🍪 Gestion des cookies</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience sur Dorry.app. 
                  Vous pouvez accepter tous les cookies, les refuser ou personnaliser vos préférences.
                  {' '}
                  <a href="/cookie-policy" target="_blank" className="text-cyan-400 hover:text-cyan-300 underline">
                    En savoir plus
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                onClick={rejectAll}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-sm"
              >
                Refuser tout
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCustomize}
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Personnaliser
              </Button>
              <Button 
                onClick={acceptAll}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm"
              >
                Accepter tout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de personnalisation */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="w-[90vw] max-w-2xl mx-auto bg-slate-900 border border-cyan-400/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-cyan-400 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Personnaliser les cookies
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <p className="text-slate-300 text-sm">
              Gérez vos préférences de cookies. Les cookies nécessaires sont requis pour le fonctionnement du site.
            </p>

            <div className="space-y-4">
              {/* Cookies nécessaires */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">Cookies nécessaires</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                          Toujours actifs
                        </span>
                        <Checkbox 
                          checked={true} 
                          disabled 
                          className="border-green-400 data-[state=checked]:bg-green-400" 
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Essentiels pour la sécurité, l'authentification et le fonctionnement de base du site.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies analytics */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">Cookies d'analyse</h4>
                      <Checkbox 
                        checked={tempPreferences.analytics} 
                        onCheckedChange={(checked) => handleTempChange('analytics', checked === true)}
                        className="border-blue-400 data-[state=checked]:bg-blue-400" 
                      />
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Nous aident à comprendre comment vous utilisez le site pour l'améliorer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies personnalisation */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start gap-3">
                  <Palette className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">Cookies de personnalisation</h4>
                      <Checkbox 
                        checked={tempPreferences.personalization} 
                        onCheckedChange={(checked) => handleTempChange('personalization', checked === true)}
                        className="border-purple-400 data-[state=checked]:bg-purple-400" 
                      />
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Mémorisent vos préférences d'interface et améliorent votre expérience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies marketing */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">Cookies marketing</h4>
                      <Checkbox 
                        checked={tempPreferences.marketing} 
                        onCheckedChange={(checked) => handleTempChange('marketing', checked === true)}
                        className="border-orange-400 data-[state=checked]:bg-orange-400" 
                      />
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Permettent un contenu personnalisé et des publicités pertinentes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowSettings(false)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveCustom}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Enregistrer mes préférences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
