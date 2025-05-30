
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Users, UserCheck, Clock, Trash2, Eye, RefreshCw, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserDetailsModal } from './admin/UserDetailsModal';
import { AuditPanel } from './admin/AuditPanel';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseProfile } from '@/types/auth';
import { AdminUserProfile } from '@/services/adminService';

export const AdminPanel = () => {
  const [users, setUsers] = useState<DatabaseProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  // Récupérer le token de session admin depuis localStorage
  const adminSessionToken = localStorage.getItem('admin_session_token') || '';

  useEffect(() => {
    loadUsers();
    // Setup immediate realtime subscription
    const cleanup = setupRealtimeSubscription();
    
    return cleanup;
  }, []);

  const setupRealtimeSubscription = () => {
    console.log('📡 [ADMIN] Setting up IMMEDIATE realtime subscription for all profile changes');
    
    const channel = supabase
      .channel('admin-profiles-realtime-immediate')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter TOUS les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('📡 [ADMIN] IMMEDIATE profile change detected:', payload.eventType, payload);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe((status) => {
        console.log('📡 [ADMIN] Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ [ADMIN] Real-time subscription ACTIVE - all changes will appear immediately');
        }
      });

    return () => {
      console.log('🔌 [ADMIN] Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  };

  const handleRealtimeUpdate = (payload: any) => {
    console.log('🔄 [ADMIN] Processing IMMEDIATE realtime update:', payload.eventType, payload);
    
    switch (payload.eventType) {
      case 'INSERT':
        console.log('➕ [ADMIN] NEW USER - Adding to list immediately:', payload.new);
        setUsers(prev => {
          const exists = prev.some(user => user.id === payload.new.id);
          if (!exists) {
            const newUsers = [payload.new, ...prev];
            console.log('📊 [ADMIN] Users list updated - total:', newUsers.length);
            return newUsers;
          }
          return prev;
        });
        
        toast({
          title: "✨ Nouvelle demande",
          description: `${payload.new.first_name} ${payload.new.last_name} vient de s'inscrire`,
        });
        break;
        
      case 'UPDATE':
        console.log('🔄 [ADMIN] USER UPDATE - Updating status immediately:', payload.new);
        setUsers(prev => {
          const updated = prev.map(user => 
            user.id === payload.new.id ? payload.new : user
          );
          console.log('📊 [ADMIN] User status updated in list');
          return updated;
        });
        
        const statusText = payload.new.is_approved ? 'approuvé' : 'désapprouvé';
        toast({
          title: "✅ Statut mis à jour",
          description: `${payload.new.first_name} ${payload.new.last_name} est maintenant ${statusText}`,
        });
        break;
        
      case 'DELETE':
        console.log('🗑️ [ADMIN] USER DELETE - Removing from list immediately:', payload.old);
        setUsers(prev => {
          const filtered = prev.filter(user => user.id !== payload.old.id);
          console.log('📊 [ADMIN] User removed from list - remaining:', filtered.length);
          return filtered;
        });
        
        toast({
          title: "🗑️ Utilisateur supprimé",
          description: "L'utilisateur a été supprimé définitivement",
          variant: "destructive",
        });
        break;
    }
  };

  const loadUsers = async () => {
    try {
      console.log('📊 [ADMIN] Loading users from Supabase...');
      setIsLoading(true);
      
      const { data: usersData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [ADMIN] Error loading users:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ [ADMIN] Users loaded:', usersData?.length || 0);
      setUsers(usersData || []);
    } catch (error) {
      console.error('💥 [ADMIN] Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      console.log(`✅ [ADMIN] Approving user ${userId} - updating profiles table`);
      setIsUpdating(userId);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (profileError) {
        console.error('❌ [ADMIN] Error updating profile:', profileError);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil utilisateur.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ [ADMIN] User approved successfully');
      setIsModalOpen(false);
      
      toast({
        title: "✅ Utilisateur approuvé",
        description: "L'utilisateur a été approuvé avec succès et peut maintenant se connecter.",
      });
      
    } catch (error) {
      console.error('💥 [ADMIN] Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const revokeUser = async (userId: string) => {
    try {
      console.log(`🚫 [ADMIN] Revoking user ${userId} - updating profiles and signing out`);
      setIsUpdating(userId);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_approved: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (profileError) {
        console.error('❌ [ADMIN] Error updating profile:', profileError);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil utilisateur.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ [ADMIN] User revoked successfully');
      setIsModalOpen(false);
      
      toast({
        title: "⚠️ Utilisateur révoqué",
        description: "L'accès de l'utilisateur a été révoqué.",
        variant: "destructive"
      });
      
    } catch (error) {
      console.error('💥 [ADMIN] Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      console.log(`🗑️ [ADMIN] Completely deleting user ${userId} using Edge Function`);
      setIsUpdating(userId);
      
      // Appeler la fonction Edge pour supprimer l'utilisateur
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });
      
      if (error) {
        console.error('❌ [ADMIN] Error calling delete function:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur.",
          variant: "destructive"
        });
        return;
      }
      
      if (data.error) {
        console.error('❌ [ADMIN] Delete function returned error:', data.error);
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive"
        });
        return;
      }
      
      console.log('🎉 [ADMIN] User completely deleted');
      setIsModalOpen(false);
      
      toast({
        title: "🗑️ Suppression complète",
        description: "L'utilisateur a été supprimé de l'authentification et des profils. L'email est maintenant disponible.",
      });
      
    } catch (error) {
      console.error('💥 [ADMIN] Unexpected error during deletion:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de la suppression.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const openUserDetails = (user: DatabaseProfile) => {
    console.log('🔍 [ADMIN] Opening user details for:', user.first_name, user.last_name);
    // Transform DatabaseProfile to AdminUserProfile format
    const adminUserProfile: AdminUserProfile = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      is_approved: user.is_approved,
      created_at: user.created_at
    };
    setSelectedUser(adminUserProfile);
    setIsModalOpen(true);
  };

  const pendingUsers = users.filter(user => !user.is_approved);
  const approvedUsers = users.filter(user => user.is_approved);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg p-2 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-4 sm:p-12 text-center">
              <RefreshCw className="w-8 h-8 sm:w-16 sm:h-16 text-bright-turquoise animate-spin mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 font-sharp">Chargement en cours...</h3>
              <p className="text-muted-foreground text-xs sm:text-base">
                Synchronisation avec la base de données Supabase.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-2 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-6">
        {/* Header */}
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent flex items-center gap-1 sm:gap-2">
              <Users className="h-5 w-5 sm:h-8 sm:w-8 text-bright-turquoise" />
              <span className="text-sm sm:text-2xl">Admin Dory ⚡</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-base">
              📡 Gestion • 🔍 Audit • ⚖️ Conformité
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Tabs pour organiser l'interface */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-lg border-bright-turquoise/20 h-auto p-1">
            <TabsTrigger value="users" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3 h-8 sm:h-auto">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Utilisateurs</span>
              <span className="xs:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3 h-8 sm:h-auto">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Audit RGPD</span>
              <span className="xs:hidden">RGPD</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Gestion Utilisateurs */}
          <TabsContent value="users" className="space-y-3 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-1 sm:gap-4">
              <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
                <CardContent className="p-2 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Attente</p>
                      <p className="text-sm sm:text-2xl font-semibold text-orange-500 font-sharp">{pendingUsers.length}</p>
                    </div>
                    <Clock className="h-4 w-4 sm:h-8 sm:w-8 text-orange-500/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
                <CardContent className="p-2 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Validés</p>
                      <p className="text-sm sm:text-2xl font-semibold text-green-500 font-sharp">{approvedUsers.length}</p>
                    </div>
                    <UserCheck className="h-4 w-4 sm:h-8 sm:w-8 text-green-500/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
                <CardContent className="p-2 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-sm sm:text-2xl font-semibold font-sharp">{users.length}</p>
                    </div>
                    <Users className="h-4 w-4 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Control Panel */}
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardContent className="p-2 sm:p-4">
                <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-xs text-muted-foreground">
                      Sync temps réel
                    </p>
                  </div>
                  <Button 
                    onClick={loadUsers}
                    variant="outline"
                    size="sm"
                    className="bg-bright-turquoise/10 border-bright-turquoise/30 text-bright-turquoise hover:bg-bright-turquoise/20 text-xs h-7 sm:h-9 px-2 sm:px-3 py-1 sm:py-2"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Actualiser</span>
                    <span className="sm:hidden">Sync</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Users */}
            {pendingUsers.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-lg border-orange-500/20">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="text-base sm:text-xl text-orange-500 flex items-center gap-1 sm:gap-2 font-sharp">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                    🔥 En attente ({pendingUsers.length})
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    🚨 Comptes nécessitant validation
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  {/* Version mobile optimisée */}
                  <div className="block sm:hidden">
                    <div className="max-h-96 overflow-y-auto">
                      {pendingUsers.map((user) => (
                        <div key={user.id} className="p-3 border-b border-orange-500/20 last:border-b-0 bg-orange-500/5">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium font-sharp text-sm truncate">
                                {user.first_name} {user.last_name}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.company}</p>
                            </div>
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs ml-2 flex-shrink-0">
                              ⏳
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openUserDetails(user)}
                              className="bg-bright-turquoise/10 border-bright-turquoise/30 text-bright-turquoise hover:bg-bright-turquoise/20 text-xs h-6 px-1 py-0 min-w-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approveUser(user.id)}
                              disabled={isUpdating === user.id}
                              className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs h-6 px-1 py-0 min-w-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteUser(user.id)}
                              disabled={isUpdating === user.id}
                              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs h-6 px-1 py-0 min-w-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Version desktop - Tableau */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Entreprise</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Inscription</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium font-sharp">
                              {user.first_name} {user.last_name}
                              <div className="text-sm text-muted-foreground">{user.phone}</div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.company}</TableCell>
                            <TableCell>
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                ⏳ En attente
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
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
                                  onClick={() => approveUser(user.id)}
                                  disabled={isUpdating === user.id}
                                  className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteUser(user.id)}
                                  disabled={isUpdating === user.id}
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
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Approved Users */}
            {approvedUsers.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-lg border-green-500/20">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="text-base sm:text-xl text-green-500 flex items-center gap-1 sm:gap-2 font-sharp">
                    <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                    Utilisateurs approuvés ({approvedUsers.length})
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Comptes validés avec accès complet
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  {/* Version mobile optimisée */}
                  <div className="block sm:hidden">
                    <div className="max-h-96 overflow-y-auto">
                      {approvedUsers.map((user) => (
                        <div key={user.id} className="p-3 border-b border-green-500/20 last:border-b-0 bg-green-500/5">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium font-sharp text-sm truncate">
                                {user.first_name} {user.last_name}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.company}</p>
                            </div>
                            <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                ✓
                              </Badge>
                              <Badge className="bg-red-600/20 text-red-300 border-red-600/30 text-xs">
                                RGPD
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openUserDetails(user)}
                              className="bg-bright-turquoise/10 border-bright-turquoise/30 text-bright-turquoise hover:bg-bright-turquoise/20 text-xs h-6 px-1 py-0 min-w-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => revokeUser(user.id)}
                              disabled={isUpdating === user.id}
                              className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 text-xs h-6 px-1 py-0 min-w-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteUser(user.id)}
                              disabled={isUpdating === user.id}
                              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs h-6 px-1 py-0 min-w-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Version desktop - Tableau */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Entreprise</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Validation</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium font-sharp">
                              {user.first_name} {user.last_name}
                              <div className="text-sm text-muted-foreground">{user.phone}</div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.company}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                  Approuvé
                                </Badge>
                                <Badge className="bg-red-600/20 text-red-300 border-red-600/30 text-xs">
                                  RGPD
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(user.updated_at).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
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
                                  onClick={() => revokeUser(user.id)}
                                  disabled={isUpdating === user.id}
                                  className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                                >
                                  Révoquer
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteUser(user.id)}
                                  disabled={isUpdating === user.id}
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
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {users.length === 0 && (
              <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
                <CardContent className="p-6 sm:p-12 text-center">
                  <Users className="h-8 w-8 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2 font-sharp">Aucun utilisateur</h3>
                  <p className="text-muted-foreground text-xs sm:text-base">
                    Les nouvelles demandes apparaîtront instantanément ici.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Audit RGPD */}
          <TabsContent value="audit">
            <AuditPanel />
          </TabsContent>
        </Tabs>

        {/* User Details Modal */}
        <UserDetailsModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={(userId) => approveUser(userId)}
          onReject={(userId) => deleteUser(userId)}
          onRevoke={(userId) => revokeUser(userId)}
          onDelete={(userId) => deleteUser(userId)}
          adminSessionToken={adminSessionToken}
        />
      </div>
    </div>
  );
};
