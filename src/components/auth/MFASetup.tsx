
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mfaService } from '@/services/mfaService';
import { useAuth } from '@/hooks/useAuth';

interface MFASetupProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export const MFASetup: React.FC<MFASetupProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState<'method' | 'setup' | 'verify'>('method');
  const [method, setMethod] = useState<'totp' | 'email'>('totp');
  const [totpSecret, setTotpSecret] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleMethodSelection = (selectedMethod: 'totp' | 'email') => {
    setMethod(selectedMethod);
    setStep('setup');
    
    if (selectedMethod === 'totp') {
      const { secret, qrCodeUrl } = mfaService.generateTOTPSecret();
      setTotpSecret(secret);
      setQrCodeUrl(qrCodeUrl);
    }
  };

  const handleVerification = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let isValid = false;
      
      if (method === 'totp') {
        isValid = mfaService.verifyTOTPCode(totpSecret, verificationCode);
      } else {
        // Pour l'email, on simule la vérification
        isValid = verificationCode === '123456'; // Code de test
      }
      
      if (!isValid) {
        toast({
          title: "Code incorrect",
          description: "Le code de vérification est incorrect. Veuillez réessayer.",
          variant: "destructive"
        });
        return;
      }
      
      // Activer la MFA
      const success = await mfaService.enableMFA(
        user.id,
        method,
        method === 'totp' ? totpSecret : undefined
      );
      
      if (success) {
        // Générer les codes de récupération
        const codes = mfaService.generateBackupCodes();
        setBackupCodes(codes);
        
        toast({
          title: "MFA activée",
          description: "L'authentification multifacteur a été activée avec succès.",
        });
        
        setStep('verify');
      } else {
        throw new Error('Erreur lors de l\'activation de la MFA');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation de la MFA.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete?.();
  };

  const renderMethodSelection = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Choisir une méthode MFA</CardTitle>
        <CardDescription>
          Sélectionnez votre méthode d'authentification multifacteur préférée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-20 flex flex-col space-y-2"
          onClick={() => handleMethodSelection('totp')}
        >
          <span className="font-semibold">Application d'authentification</span>
          <span className="text-sm text-gray-500">Google Authenticator, Authy, etc.</span>
        </Button>
        
        <Button
          variant="outline"
          className="w-full h-20 flex flex-col space-y-2"
          onClick={() => handleMethodSelection('email')}
        >
          <span className="font-semibold">Code par email</span>
          <span className="text-sm text-gray-500">Recevoir un code par email</span>
        </Button>
        
        {onSkip && (
          <Button variant="ghost" onClick={onSkip} className="w-full">
            Ignorer pour le moment
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const renderTOTPSetup = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configuration TOTP</CardTitle>
        <CardDescription>
          Scannez le QR code avec votre application d'authentification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code simulation */}
        <div className="bg-white p-4 rounded-lg text-center">
          <div className="bg-black text-white p-8 rounded text-xs font-mono break-all">
            {qrCodeUrl}
          </div>
          <p className="text-xs text-gray-500 mt-2">QR Code (en production, afficher un vrai QR code)</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secret">Ou entrez manuellement ce secret:</Label>
          <Input
            id="secret"
            value={totpSecret}
            readOnly
            className="font-mono text-xs"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="verification">Code de vérification (6 chiffres)</Label>
          <Input
            id="verification"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setStep('method')} className="flex-1">
            Retour
          </Button>
          <Button 
            onClick={handleVerification} 
            disabled={verificationCode.length !== 6 || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Vérification...' : 'Vérifier'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmailSetup = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configuration Email</CardTitle>
        <CardDescription>
          Entrez le code de vérification envoyé à votre email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Un code de vérification a été envoyé à votre adresse email.
          <br />
          <strong>Pour cette démo, utilisez le code: 123456</strong>
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="verification">Code de vérification (6 chiffres)</Label>
          <Input
            id="verification"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setStep('method')} className="flex-1">
            Retour
          </Button>
          <Button 
            onClick={handleVerification} 
            disabled={verificationCode.length !== 6 || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Vérification...' : 'Vérifier'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderBackupCodes = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Codes de récupération</CardTitle>
        <CardDescription>
          Sauvegardez ces codes en lieu sûr. Ils vous permettront d'accéder à votre compte si vous perdez votre méthode MFA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
          {backupCodes.map((code, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-center">
              {code}
            </div>
          ))}
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Important:</strong> Chaque code ne peut être utilisé qu'une seule fois.
            Sauvegardez-les dans un gestionnaire de mots de passe ou imprimez-les.
          </p>
        </div>
        
        <Button onClick={handleComplete} className="w-full">
          Terminer la configuration
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {step === 'method' && renderMethodSelection()}
      {step === 'setup' && method === 'totp' && renderTOTPSetup()}
      {step === 'setup' && method === 'email' && renderEmailSetup()}
      {step === 'verify' && renderBackupCodes()}
    </div>
  );
};
