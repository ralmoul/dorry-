
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Header } from '@/components/Header';

const Index = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log('📄 [INDEX] Page loaded, auth state:', { isAuthenticated, isLoading, userApproved: user?.isApproved });
    
    // CORRECTION CRITIQUE : Protection de route stricte
    if (!isLoading && (!isAuthenticated || !user?.isApproved)) {
      console.log('🚫 [INDEX] Access denied - redirecting to login');
      window.location.href = '/login';
      return;
    }
  }, [isAuthenticated, isLoading, user]);

  // Affichage du loading pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bright-turquoise mx-auto mb-4"></div>
          <p className="text-white text-lg">Vérification de votre compte...</p>
        </div>
      </div>
    );
  }

  // CORRECTION CRITIQUE : Bloquer l'accès si pas authentifié ou pas approuvé
  if (!isAuthenticated || !user?.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <p className="text-white text-lg">Accès non autorisé. Redirection...</p>
        </div>
      </div>
    );
  }

  const handleOpenSettings = () => {
    window.location.href = '/settings';
  };

  const handleOpenUpcomingFeatures = () => {
    window.location.href = '/upcoming-features';
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header onOpenSettings={handleOpenSettings} />
      <VoiceRecorder 
        onOpenSettings={handleOpenSettings}
        onOpenUpcomingFeatures={handleOpenUpcomingFeatures}
      />
    </div>
  );
};

export default Index;
