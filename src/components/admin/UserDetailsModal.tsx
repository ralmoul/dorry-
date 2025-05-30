
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Building, Calendar, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RgpdDeleteModal } from './RgpdDeleteModal';

interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  isApproved: boolean;
  createdAt: string;
  password?: string;
}

interface UserDetailsModalProps {
  user: PendingUser | null;
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

  const isPending = !user.isApproved;
  const isApproved = user.isApproved;

  console.log('🎨 [DEBUG] UserDetailsModal rendu pour:', user.firstName, user.lastName, 'Approuvé:', isApproved);

  const handleRgpdDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔴 [DEBUG] RGPD clicked! Utilisateur:', user.firstName, user.lastName);
    console.log('🔴 [DEBUG] Token admin présent:', !!adminSessionToken);
    console.log('🔴 [DEBUG] Utilisateur approuvé:', isApproved);
    console.log('🔴 [DEBUG] Ouverture modal RGPD...');
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-lg border-bright-turquoise/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent flex items-center gap-2">
              <User className="h-6 w-6 text-bright-turquoise" />
              Détails de l'utilisateur
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Statut */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPending ? (
                  <Clock className="h-5 w-5 text-orange-400" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                )}
                <span className="font-medium">Statut du compte</span>
              </div>
              <Badge 
                className={
                  isPending 
                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30" 
                    : "bg-green-500/20 text-green-400 border-green-500/30"
                }
              >
                {isPending ? "En attente" : "Approuvé"}
              </Badge>
            </div>

            {/* Informations personnelles */}
            <Card className="bg-card/50 backdrop-blur border-bright-turquoise/10">
              <CardHeader>
                <CardTitle className="text-lg text-bright-turquoise">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Prénom</label>
                    <p className="font-medium text-sharp">{user.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Nom</label>
                    <p className="font-medium text-sharp">{user.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-bright-turquoise" />
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium text-sharp">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-bright-turquoise" />
                  <div>
                    <label className="text-sm text-muted-foreground">Téléphone</label>
                    <p className="font-medium text-sharp">{user.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-bright-turquoise" />
                  <div>
                    <label className="text-sm text-muted-foreground">Entreprise</label>
                    <p className="font-medium text-sharp">{user.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card className="bg-card/50 backdrop-blur border-bright-turquoise/10">
              <CardHeader>
                <CardTitle className="text-lg text-bright-turquoise">Informations système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-bright-turquoise" />
                  <div>
                    <label className="text-sm text-muted-foreground">Date de création</label>
                    <p className="font-medium text-sharp">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR', {
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
                  <label className="text-sm text-muted-foreground">ID utilisateur</label>
                  <p className="font-mono text-sm text-sharp">{user.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-bright-turquoise/20">
              {isPending && (
                <>
                  <Button
                    onClick={() => onApprove?.(user.id)}
                    className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                  <Button
                    onClick={() => onReject?.(user.id)}
                    variant="outline"
                    className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </>
              )}
              
              {isApproved && (
                <Button
                  onClick={() => onRevoke?.(user.id)}
                  variant="outline"
                  className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                >
                  Révoquer l'accès
                </Button>
              )}
              
              <Button
                onClick={() => onDelete?.(user.id)}
                variant="outline"
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                Supprimer définitivement
              </Button>

              {/* Bouton RGPD pour utilisateurs approuvés avec debug renforcé */}
              {isApproved && (
                <Button
                  onClick={handleRgpdDeleteClick}
                  variant="outline"
                  className="bg-red-600/20 border-red-600/40 text-red-300 hover:bg-red-600/30 font-semibold"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  RGPD - Droit à l'effacement
                </Button>
              )}
            </div>

            {/* DEBUG: Informations de debug visibles */}
            <div className="p-2 bg-yellow-500/10 rounded text-xs text-yellow-400 border border-yellow-500/30">
              <p>DEBUG: User {user.firstName} {user.lastName} - Approuvé: {isApproved ? 'OUI' : 'NON'}</p>
              <p>DEBUG: Token admin: {adminSessionToken ? 'PRÉSENT' : 'ABSENT'}</p>
              <p>DEBUG: Modal RGPD ouverte: {showRgpdDelete ? 'OUI' : 'NON'}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal RGPD séparé */}
      {showRgpdDelete && (
        <RgpdDeleteModal
          user={user}
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
