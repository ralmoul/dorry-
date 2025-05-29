
import React, { useState, useEffect } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Settings } from '@/components/Settings';
import { useAuth } from '@/hooks/useAuth';
import UpcomingFeatures from './UpcomingFeatures';

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showUpcomingFeatures, setShowUpcomingFeatures] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('🔍 [INDEX] Auth state check:', { isAuthenticated, isLoading });
    
    if (!isLoading && !isAuthenticated) {
      console.log('❌ [INDEX] User not authenticated, redirecting to login');
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  // Afficher un écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bright-turquoise mx-auto mb-4"></div>
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  if (showUpcomingFeatures) {
    return (
      <UpcomingFeatures 
        onBack={() => setShowUpcomingFeatures(false)} 
      />
    );
  }

  if (showSettings) {
    return (
      <Settings 
        onBack={() => setShowSettings(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <VoiceRecorder
        onOpenSettings={() => setShowSettings(true)}
        onOpenUpcomingFeatures={() => setShowUpcomingFeatures(true)}
      />
    </div>
  );
};

export default Index;
