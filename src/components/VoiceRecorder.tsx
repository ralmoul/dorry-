
import { Button } from '@/components/ui/button';
import { AIVisualizer } from '@/components/ui/AIVisualizer';
import { RecordingConfirmation } from '@/components/ui/RecordingConfirmation';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Zap, LogOut } from 'lucide-react';

interface VoiceRecorderProps {
  onOpenSettings: () => void;
  onOpenUpcomingFeatures: () => void;
}

export const VoiceRecorder = ({
  onOpenSettings,
  onOpenUpcomingFeatures
}: VoiceRecorderProps) => {
  const {
    isRecording,
    isProcessing,
    showConfirmation,
    startRecording,
    stopRecording,
    confirmSend,
    restartRecording,
    cancelRecording
  } = useAudioRecorder();
  const { user, logout } = useAuth();

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar gauche */}
      <div className="w-64 bg-card/50 backdrop-blur-sm border-r border-border p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ai-cyan to-ai-blue bg-clip-text text-transparent">
            Dory
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Assistant vocal IA
          </p>
        </div>
        
        {user && (
          <div className="mb-auto">
            <p className="text-sm text-muted-foreground">Bonjour,</p>
            <p className="text-lg font-semibold text-foreground">{user.firstName}</p>
          </div>
        )}

        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-ai-blue hover:bg-accent"
            onClick={onOpenUpcomingFeatures}
          >
            <Zap className="w-4 h-4 mr-2" />
            Fonctionnalités
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-ai-blue hover:bg-accent"
            onClick={onOpenSettings}
          >
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-accent"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {showConfirmation ? (
          <RecordingConfirmation 
            onSend={confirmSend} 
            onRestart={restartRecording} 
            onCancel={cancelRecording} 
            isProcessing={isProcessing} 
          />
        ) : (
          <>
            {/* Titre principal */}
            <div className="text-center mb-12 max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-ai-cyan to-ai-blue bg-clip-text text-transparent leading-tight">
                {isRecording ? 'Je vous écoute...' : 'Votre assistant vocal intelligent vous écoute'}
              </h2>
              <p className="text-lg lg:text-xl text-ai-pink/80 leading-relaxed">
                {isRecording ? 'Exprimez vos idées librement' : 
                 isProcessing ? 'Transmission en cours...' : 
                 'Vos idées sont automatiquement transmises à votre intelligence automatisée'}
              </p>
            </div>

            {/* Visualiseur IA avec micro */}
            <div className="mb-12">
              <AIVisualizer 
                isRecording={isRecording} 
                onRecordingToggle={handleRecordingToggle} 
                isProcessing={isProcessing} 
              />
            </div>

            {/* Carte explicative avec glassmorphism */}
            <div className="max-w-md w-full">
              <div className="glassmorphism rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ai-green to-ai-cyan flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-ai-blue to-ai-green bg-clip-text text-transparent">
                    IA & automatisation
                  </h3>
                </div>
                
                <p className="text-muted-foreground mb-4 text-sm">
                  Dory reçoit vos audios et :
                </p>
                
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3 text-foreground">
                    <span className="text-ai-cyan mt-1 text-xs">•</span>
                    <span>Analyse ce qui a été dit</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <span className="text-ai-blue mt-1 text-xs">•</span>
                    <span>Détecte les informations du porteur de projet</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <span className="text-ai-purple mt-1 text-xs">•</span>
                    <span>Identifie si la personne est en QPV</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <span className="text-ai-pink mt-1 text-xs">•</span>
                    <span>Vous envoie directement le compte rendu dans votre boîte mail</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
