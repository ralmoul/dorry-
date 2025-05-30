
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Cookie, Shield, BarChart3, Palette, Target, RotateCcw } from 'lucide-react';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';

export const CookieManager = () => {
  const { preferences, saveCustomPreferences, resetConsent } = useCookieConsent();
  const [tempPreferences, setTempPreferences] = React.useState<CookiePreferences>(preferences);

  React.useEffect(() => {
    setTempPreferences(preferences);
  }, [preferences]);

  const handleTempChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Les cookies nécessaires ne peuvent pas être désactivés
    
    setTempPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    saveCustomPreferences(tempPreferences);
  };

  const handleReset = () => {
    resetConsent();
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <Cookie className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold text-white">Gestion des cookies</h3>
      </div>

      <div className="space-y-4 mb-6">
        {/* Cookies nécessaires */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
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
                Essentiels pour la sécurité, l'authentification et le fonctionnement de base.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies analytics */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
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
                Statistiques d'utilisation pour améliorer l'expérience.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies personnalisation */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
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
                Préférences d'interface et paramètres personnalisés.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies marketing */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
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
                Contenu personnalisé et publicités pertinentes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          Enregistrer les préférences
        </Button>
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        Vos préférences sont sauvegardées localement et peuvent être modifiées à tout moment.
      </p>
    </div>
  );
};
