
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Settings } from '@/components/Settings';
import { AuthScreen } from '@/components/AuthScreen';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'recorder' | 'settings'>('recorder');
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue animate-pulse-ai mx-auto mb-4"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Dorry
          </h2>
          <p className="text-muted-foreground">Initialisation...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const handleOpenUpcomingFeatures = () => {
    navigate('/upcoming-features');
  };

  return (
    <>
      {currentScreen === 'recorder' && (
        <VoiceRecorder 
          onOpenSettings={() => setCurrentScreen('settings')}
          onOpenUpcomingFeatures={handleOpenUpcomingFeatures}
        />
      )}
      {currentScreen === 'settings' && (
        <Settings onBack={() => setCurrentScreen('recorder')} />
      )}
    </>
  );
};

export default Index;
