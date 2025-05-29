
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Mic } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onConsentGiven: () => void;
  onConsentRefused: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onConsentGiven,
  onConsentRefused
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleConsent = () => {
    if (isChecked) {
      onConsentGiven();
    }
  };

  const handleRefuse = () => {
    setIsChecked(false);
    onConsentRefused();
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setIsChecked(checked === true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Si l'utilisateur ferme le modal sans donner de consentement, on considère cela comme un refus
      handleRefuse();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[90vw] max-w-md mx-auto bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border border-cyan-400/30 text-white rounded-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🔒 Consentement à l'enregistrement vocal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
          <div className="text-center space-y-2 sm:space-y-3">
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">Avertir le porteur de projet que, pour offrir le meilleur service, Dorry doit enregistrer et analyser votre message vocal. Ces enregistrements servent uniquement à traiter votre demande et améliorer l'expérience utilisateur.</p>
            <p className="text-slate-300 text-xs sm:text-sm">
              Conformément au RGPD, vous êtes libre d'accepter ou de refuser.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-cyan-400/20">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="consent-checkbox" 
                checked={isChecked} 
                onCheckedChange={handleCheckboxChange}
                className="mt-1 border-cyan-400 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-slate-900" 
              />
              <label htmlFor="consent-checkbox" className="text-xs sm:text-sm text-slate-300 leading-relaxed cursor-pointer flex-1">
                Le porteur de projet et vous acceptez que le message soit enregistré et traité selon la{' '}
                <a href="/privacy-policy" target="_blank" className="text-cyan-400 hover:text-cyan-300 underline">
                  politique de confidentialité
                </a>.
              </label>
            </div>
          </div>

          <div className="flex flex-col space-y-2 sm:space-y-3">
            <Button onClick={handleConsent} disabled={!isChecked} className={`w-full py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${isChecked ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}>
              <Mic className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Je donne mon consentement
            </Button>
            
            <Button variant="outline" onClick={handleRefuse} className="w-full py-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-sm sm:text-base">
              Refuser
            </Button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            ⚡ Aucun enregistrement ne peut démarrer sans votre consentement explicite
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
