
import { useState } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Settings } from '@/components/Settings';
import { AuthScreen } from '@/components/AuthScreen';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'recorder' | 'settings'>('recorder');
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue animate-pulse-ai mx-auto mb-4"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Dory
          </h2>
          <p className="text-muted-foreground">Initialisation...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <>
      {currentScreen === 'recorder' && (
        <VoiceRecorder onOpenSettings={() => setCurrentScreen('settings')} />
      )}
      {currentScreen === 'settings' && (
        <Settings onBack={() => setCurrentScreen('recorder')} />
      )}
    </>
  );
};

export default Index;
