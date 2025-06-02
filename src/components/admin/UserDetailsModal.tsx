import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Building, Calendar, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RgpdDeleteModal } from './RgpdDeleteModal';
import { AdminUserProfile } from '@/services/adminService';

interface UserDetailsModalProps {
  user: AdminUserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  onRevoke?: (userId: string) => void;
  adminSessionToken?: string;
}

export const UserDetailsModal = ({ 
  user, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject, 
  onDelete, 
  onRevoke,
  adminSessionToken 
}: UserDetailsModalProps) => {
  const [showRgpdDelete, setShowRgpdDelete] = useState(false);

  if (!user) {
    console.log('⚠️ [DEBUG] UserDetailsModal appelée sans utilisateur');
    return null;
  }

  const isPending = !user.is_approved;
  const isApproved = user.is_approved;

  console.log('🎨 [DEBUG] UserDetailsModal rendu pour:', user.first_name, user.last_name, 'Approuvé:', isApproved, 'En attente:', isPending);

  const handleRgpdDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔴 [DEBUG] RGPD button clicked! Utilisateur:', user.first_name, user.last_name);
    console.log('🔴 [DEBUG] Token admin présent:', !!adminSessionToken);
    console.log('🔴 [DEBUG] Utilisateur approuvé:', isApproved);
    console.log('🔴 [DEBUG] Opening RGPD modal...');
    setShowRgpdDelete(true);
  };

  const handleRgpdDeleteSuccess = () => {
    console.log('✅ [DEBUG] Suppression RGPD réussie, fermeture des modals');
    setShowRgpdDelete(false);
    onClose();
    // Trigger refresh in parent component
    if (onDelete) {
      onDelete(user.id);
    }
  };

  // Transform AdminUserProfile to compatible format for RgpdDeleteModal
  const transformedUser = {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    company: user.company,
    isApproved: user.is_approved,
    createdAt: user.created_at
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl w-full mx-2 sm:mx-4 bg-card/95 backdrop-blur-lg border-bright-turquoise/20 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader className="px-2 sm:px-0">
            <DialogTitle className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent flex items-center gap-2 leading-tight">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-bright-turquoise flex-shrink-0" />
              <span className="break-words">Détails de l'utilisateur</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Statut optimisé mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                {isPending ? (
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                )}
                <span className="font-medium text-sm sm:text-base">Statut du compte</span>
              </div>
              <Badge 
                className={
                  isPending 
                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs sm:text-sm self-start sm:self-center" 
                    : "bg-green-500/20 text-green-400 border-green-500/30 text-xs sm:text-sm self-start sm:self-center"
                }
              >
                {isPending ? "En attente" : "Approuvé"}
              </Badge>
            </div>

            {/* Informations personnelles */}
            <Card className="bg-card/50 backdrop-blur border-bright-turquoise/10">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg text-bright-turquoise">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground">Prénom</label>
                    <p className="font-medium text-sharp text-sm sm:text-base break-words">{user.first_name}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground">Nom</label>
                    <p className="font-medium text-sharp text-sm sm:text-base break-words">{user.last_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-bright-turquoise flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs sm:text-sm text-muted-foreground">Email</label>
                    <p className="font-medium text-sharp text-sm sm:text-base break-all">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-bright-turquoise flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs sm:text-sm text-muted-foreground">Téléphone</label>
                    <p className="font-medium text-sharp text-sm sm:text-base break-words">{user.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4 text-bright-turquoise flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs sm:text-sm text-muted-foreground">Entreprise</label>
                    <p className="font-medium text-sharp text-sm sm:text-base break-words">{user.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card className="bg-card/50 backdrop-blur border-bright-turquoise/10">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg text-bright-turquoise">Informations système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-bright-turquoise flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs sm:text-sm text-muted-foreground">Date de création</label>
                    <p className="font-medium text-sharp text-sm sm:text-base break-words">
                      {new Date(user.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground">ID utilisateur</label>
                  <p className="font-mono text-xs sm:text-sm text-sharp break-all">{user.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions optimisées mobile */}
            <div className="flex flex-col gap-2 sm:gap-3 pt-4 border-t border-bright-turquoise/20">
              {/* Actions pour utilisateurs en attente */}
              {isPending && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    onClick={() => onApprove?.(user.id)}
                    className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 h-10 sm:h-auto text-sm order-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                  <Button
                    onClick={() => onReject?.(user.id)}
                    variant="outline"
                    className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 h-10 sm:h-auto text-sm order-2"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              )}
              
              {/* Actions pour utilisateurs approuvés */}
              {isApproved && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    onClick={() => onRevoke?.(user.id)}
                    variant="outline"
                    className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 h-10 sm:h-auto text-sm order-1"
                  >
                    Révoquer l'accès
                  </Button>
                  <Button
                    onClick={handleRgpdDeleteClick}
                    variant="outline"
                    className="bg-red-600/20 border-red-600/40 text-red-300 hover:bg-red-600/30 font-semibold h-10 sm:h-auto text-sm order-2"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">RGPD - Droit à l'effacement</span>
                    <span className="sm:hidden">Suppression RGPD</span>
                  </Button>
                </div>
              )}
              
              {/* Bouton suppression définitive - TOUJOURS AFFICHÉ */}
              <Button
                onClick={() => onDelete?.(user.id)}
                variant="outline"
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 h-10 sm:h-auto text-sm w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer définitivement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal RGPD séparé */}
      {showRgpdDelete && (
        <RgpdDeleteModal
          user={transformedUser}
          isOpen={showRgpdDelete}
          onClose={() => {
            console.log('🚪 [DEBUG] Fermeture modal RGPD');
            setShowRgpdDelete(false);
          }}
          onDeleted={handleRgpdDeleteSuccess}
          adminSessionToken={adminSessionToken || ''}
        />
      )}
    </>
  );
};
