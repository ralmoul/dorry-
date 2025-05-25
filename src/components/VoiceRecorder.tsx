
import { Button } from '@/components/ui/button';
import { AIVisualizer } from '@/components/ui/AIVisualizer';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAuth } from '@/hooks/useAuth';

interface VoiceRecorderProps {
  onOpenSettings: () => void;
}

export const VoiceRecorder = ({ onOpenSettings }: VoiceRecorderProps) => {
  const { isRecording, isProcessing, startRecording, stopRecording } = useAudioRecorder();
  const { user, logout } = useAuth();

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Dory
          </h1>
          <p className="text-sm text-muted-foreground">
            Bonjour, {user?.firstName}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onOpenSettings}
            className="text-bright-turquoise hover:text-bright-turquoise/80 hover:bg-bright-turquoise/10"
          >
            Paramètres
          </Button>
          <Button
            variant="ghost"
            onClick={logout}
            className="text-muted-foreground hover:text-foreground hover:bg-foreground/10"
          >
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Zone centrale */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            {isRecording ? 'Je vous écoute...' : 'Votre assistant vocal intelligent vous écoute'}
          </h2>
          <p className="text-muted-foreground text-lg">
            {isRecording 
              ? 'Exprimez vos idées librement' 
              : isProcessing 
                ? 'Transmission en cours...'
                : 'Vos idées sont automatiquement transmises à votre intelligence automatisée'
            }
          </p>
        </div>

        {/* Visualiseur IA */}
        <div className="mb-12">
          <AIVisualizer isRecording={isRecording} />
        </div>

        {/* Bouton d'enregistrement */}
        <Button
          onClick={handleRecordingToggle}
          disabled={isProcessing}
          className={`
            w-24 h-24 rounded-full text-2xl font-bold transition-all duration-300
            ${isRecording 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-glow' 
              : 'bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80'
            }
            ${isProcessing ? 'opacity-50' : ''}
            text-dark-navy shadow-lg hover:shadow-xl transform hover:scale-105
          `}
        >
          {isRecording ? '⏹' : isProcessing ? '⟳' : '🎤'}
        </Button>

        <p className="mt-4 text-sm text-muted-foreground text-center">
          {isRecording 
            ? 'Appuyez pour arrêter l\'enregistrement' 
            : isProcessing
              ? 'Traitement en cours...'
              : 'Appuyez pour commencer l\'enregistrement'
          }
        </p>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          L'enregistrement continue même si votre téléphone se verrouille
        </p>
      </div>
    </div>
  );
};
