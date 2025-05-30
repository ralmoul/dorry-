
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Users, UserCheck, Clock, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserDetailsModal } from './admin/UserDetailsModal';
import { supabase } from '@/integrations/supabase/client';

interface PendingUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  is_approved: boolean;
  created_at: string;
}

export const AdminPanel = () => {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log('Loading users from Supabase profiles table...');
      setIsLoading(true);
      
      // Récupérer les utilisateurs depuis la table profiles
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading profiles:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Profiles loaded from Supabase:', profilesData);
      
      // Transformer les données pour correspondre à l'interface attendue
      const transformedUsers = profilesData?.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        is_approved: true, // Les profils Supabase sont considérés comme approuvés par défaut
        created_at: profile.created_at,
      })) || [];
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isApproved: boolean) => {
    try {
      console.log(`Updating user ${userId} status to ${isApproved ? 'approved' : 'rejected'}`);
      
      // Mettre à jour le statut dans la table profiles
      // Note: La table profiles n'a pas de colonne is_approved par défaut,
      // donc pour l'instant on simule juste l'action
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_approved: isApproved } : user
      ));
      setIsModalOpen(false);
      
      const action = isApproved ? 'approuvé' : 'rejeté';
      toast({
        title: `Utilisateur ${action}`,
        description: `Le compte a été ${action} avec succès.`,
        variant: isApproved ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      console.log(`Deleting user ${userId}`);
      
      // Supprimer l'utilisateur de la table profiles
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      setIsModalOpen(false);
      
      toast({
        title: "Utilisateur supprimé",
        description: "Le compte a été supprimé définitivement.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive"
      });
    }
  };

  const openUserDetails = (user: PendingUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Pour l'instant, tous les utilisateurs de la table profiles sont considérés comme approuvés
  const pendingUsers = users.filter(user => !user.is_approved);
  const approvedUsers = users.filter(user => user.is_approved);

  console.log('Pending users:', pendingUsers);
  console.log('Approved users:', approvedUsers);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue animate-pulse-ai mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2 font-sharp">Chargement...</h3>
              <p className="text-muted-foreground">
                Chargement des utilisateurs depuis Supabase.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent flex items-center gap-2">
              <Users className="h-8 w-8 text-bright-turquoise" />
              Administration Dory
            </CardTitle>
            <CardDescription>
              Gérez les utilisateurs enregistrés via l'authentification Supabase
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Demandes en attente</p>
                  <p className="text-2xl font-semibold text-bright-turquoise font-sharp">{pendingUsers.length}</p>
                </div>
                <Clock className="h-8 w-8 text-bright-turquoise/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs enregistrés</p>
                  <p className="text-2xl font-semibold text-green-500 font-sharp">{approvedUsers.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total utilisateurs</p>
                  <p className="text-2xl font-semibold font-sharp">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refresh button */}
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Supabase Profiles: {users.length} utilisateur(s) enregistré(s)
              </p>
              <Button 
                onClick={loadUsers}
                variant="outline"
                className="bg-bright-turquoise/10 border-bright-turquoise/30 text-bright-turquoise hover:bg-bright-turquoise/20"
              >
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {users.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardHeader>
              <CardTitle className="text-xl text-green-500 flex items-center gap-2 font-sharp">
                <UserCheck className="h-5 w-5" />
                Utilisateurs enregistrés ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium font-sharp">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.company}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openUserDetails(user)}
                            className="bg-bright-turquoise/10 border-bright-turquoise/30 text-bright-turquoise hover:bg-bright-turquoise/20"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteUser(user.id)}
                            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {users.length === 0 && (
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 font-sharp">Aucun utilisateur</h3>
              <p className="text-muted-foreground">
                Aucun utilisateur n'est encore enregistré dans le système.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <UserDetailsModal
        user={selectedUser ? {
          id: selectedUser.id,
          firstName: selectedUser.first_name,
          lastName: selectedUser.last_name,
          email: selectedUser.email,
          phone: selectedUser.phone,
          company: selectedUser.company,
          isApproved: selectedUser.is_approved,
          createdAt: selectedUser.created_at
        } : null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={(userId) => updateUserStatus(userId, true)}
        onReject={(userId) => deleteUser(userId)}
        onRevoke={(userId) => updateUserStatus(userId, false)}
        onDelete={(userId) => deleteUser(userId)}
      />
    </div>
  );
};
