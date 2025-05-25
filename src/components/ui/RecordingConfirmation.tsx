
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
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 relative z-30 px-4">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent mb-2">
          Enregistrement terminé
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          Que souhaitez-vous faire ?
        </p>
      </div>
      
      <div className="flex flex-col space-y-2 sm:space-y-3 w-full max-w-xs">
        <Button
          onClick={onSend}
          disabled={isProcessing}
          className="bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-white font-medium h-10 sm:h-11 text-sm sm:text-base"
        >
          {isProcessing ? 'Envoi en cours...' : '📤 Envoyer'}
        </Button>
        
        <Button
          onClick={onRestart}
          disabled={isProcessing}
          variant="outline"
          className="border-bright-turquoise text-bright-turquoise hover:bg-bright-turquoise/10 h-10 sm:h-11 text-sm sm:text-base"
        >
          🔄 Recommencer
        </Button>
        
        <Button
          onClick={onCancel}
          disabled={isProcessing}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground h-10 sm:h-11 text-sm sm:text-base"
        >
          ❌ Annuler
        </Button>
      </div>
    </div>
  );
};
