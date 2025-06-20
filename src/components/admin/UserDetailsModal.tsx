
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

  if (!user || !isOpen) {
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
      {/* OVERLAY AVEC CENTRAGE ABSOLU */}
      <div 
        style={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '100vw',
          height: '100vh',
          zIndex: 999999,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      >
        {/* MODAL CENTRE ABSOLU */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '672px',
            maxHeight: '90vh',
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            border: '2px solid rgba(34, 211, 238, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton fermeture */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors p-2"
          >
            <XCircle className="h-5 w-5" />
          </button>

          <div className="p-6">
            {/* Header avec titre */}
            <div className="pb-4 border-b border-bright-turquoise/10">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent flex items-center gap-2">
                <User className="h-6 w-6 text-bright-turquoise" />
                Détails utilisateur
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Informations et actions disponibles
              </p>
            </div>
            
            <div className="space-y-4 py-2">
              {/* Statut */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPending ? (
                    <Clock className="h-4 w-4 text-orange-400" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                  <span className="font-medium">Statut</span>
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
                  <CardTitle className="text-bright-turquoise">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Prénom</label>
                      <p className="font-medium">{user.first_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Nom</label>
                      <p className="font-medium">{user.last_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-bright-turquoise" />
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-bright-turquoise" />
                    <div>
                      <label className="text-sm text-muted-foreground">Téléphone</label>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-bright-turquoise" />
                    <div>
                      <label className="text-sm text-muted-foreground">Entreprise</label>
                      <p className="font-medium">{user.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations système */}
              <Card className="bg-card/50 backdrop-blur border-bright-turquoise/10">
                <CardHeader>
                  <CardTitle className="text-bright-turquoise">Système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-bright-turquoise" />
                    <div>
                      <label className="text-sm text-muted-foreground">Inscription</label>
                      <p className="font-medium">
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
                    <label className="text-sm text-muted-foreground">ID</label>
                    <p className="font-mono text-xs text-muted-foreground">{user.id}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-bright-turquoise/20 space-y-4">
              {/* Actions pour utilisateurs en attente */}
              {isPending && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      console.log('✅ [ADMIN] Approve button clicked for user:', user.id);
                      onApprove?.(user.id);
                    }}
                    className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
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
                    className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              )}
              
              {/* Actions pour utilisateurs approuvés */}
              {isApproved && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => onRevoke?.(user.id)}
                    variant="outline"
                    className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                  >
                    Révoquer l'accès
                  </Button>
                  <Button
                    onClick={handleRgpdDeleteClick}
                    variant="outline"
                    className="bg-red-600/20 border-red-600/40 text-red-300 hover:bg-red-600/30"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    RGPD - Suppression
                  </Button>
                </div>
              )}
              
              {/* Suppression définitive */}
              <Button
                onClick={() => onDelete?.(user.id)}
                variant="outline"
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer définitivement
              </Button>

              {/* Bouton pour fermer */}
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      </div>

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
