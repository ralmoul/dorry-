
import { Button } from '@/components/ui/button';
import { ConfettiButton } from '@/components/ui/ConfettiButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RecordingConfirmationProps {
  onSend: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const RecordingConfirmation = ({ 
  onSend, 
  onCancel, 
  isProcessing 
}: RecordingConfirmationProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 relative z-30 px-4">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          Enregistrement terminé
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          Que souhaitez-vous faire ?
        </p>
      </div>
      
      <div className="flex flex-col space-y-2 sm:space-y-3 w-full max-w-xs">
        {!isProcessing ? (
          <ConfettiButton
            onClick={onSend}
            className="bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-white font-medium h-10 sm:h-11 text-sm sm:text-base"
          >
            📤 Envoyer
          </ConfettiButton>
        ) : (
          <Button
            disabled={true}
            className="bg-gradient-to-r from-bright-turquoise to-electric-blue opacity-50 text-white font-medium h-10 sm:h-11 text-sm sm:text-base"
          >
            Envoi en cours...
          </Button>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isProcessing}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10 h-10 sm:h-11 text-sm sm:text-base"
            >
              🗑️ Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background border border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Êtes-vous sûr de vouloir annuler ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Cette action supprimera définitivement votre enregistrement.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-white">
                ❌ Non
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={onCancel}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                ✅ Oui
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
