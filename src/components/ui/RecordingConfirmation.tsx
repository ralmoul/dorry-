
import { Button } from '@/components/ui/button';

interface RecordingConfirmationProps {
  onSend: () => void;
  onRestart: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const RecordingConfirmation = ({ 
  onSend, 
  onRestart, 
  onCancel, 
  isProcessing 
}: RecordingConfirmationProps) => {
  return (
    <div className="flex flex-col items-center space-y-6 relative z-30">
      <div className="text-center">
        <h3 className="text-xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent mb-2">
          Enregistrement terminé
        </h3>
        <p className="text-muted-foreground">
          Que souhaitez-vous faire ?
        </p>
      </div>
      
      <div className="flex flex-col space-y-3 w-full max-w-xs">
        <Button
          onClick={onSend}
          disabled={isProcessing}
          className="bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-white font-medium"
        >
          {isProcessing ? 'Envoi en cours...' : '📤 Envoyer'}
        </Button>
        
        <Button
          onClick={onRestart}
          disabled={isProcessing}
          variant="outline"
          className="border-bright-turquoise text-bright-turquoise hover:bg-bright-turquoise/10"
        >
          🔄 Recommencer
        </Button>
        
        <Button
          onClick={onCancel}
          disabled={isProcessing}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          ❌ Annuler
        </Button>
      </div>
    </div>
  );
};
