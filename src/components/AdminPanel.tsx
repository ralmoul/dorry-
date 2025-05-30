import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Trash2, Eye, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
    
    // Écouter les changements en temps réel dans la table profiles
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('🔄 [ADMIN] Changement détecté dans profiles:', payload);
          loadUsers(); // Recharger les données automatiquement
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadUsers = async (showRefreshToast = false) => {
    try {
      console.log('🔍 [ADMIN] Chargement des utilisateurs depuis Supabase...');
      if (showRefreshToast) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      // Récupérer les utilisateurs depuis la table profiles
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [ADMIN] Erreur lors du chargement des profils:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ [ADMIN] Profils chargés depuis Supabase:', profilesData?.length || 0);
      console.log('📊 [ADMIN] Données des profils:', profilesData);
      
      // Transformer les données pour correspondre à l'interface attendue
      const transformedUsers = profilesData?.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        is_approved: profile.is_approved || false,
        created_at: profile.created_at,
      })) || [];
      
      setUsers(transformedUsers);
      console.log('📊 [ADMIN] Utilisateurs transformés:', transformedUsers.length);
      
      if (showRefreshToast) {
        toast({
          title: "Actualisation réussie",
          description: `${transformedUsers.length} utilisateur(s) trouvé(s)`,
        });
      }
      
      if (transformedUsers.length === 0) {
        console.log('⚠️ [ADMIN] Aucun utilisateur trouvé dans la base de données');
      }
    } catch (error) {
      console.error('💥 [ADMIN] Erreur inattendue lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadUsers(true);
  };

  const approveUser = async (userId: string) => {
    try {
      console.log(`✅ [ADMIN] Début de l'approbation pour l'utilisateur ${userId}`);
      
      // Vérifier d'abord l'état actuel de l'utilisateur
      const { data: currentUser, error: fetchError } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', userId)
        .single();
      
      if (fetchError) {
        console.error('❌ [ADMIN] Erreur lors de la vérification de l\'état actuel:', fetchError);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier l'état de l'utilisateur.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('📊 [ADMIN] État actuel de l\'utilisateur:', currentUser);
      
      // Si déjà approuvé, ne rien faire
      if (currentUser.is_approved === true) {
        console.log('⚠️ [ADMIN] L\'utilisateur est déjà approuvé');
        toast({
          title: "Information",
          description: "L'utilisateur est déjà approuvé.",
        });
        return;
      }
      
      // Effectuer la mise à jour avec une requête explicite
      console.log('🔄 [ADMIN] Mise à jour de is_approved vers true...');
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select(); // Récupérer les données mises à jour
      
      if (updateError) {
        console.error('❌ [ADMIN] Erreur lors de la mise à jour:', updateError);
        toast({
          title: "Erreur",
          description: `Erreur lors de l'approbation: ${updateError.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ [ADMIN] Mise à jour réussie, données retournées:', updateData);
      
      // Vérifier que la mise à jour a bien eu lieu
      const { data: verificationData, error: verificationError } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', userId)
        .single();
      
      if (verificationError) {
        console.error('❌ [ADMIN] Erreur lors de la vérification:', verificationError);
      } else {
        console.log('🔍 [ADMIN] Vérification après mise à jour:', verificationData);
      }
      
      // Mettre à jour l'état local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, is_approved: true } : user
        )
      );
      
      toast({
        title: "Utilisateur approuvé",
        description: "L'utilisateur peut maintenant accéder à l'application.",
      });
      
      console.log('✅ [ADMIN] Processus d\'approbation terminé avec succès');
      
      // Recharger les données après un délai plus court
      setTimeout(() => {
        console.log('🔄 [ADMIN] Rechargement des données pour vérification...');
        loadUsers();
      }, 1000);
      
    } catch (error) {
      console.error('💥 [ADMIN] Erreur inattendue lors de l\'approbation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive"
      });
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      console.log(`❌ [ADMIN] Début du rejet pour l'utilisateur ${userId}`);
      
      const { data: updateData, error } = await supabase
        .from('profiles')
        .update({ 
          is_approved: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();
      
      if (error) {
        console.error('❌ [ADMIN] Erreur lors du rejet:', error);
        toast({
          title: "Erreur",
          description: `Erreur lors du rejet: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ [ADMIN] Rejet réussi, données retournées:', updateData);
      
      // Mettre à jour l'état local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, is_approved: false } : user
        )
      );
      
      toast({
        title: "Utilisateur rejeté",
        description: "L'accès de l'utilisateur a été refusé.",
        variant: "destructive",
      });
      
      console.log('✅ [ADMIN] Processus de rejet terminé avec succès');
      
      // Recharger les données
      setTimeout(() => {
        loadUsers();
      }, 1000);
      
    } catch (error) {
      console.error('💥 [ADMIN] Erreur inattendue lors du rejet:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      console.log(`🗑️ [ADMIN] Suppression de l'utilisateur ${userId}`);
      
      // Supprimer l'utilisateur de la table profiles
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('❌ [ADMIN] Erreur lors de la suppression:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur.",
          variant: "destructive"
        });
        return;
      }
      
      // Mettre à jour l'état local
      setUsers(users.filter(user => user.id !== userId));
      setIsModalOpen(false);
      
      toast({
        title: "Utilisateur supprimé",
        description: "Le compte a été supprimé définitivement.",
        variant: "destructive",
      });
      
      console.log('✅ [ADMIN] Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('💥 [ADMIN] Erreur lors de la suppression:', error);
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

  const pendingUsers = users.filter(user => !user.is_approved);
  const approvedUsers = users.filter(user => user.is_approved);

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
          <Card className="bg-card/50 backdrop-blur-lg border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-semibold text-orange-500 font-sharp">{pendingUsers.length}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approuvés</p>
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
                  <p className="text-sm text-muted-foreground">Total</p>
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
                Supabase Profiles: {users.length} utilisateur(s) enregistré(s) | Dernière actualisation: {new Date().toLocaleTimeString('fr-FR')}
              </p>
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="bg-bright-turquoise/10 border-bright-turquoise/30 text-bright-turquoise hover:bg-bright-turquoise/20"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Utilisateurs en attente */}
        {pendingUsers.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-lg border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-orange-500 flex items-center gap-2 font-sharp">
                <Users className="h-5 w-5" />
                Utilisateurs en attente de validation ({pendingUsers.length})
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
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
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
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          En attente
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveUser(user.id)}
                            className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectUser(user.id)}
                            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
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

        {/* Utilisateurs approuvés */}
        {approvedUsers.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardHeader>
              <CardTitle className="text-xl text-green-500 flex items-center gap-2 font-sharp">
                <UserCheck className="h-5 w-5" />
                Utilisateurs approuvés ({approvedUsers.length})
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
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedUsers.map((user) => (
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
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Approuvé
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectUser(user.id)}
                            className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                          >
                            Révoquer
                          </Button>
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
              <Button
                onClick={handleRefresh}
                className="mt-4 bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser maintenant
              </Button>
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
        onApprove={(userId) => approveUser(userId)}
        onReject={(userId) => rejectUser(userId)}
        onRevoke={(userId) => rejectUser(userId)}
        onDelete={(userId) => deleteUser(userId)}
      />
    </div>
  );
};
