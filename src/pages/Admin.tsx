import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuditManager } from '@/hooks/useAuditManager';
import { adminService, AdminUserProfile } from '@/services/adminService';
import { UserDetailsModal } from '@/components/admin/UserDetailsModal';
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
  UserMinus
} from 'lucide-react';

const Admin = () => {
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'delete') => {
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
      }
      
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

  const openUserDetails = (user: AdminUserProfile) => {
    console.log('🔍 [DEBUG] Ouverture détails utilisateur:', user.first_name, user.last_name);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUserDeleted = async () => {
    console.log('✅ [DEBUG] Utilisateur supprimé via RGPD, rechargement des données...');
    setIsModalOpen(false);
    setSelectedUser(null);
    await loadDashboardData();
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-navy via-[#1a1f3a] to-dark-navy p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
                Administration Dorry.app
              </h1>
              <p className="text-muted-foreground mt-1">
                Panel de contrôle et gestion système - RGPD Ready 🛡️
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Utilisateurs</p>
                    <p className="text-2xl font-bold text-blue-400">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Approuvés</p>
                    <p className="text-2xl font-bold text-green-400">{approvedUsers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">En attente</p>
                    <p className="text-2xl font-bold text-orange-400">{pendingUsers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Sessions actives</p>
                    <p className="text-2xl font-bold text-purple-400">{activeSessions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-lg">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="audits" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Audits RGPD
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Système
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              {/* Demandes en attente */}
              {pendingUsers.length > 0 && (
                <Card className="bg-card/50 backdrop-blur-lg border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <AlertCircle className="h-5 w-5" />
                      Demandes de compte en attente ({pendingUsers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingUsers.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="flex-1 cursor-pointer" onClick={() => openUserDetails(user)}>
                          <h4 className="font-semibold text-white">
                            {user.first_name} {user.last_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.company}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'approve')}
                            disabled={actionLoading === `approve-${user.id}`}
                            className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'reject')}
                            disabled={actionLoading === `reject-${user.id}`}
                            className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'delete')}
                            disabled={actionLoading === `delete-${user.id}`}
                            className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                          >
                            <UserMinus className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Utilisateurs approuvés */}
              <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Utilisateurs approuvés ({approvedUsers.length})
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 ml-2">
                      🛡️ RGPD Ready
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {approvedUsers.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20 cursor-pointer hover:bg-green-500/15 transition-colors" onClick={() => openUserDetails(user)}>
                        <div>
                          <h4 className="font-semibold text-white">
                            {user.first_name} {user.last_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Actif
                          </Badge>
                          <Badge className="bg-red-600/20 text-red-300 border-red-600/30 text-xs">
                            RGPD
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audits" className="space-y-4">
              <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-bright-turquoise" />
                    Audits RGPD et Conformité
                  </CardTitle>
                  <CardDescription>
                    Gestion des audits de conformité et surveillance RGPD
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleRunAudit}
                      disabled={isAuditing}
                      className="bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isAuditing ? 'Audit en cours...' : 'Lancer audit RGPD'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={runUnitTests}
                      className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Tests unitaires
                    </Button>
                  </div>

                  {lastAuditReport && (
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <h4 className="font-semibold text-blue-400 mb-2">Dernier rapport d'audit</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Score de conformité</p>
                          <p className="font-bold text-blue-400">{lastAuditReport.compliance_score}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total consentements</p>
                          <p className="font-bold">{lastAuditReport.total_consents}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Acceptés</p>
                          <p className="font-bold text-green-400">{lastAuditReport.consents_given}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Refusés</p>
                          <p className="font-bold text-red-400">{lastAuditReport.consents_refused}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    Logs de sécurité ({securityLogs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {securityLogs.slice(0, 20).map(log => (
                      <div key={log.id} className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-purple-400">{log.event_type}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-400" />
                    Maintenance système
                  </CardTitle>
                  <CardDescription>
                    Outils de nettoyage et maintenance de la base de données
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleSecurityCleanup}
                    disabled={actionLoading === 'cleanup'}
                    className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {actionLoading === 'cleanup' ? 'Nettoyage...' : 'Nettoyage sécurité'}
                  </Button>
                  
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <h4 className="font-semibold text-yellow-400 mb-2">Sessions actives</h4>
                    <p className="text-sm text-muted-foreground">
                      {activeSessions.length} session(s) utilisateur active(s)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal de détails utilisateur avec RGPD */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          console.log('🚪 [DEBUG] Fermeture modal détails utilisateur');
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onApprove={(userId) => handleUserAction(userId, 'approve')}
        onReject={(userId) => handleUserAction(userId, 'reject')}
        onDelete={(userId) => handleUserAction(userId, 'delete')}
        onRevoke={(userId) => console.log('Révocation utilisateur:', userId)}
        adminSessionToken={adminSessionToken || ''}
      />
    </>
  );
};

export default Admin;
