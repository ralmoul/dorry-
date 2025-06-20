
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
    return null;
  }

  const isPending = !user.is_approved;
  const isApproved = user.is_approved;

  const handleRgpdDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🗑️ [ADMIN] RGPD Delete button clicked for user:', user.id);
    setShowRgpdDelete(true);
  };

  const handleRgpdDeleteSuccess = () => {
    console.log('✅ [ADMIN] RGPD Delete successful');
    setShowRgpdDelete(false);
    onClose();
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
        <DialogContent className="max-w-md sm:max-w-2xl w-[95%] sm:w-full mx-auto bg-card/95 backdrop-blur-lg border-bright-turquoise/20">
          <DialogHeader className="pb-4 border-b border-bright-turquoise/10">
            <DialogTitle className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent flex items-center gap-2">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-bright-turquoise flex-shrink-0" />
              <span className="truncate">Détails utilisateur</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Informations et actions disponibles
            </DialogDescription>
          </DialogHeader>
          
          {/* Zone de contenu avec scroll interne si nécessaire */}
          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto">
            {/* Statut */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                {isPending ? (
                  <Clock className="h-4 w-4 text-orange-400 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                )}
                <span className="font-medium text-sm">Statut</span>
              </div>
              <Badge 
                className={
                  isPending 
                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs" 
                    : "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                }
              >
                {isPending ? "En attente" : "Approuvé"}
              </Badge>
            </div>

            {/* Informations personnelles */}
            <Card className="bg-card/50 backdrop-blur border-bright-turquoise/10">
              <CardHeader className="p-3">
                <CardTitle className="text-base text-bright-turquoise">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Prénom</label>
                    <p className="font-medium text-sm break-words">{user.first_name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Nom</label>
                    <p className="font-medium text-sm break-words">{user.last_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Mail className="h-3 w-3 text-bright-turquoise flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-muted-foreground">Email</label>
                    <p className="font-medium text-sm break-all">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="h-3 w-3 text-bright-turquoise flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-muted-foreground">Téléphone</label>
                    <p className="font-medium text-sm">{user.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Building className="h-3 w-3 text-bright-turquoise flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-muted-foreground">Entreprise</label>
                    <p className="font-medium text-sm break-words">{user.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card className="bg-card/50 backdrop-blur border-bright-turquoise/10">
              <CardHeader className="p-3">
                <CardTitle className="text-base text-bright-turquoise">Système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-3 w-3 text-bright-turquoise flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-muted-foreground">Inscription</label>
                    <p className="font-medium text-sm">
                      {new Date(user.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground">ID</label>
                  <p className="font-mono text-xs text-muted-foreground break-all">{user.id}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-bright-turquoise/20 space-y-2">
            {/* Actions pour utilisateurs en attente */}
            {isPending && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    console.log('✅ [ADMIN] Approve button clicked for user:', user.id);
                    onApprove?.(user.id);
                  }}
                  className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 h-9 text-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
                <Button
                  onClick={() => {
                    console.log('❌ [ADMIN] Reject button clicked for user:', user.id);
                    onReject?.(user.id);
                  }}
                  variant="outline"
                  className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 h-9 text-sm"
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
                  className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 h-9 text-sm"
                >
                  Révoquer l'accès
                </Button>
                <Button
                  onClick={handleRgpdDeleteClick}
                  variant="outline"
                  className="bg-red-600/20 border-red-600/40 text-red-300 hover:bg-red-600/30 h-9 text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">RGPD - Suppression</span>
                  <span className="sm:hidden">RGPD</span>
                </Button>
              </div>
            )}
            
            {/* Suppression définitive */}
            <Button
              onClick={() => onDelete?.(user.id)}
              variant="outline"
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 h-9 text-sm w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer définitivement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal RGPD séparé */}
      {showRgpdDelete && (
        <RgpdDeleteModal
          user={transformedUser}
          isOpen={showRgpdDelete}
          onClose={() => setShowRgpdDelete(false)}
          onDeleted={handleRgpdDeleteSuccess}
          adminSessionToken={adminSessionToken || ''}
        />
      )}
    </>
  );
};
