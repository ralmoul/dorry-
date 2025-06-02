import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuditManager } from '@/hooks/useAuditManager';
import { UserDetailsModal } from '@/components/admin/UserDetailsModal';
import { adminService, AdminUserProfile } from '@/services/adminService';
import { 
  Users, 
  Shield, 
  Activity, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  LogOut,
  Play,
  AlertCircle,
  Database,
  UserCheck,
  UserX,
  UserMinus,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  
  const { isAuthenticated, isLoading: authLoading, logout } = useAdminAuth();
  const { runMonthlyAudit, runUnitTests, isAuditing, lastAuditReport } = useAuditManager();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Récupérer le token de session admin depuis localStorage
  const adminSessionToken = localStorage.getItem('admin_session_token');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [usersData, logsData, sessionsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getSecurityLogs(50),
        adminService.getActiveSessions()
      ]);

      setUsers(usersData);
      setSecurityLogs(logsData);
      setActiveSessions(sessionsData);
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données du tableau de bord.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'delete' | 'revoke') => {
    setActionLoading(`${action}-${userId}`);
    
    try {
      switch (action) {
        case 'approve':
          await adminService.approveUser(userId);
          toast({
            title: "Utilisateur approuvé",
            description: "L'utilisateur a été approuvé avec succès."
          });
          break;
        case 'reject':
          await adminService.rejectUser(userId);
          toast({
            title: "Utilisateur rejeté",
            description: "L'utilisateur a été rejeté."
          });
          break;
        case 'delete':
          await adminService.deleteUser(userId);
          toast({
            title: "Utilisateur supprimé",
            description: "L'utilisateur a été supprimé définitivement."
          });
          break;
        case 'revoke':
          await adminService.rejectUser(userId);
          toast({
            title: "Accès révoqué",
            description: "L'accès de l'utilisateur a été révoqué."
          });
          break;
      }
      
      // Recharger les données
      await loadDashboardData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Impossible d'effectuer l'action: ${action}`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewUserDetails = (user: AdminUserProfile) => {
    console.log('🔍 [ADMIN] Opening user details for:', user.first_name, user.last_name);
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
  };

  const handleUserDetailsModalClose = () => {
    console.log('🚪 [ADMIN] Closing user details modal');
    setIsUserDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserDetailsAction = async (userId: string) => {
    console.log('🔄 [ADMIN] User details action completed, refreshing data');
    await loadDashboardData();
    setIsUserDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSecurityCleanup = async () => {
    setActionLoading('cleanup');
    try {
      await adminService.triggerSecurityCleanup();
      toast({
        title: "Nettoyage effectué",
        description: "Le nettoyage de sécurité a été effectué avec succès."
      });
      await loadDashboardData();
    } catch (error) {
      toast({
        title: "Erreur de nettoyage",
        description: "Impossible d'effectuer le nettoyage de sécurité.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  const handleRunAudit = async () => {
    try {
      await runMonthlyAudit();
      toast({
        title: "Audit lancé",
        description: "L'audit RGPD a été lancé avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur d'audit",
        description: "Impossible de lancer l'audit RGPD.",
        variant: "destructive"
      });
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bright-turquoise mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  const pendingUsers = users.filter(user => !user.is_approved);
  const approvedUsers = users.filter(user => user.is_approved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-navy via-[#1a1f3a] to-dark-navy p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-6">
        {/* Header mobile optimisé */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent truncate">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-base text-muted-foreground">
                Panel de contrôle RGPD Ready 🛡️
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs px-3 py-2"
            >
              <LogOut className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards mobile optimisé */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-3">
              <div className="text-center">
                <Users className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-blue-400">{users.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-3">
              <div className="text-center">
                <UserCheck className="h-4 w-4 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Approuvés</p>
                <p className="text-lg font-bold text-green-400">{approvedUsers.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-3">
              <div className="text-center">
                <AlertCircle className="h-4 w-4 text-orange-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">En attente</p>
                <p className="text-lg font-bold text-orange-400">{pendingUsers.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-3">
              <div className="text-center">
                <Activity className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Sessions</p>
                <p className="text-lg font-bold text-purple-400">{activeSessions.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs mobile optimisé */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-lg h-auto p-1">
            <TabsTrigger value="users" className="text-xs p-2 h-auto">
              <Users className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="audits" className="text-xs p-2 h-auto">
              <Shield className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">Audits</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs p-2 h-auto">
              <Activity className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs p-2 h-auto">
              <Database className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">Système</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* Demandes en attente mobile optimisé */}
            {pendingUsers.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-lg border-orange-500/20">
                <CardHeader className="p-3">
                  <CardTitle className="flex items-center gap-2 text-orange-400 text-base">
                    <AlertCircle className="h-4 w-4" />
                    En attente ({pendingUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-3">
                    {pendingUsers.map(user => (
                      <div key={user.id} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {user.first_name} {user.last_name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.company}</p>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                            Attente
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleViewUserDetails(user)}
                            className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 h-7 px-2 text-xs"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'approve')}
                            disabled={actionLoading === `approve-${user.id}`}
                            className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 h-7 px-2 text-xs"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'reject')}
                            disabled={actionLoading === `reject-${user.id}`}
                            className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30 h-7 px-2 text-xs"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'delete')}
                            disabled={actionLoading === `delete-${user.id}`}
                            className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 h-7 px-2 text-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Utilisateurs approuvés mobile optimisé */}
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardHeader className="p-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Approuvés ({approvedUsers.length})</span>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                    🛡️ RGPD
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  {approvedUsers.map(user => (
                    <div key={user.id} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">
                            {user.first_name} {user.last_name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.company}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Actif
                          </Badge>
                          <Badge className="bg-red-600/20 text-red-300 border-red-600/30 text-xs">
                            RGPD
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleViewUserDetails(user)}
                          className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 h-7 px-2 text-xs flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audits" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardHeader className="p-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4 text-bright-turquoise" />
                  Audits RGPD
                </CardTitle>
                <CardDescription className="text-xs">
                  Gestion conformité et surveillance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={handleRunAudit}
                    disabled={isAuditing}
                    className="bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold h-9 text-sm"
                  >
                    <Play className="h-3 w-3 mr-2" />
                    {isAuditing ? 'Audit en cours...' : 'Lancer audit RGPD'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={runUnitTests}
                    className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 h-9 text-sm"
                  >
                    <Activity className="h-3 w-3 mr-2" />
                    Tests unitaires
                  </Button>
                </div>

                {lastAuditReport && (
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold text-blue-400 mb-2 text-sm">Dernier rapport</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-muted-foreground">Score</p>
                        <p className="font-bold text-blue-400">{lastAuditReport.compliance_score}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-bold">{lastAuditReport.total_consents}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardHeader className="p-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-purple-400" />
                  Logs sécurité ({securityLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {securityLogs.slice(0, 10).map(log => (
                    <div key={log.id} className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-purple-400 truncate">{log.event_type}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        IP: {log.ip_address || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardHeader className="p-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="h-4 w-4 text-green-400" />
                  Maintenance système
                </CardTitle>
                <CardDescription className="text-xs">
                  Nettoyage et maintenance DB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                <Button
                  onClick={handleSecurityCleanup}
                  disabled={actionLoading === 'cleanup'}
                  className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 h-9 text-sm w-full"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  {actionLoading === 'cleanup' ? 'Nettoyage...' : 'Nettoyage sécurité'}
                </Button>
                
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <h4 className="font-semibold text-yellow-400 mb-1 text-sm">Sessions actives</h4>
                  <p className="text-xs text-muted-foreground">
                    {activeSessions.length} session(s) active(s)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal UserDetailsModal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isUserDetailsModalOpen}
        onClose={handleUserDetailsModalClose}
        onApprove={(userId) => handleUserAction(userId, 'approve')}
        onReject={(userId) => handleUserAction(userId, 'reject')}
        onDelete={handleUserDetailsAction}
        onRevoke={(userId) => handleUserAction(userId, 'revoke')}
        adminSessionToken={adminSessionToken || ''}
      />
    </div>
  );
};

export default AdminDashboard;
