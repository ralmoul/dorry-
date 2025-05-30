
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Download, Trash2, Shield, Database, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  isApproved: boolean;
  createdAt: string;
}

interface RgpdDeleteModalProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  adminSessionToken: string;
}

interface UserStats {
  voice_recordings: number;
  consent_logs: number;
  sessions: number;
  mfa_settings: number;
  otp_codes: number;
  login_attempts: number;
}

export const RgpdDeleteModal = ({ 
  user, 
  isOpen, 
  onClose, 
  onDeleted,
  adminSessionToken 
}: RgpdDeleteModalProps) => {
  const [step, setStep] = useState<'overview' | 'confirmation' | 'processing' | 'success'>('overview');
  const [confirmText, setConfirmText] = useState('');
  const [exportData, setExportData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userStats, setUserStats] = useState<UserStats>({
    voice_recordings: 0,
    consent_logs: 0,
    sessions: 0,
    mfa_settings: 0,
    otp_codes: 0,
    login_attempts: 0
  });
  const [exportedData, setExportedData] = useState<any>(null);
  
  const { toast } = useToast();

  // Charger les statistiques utilisateur quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && user) {
      console.log('🔍 [RGPD] Modal ouverte, chargement des stats pour:', user.firstName, user.lastName);
      loadUserStats();
    }
  }, [isOpen, user]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('overview');
      setConfirmText('');
      setExportData(false);
      setProgress(0);
      setExportedData(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      console.log('📊 [RGPD] Chargement des statistiques pour userId:', user.id);
      
      const [voiceData, consentData, sessionData, mfaData, otpData, loginData] = await Promise.all([
        supabase.from('voice_recordings').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('consent_logs').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('user_sessions').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('user_mfa_settings').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('otp_codes').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('login_attempts').select('id', { count: 'exact' }).eq('email', user.email)
      ]);

      const stats = {
        voice_recordings: voiceData.count || 0,
        consent_logs: consentData.count || 0,
        sessions: sessionData.count || 0,
        mfa_settings: mfaData.count || 0,
        otp_codes: otpData.count || 0,
        login_attempts: loginData.count || 0
      };

      console.log('📈 [RGPD] Stats chargées:', stats);
      setUserStats(stats);
    } catch (error) {
      console.error('❌ [RGPD] Erreur lors du chargement des stats:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les statistiques utilisateur.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    console.log('🚪 [RGPD] Fermeture de la modal');
    setStep('overview');
    setConfirmText('');
    setExportData(false);
    setProgress(0);
    setExportedData(null);
    onClose();
  };

  const downloadExport = () => {
    if (!exportedData || !user) return;
    
    const blob = new Blob([JSON.stringify(exportedData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donnees_${user.firstName}_${user.lastName}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export téléchargé",
      description: "Les données ont été exportées avec succès."
    });
  };

  const simulateProgress = () => {
    const steps = [
      { message: "Révocation des sessions actives...", duration: 800 },
      { message: "Suppression des enregistrements vocaux...", duration: 1200 },
      { message: "Suppression des logs de consentement...", duration: 600 },
      { message: "Suppression des données MFA...", duration: 400 },
      { message: "Suppression du compte Supabase Auth...", duration: 1000 },
      { message: "Journalisation RGPD...", duration: 500 },
    ];

    let currentProgress = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        currentProgress += (100 / steps.length);
        setProgress(Math.min(currentProgress, 100));
        
        toast({
          title: step.message,
          description: `Étape ${stepIndex + 1}/${steps.length}`
        });
        
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return interval;
  };

  const handleRgpdDelete = async () => {
    if (!user || !adminSessionToken) {
      console.error('❌ [RGPD] Données manquantes:', { user: !!user, token: !!adminSessionToken });
      toast({
        title: "Erreur de configuration",
        description: "Session admin invalide ou utilisateur introuvable.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('🚀 [RGPD] Démarrage suppression pour:', user.firstName, user.lastName);
    console.log('🔑 [RGPD] Token admin:', adminSessionToken.substring(0, 8) + '...');
    
    setIsLoading(true);
    setStep('processing');
    setProgress(0);

    // Simuler le feedback visuel
    const progressInterval = simulateProgress();

    try {
      const { data, error } = await supabase.functions.invoke('admin-delete-user-rgpd', {
        body: {
          userId: user.id,
          adminSessionToken,
          exportData
        }
      });

      clearInterval(progressInterval);

      if (error) {
        console.error('❌ [RGPD] Erreur de la function:', error);
        throw new Error(error.message || 'Erreur de suppression');
      }

      console.log('✅ [RGPD] Suppression réussie:', data);

      if (data?.exportData) {
        setExportedData(data.exportData);
        console.log('📥 [RGPD] Données exportées disponibles');
      }

      setProgress(100);
      setStep('success');

      toast({
        title: "✅ Suppression RGPD terminée",
        description: `${user.firstName} ${user.lastName} et toutes ses données ont été supprimés définitivement.`
      });

      // Actualiser la liste après un délai
      setTimeout(() => {
        onDeleted();
        handleClose();
      }, 3000);

    } catch (error) {
      clearInterval(progressInterval);
      console.error('❌ [RGPD] Error:', error);
      
      toast({
        title: "Erreur de suppression",
        description: error instanceof Error ? error.message : "Une erreur inattendue est survenue",
        variant: "destructive"
      });
      
      setStep('overview');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    console.log('⚠️ [RGPD] Modal appelée sans utilisateur');
    return null;
  }

  const isConfirmValid = confirmText === 'SUPPRIMER';

  console.log('🎨 [RGPD] Rendu modal - Étape:', step, 'Utilisateur:', user.firstName, user.lastName);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-lg border-red-500/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-400 flex items-center gap-2">
            <Trash2 className="h-6 w-6" />
            {step === 'overview' && 'Suppression RGPD - Droit à l\'effacement'}
            {step === 'confirmation' && 'Confirmation finale - IRRÉVERSIBLE'}
            {step === 'processing' && 'Suppression en cours...'}
            {step === 'success' && 'Suppression terminée'}
          </DialogTitle>
        </DialogHeader>

        {/* Étape 1: Vue d'ensemble */}
        {step === 'overview' && (
          <div className="space-y-6">
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="font-semibold text-red-400 text-lg">ACTION IRRÉVERSIBLE</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cette action supprimera DÉFINITIVEMENT toutes les données de l'utilisateur selon le RGPD.
              </p>
            </div>

            {/* Informations utilisateur */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white">👤 Utilisateur concerné</h3>
              <div className="p-3 bg-card/50 rounded border border-bright-turquoise/20">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.company}</p>
              </div>
            </div>

            {/* Données qui seront supprimées */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Database className="h-4 w-4" />
                📊 Données qui seront supprimées
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-orange-500/10 rounded border border-orange-500/20">
                  <p className="text-sm font-medium">Enregistrements vocaux</p>
                  <p className="text-lg font-bold text-orange-400">{userStats.voice_recordings}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                  <p className="text-sm font-medium">Logs consentement</p>
                  <p className="text-lg font-bold text-blue-400">{userStats.consent_logs}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                  <p className="text-sm font-medium">Sessions actives</p>
                  <p className="text-lg font-bold text-purple-400">{userStats.sessions}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                  <p className="text-sm font-medium">Configuration MFA</p>
                  <p className="text-lg font-bold text-green-400">{userStats.mfa_settings}</p>
                </div>
              </div>
            </div>

            {/* Export optionnel */}
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-blue-400">Conformité RGPD</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Vous pouvez exporter les données avant suppression (recommandé).
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportData}
                  onChange={(e) => setExportData(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">📥 Exporter les données en JSON avant suppression</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-red-500/20">
              <Button onClick={handleClose} variant="outline" className="flex-1">
                Annuler
              </Button>
              <Button 
                onClick={() => setStep('confirmation')} 
                className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              >
                🗑️ Continuer la suppression
              </Button>
            </div>
          </div>
        )}

        {/* Étape 2: Confirmation finale */}
        {step === 'confirmation' && (
          <div className="space-y-6">
            <div className="p-4 bg-red-500/20 rounded-lg border-2 border-red-500/50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <span className="font-bold text-red-400 text-xl">DERNIÈRE CONFIRMATION</span>
              </div>
              <p className="text-white font-medium mb-2">
                Pour confirmer, tapez exactement : <span className="font-mono bg-red-500/30 px-2 py-1 rounded">SUPPRIMER</span>
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Tapez SUPPRIMER ici..."
                className="bg-card/50 border-red-500/30 focus:border-red-400"
                autoFocus
              />
            </div>

            <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/30">
              <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Cette action supprimera DÉFINITIVEMENT :</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Le compte Supabase Auth de {user.firstName} {user.lastName}</li>
                <li>✓ Tous les enregistrements vocaux</li>
                <li>✓ Tous les logs de consentement et sessions</li>
                <li>✓ Toutes les configurations de sécurité (MFA, OTP)</li>
                <li>✓ Toutes traces dans la base de données</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4 border-t border-red-500/20">
              <Button onClick={() => setStep('overview')} variant="outline" className="flex-1">
                ← Retour
              </Button>
              <Button 
                onClick={handleRgpdDelete}
                disabled={!isConfirmValid || isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                🗑️ SUPPRIMER DÉFINITIVEMENT
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3: Traitement */}
        {step === 'processing' && (
          <div className="space-y-6 text-center">
            <div className="p-6">
              <Clock className="h-16 w-16 text-red-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Suppression en cours...</h3>
              <p className="text-muted-foreground mb-4">
                Suppression RGPD de {user.firstName} {user.lastName}
              </p>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">{progress.toFixed(0)}% terminé</p>
            </div>
          </div>
        )}

        {/* Étape 4: Succès */}
        {step === 'success' && (
          <div className="space-y-6 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">✅ SUPPRESSION TERMINÉE</h3>
              <p className="text-muted-foreground mb-4">
                {user.firstName} {user.lastName} et toutes ses données ont été supprimés définitivement.
              </p>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Conforme RGPD - Droit à l'effacement respecté
              </Badge>
            </div>

            {exportedData && (
              <div className="p-4 bg-blue-500/10 rounded border border-blue-500/30">
                <p className="text-sm text-muted-foreground mb-3">
                  Les données ont été exportées avant suppression.
                </p>
                <Button 
                  onClick={downloadExport} 
                  variant="outline"
                  className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger l'export JSON
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Cette fenêtre se fermera automatiquement dans quelques secondes...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
