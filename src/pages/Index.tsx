
import React, { useState, useEffect } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Settings } from '@/components/Settings';
import { AuthScreen } from '@/components/AuthScreen';
import UpcomingFeatures from './UpcomingFeatures';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showUpcomingFeatures, setShowUpcomingFeatures] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🔍 [INDEX] État authentification:', { isAuthenticated, isLoading });

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-lg">Vérification de la connexion...</div>
      </div>
    );
  }

  // Si pas connecté, afficher l'écran de connexion
  if (!isAuthenticated) {
    console.log('❌ [INDEX] Utilisateur non connecté, affichage de l\'écran de connexion');
    return (
      <div className="min-h-screen gradient-bg">
        <AuthScreen />
      </div>
    );
  }

  console.log('✅ [INDEX] Utilisateur connecté, affichage de l\'app');

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
