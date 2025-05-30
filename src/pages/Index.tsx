
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Settings } from '@/components/Settings';
import { AdminPanel } from '@/components/AdminPanel';

const Index = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log('🔍 [INDEX] Auth state check:', { isAuthenticated, isLoading, hasUser: !!user });
    
    // Si le chargement est terminé et que l'utilisateur n'est pas authentifié
    if (!isLoading && !isAuthenticated) {
      console.log('❌ [INDEX] User not authenticated, redirecting to login');
      window.location.href = '/login';
      return;
    }
    
    // Si l'utilisateur est connecté mais pas approuvé
    if (!isLoading && isAuthenticated && user && !user.isApproved) {
      console.log('❌ [INDEX] User not approved, redirecting to login');
      window.location.href = '/login';
      return;
    }
  }, [isAuthenticated, isLoading, user]);

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié ou pas approuvé, ne rien afficher (la redirection se fera)
  if (!isAuthenticated || !user?.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        <div className="text-center">
          <p className="text-white text-lg">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  // Utilisateur authentifié et approuvé, afficher l'application
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <VoiceRecorder />
      <Settings />
      <AdminPanel />
    </div>
  );
};

export default Index;
