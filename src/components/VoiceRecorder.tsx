
import { Button } from '@/components/ui/button';
import { AIVisualizer } from '@/components/ui/AIVisualizer';
import { RecordingConfirmation } from '@/components/ui/RecordingConfirmation';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAuth } from '@/hooks/useAuth';
import { Zap, LogOut } from 'lucide-react';

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
  const {
    user,
    logout
  } = useAuth();
  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  return <div className="min-h-screen gradient-bg flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 relative z-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Dory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Bonjour, {user?.firstName}
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" onClick={onOpenUpcomingFeatures} className="text-bright-turquoise hover:text-bright-turquoise/80 hover:bg-bright-turquoise/10 p-2">
            🔮
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpenSettings} className="text-bright-turquoise hover:text-bright-turquoise/80 hover:bg-bright-turquoise/10 p-2">
            ⚙️
          </Button>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground hover:bg-foreground/10 p-2">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Zone centrale */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative">
        {showConfirmation ? <RecordingConfirmation onSend={confirmSend} onRestart={restartRecording} onCancel={cancelRecording} isProcessing={isProcessing} /> : <>
            {/* Titre et description */}
            <div className="text-center mb-6 sm:mb-8 relative z-10 px-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent leading-tight">
                {isRecording ? 'Je vous écoute...' : 'Votre assistant vocal intelligent vous écoute'}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg px-2">
                {isRecording ? 'Exprimez vos idées librement' : isProcessing ? 'Transmission en cours...' : 'Vos idées sont automatiquement transmises à votre intelligence automatisée'}
              </p>
            </div>

            {/* Visualiseur IA */}
            <div className="relative z-20 mb-6 sm:mb-8">
              <AIVisualizer isRecording={isRecording} onRecordingToggle={handleRecordingToggle} isProcessing={isProcessing} />
            </div>

            {/* Bloc explicatif IA */}
            <div className="relative z-10 max-w-sm sm:max-w-md w-full px-4">
              <div className="bg-gradient-to-br from-bright-turquoise/10 to-electric-blue/10 backdrop-blur-sm border border-bright-turquoise/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue flex items-center justify-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-dark-navy" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
                    IA & automatisation
                  </h3>
                </div>
                
                <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                  Dory reçoit vos audios et :
                </p>
                
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-bright-turquoise mt-0.5 sm:mt-1">•</span>
                    <span>Analyse ce qui a été dit</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-bright-turquoise mt-0.5 sm:mt-1">•</span>
                    <span>Détecte les informations du porteur de projet</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-bright-turquoise mt-0.5 sm:mt-1">•</span>
                    <span>Identifie si la personne est en QPV</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-bright-turquoise mt-0.5 sm:mt-1">•</span>
                    <span>Vous envoie directement le compte rendu dans votre boite mail</span>
                  </li>
                </ul>
              </div>
            </div>
          </>}
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-6 text-center relative z-10">
        
      </div>
    </div>;
};
