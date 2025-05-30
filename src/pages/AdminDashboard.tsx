
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuditManager } from '@/hooks/useAuditManager';
import { RgpdDeleteModal } from '@/components/admin/RgpdDeleteModal';
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
  UserMinus
} from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
  const [isRgpdModalOpen, setIsRgpdModalOpen] = useState(false);
  
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

  const handleRgpdDelete = (user: AdminUserProfile) => {
    console.log('🔴 [ADMIN] Opening RGPD modal for user:', user.first_name, user.last_name);
    console.log('🔴 [ADMIN] Admin session token:', adminSessionToken ? 'Present' : 'Missing');
    
    // Transform to expected format
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
    
    setSelectedUser(transformedUser as any);
    setIsRgpdModalOpen(true);
  };

  const handleRgpdDeleteSuccess = async () => {
    console.log('✅ [ADMIN] RGPD deletion successful, refreshing data');
    setIsRgpdModalOpen(false);
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
    <div className="min-h-screen bg-gradient-to-br from-dark-navy via-[#1a1f3a] to-dark-navy p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-6">
        {/* Header optimisé mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent truncate">
              Administration Dorry.app
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground mt-1">
              Panel de contrôle et gestion système - RGPD Ready 🛡️
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-4"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="sm:hidden">Déconnexion</span>
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>

        {/* Stats Cards optimisées mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Users className="h-3 w-3 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Utilisateurs</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-400">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <UserCheck className="h-3 w-3 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Approuvés</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-400">{approvedUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <AlertCircle className="h-3 w-3 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">En attente</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-400">{pendingUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Activity className="h-3 w-3 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Sessions</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-400">{activeSessions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content avec tabs optimisés */}
        <Tabs defaultValue="users" className="space-y-3 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-lg h-8 sm:h-10 p-0.5 sm:p-1">
            <TabsTrigger value="users" className="flex items-center gap-1 text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2 h-7 sm:h-8">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="audits" className="flex items-center gap-1 text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2 h-7 sm:h-8">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Audits</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2 h-7 sm:h-8">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1 text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2 h-7 sm:h-8">
              <Database className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Système</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-3 sm:space-y-4">
            {/* Demandes en attente optimisées mobile */}
            {pendingUsers.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-lg border-orange-500/20">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="flex items-center gap-1 sm:gap-2 text-orange-400 text-sm sm:text-xl">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Demandes en attente ({pendingUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-4 p-3 sm:p-6">
                  {pendingUsers.map(user => (
                    <div key={user.id} className="p-2 sm:p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                            {user.first_name} {user.last_name}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.company}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'approve')}
                            disabled={actionLoading === `approve-${user.id}`}
                            className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 h-7 sm:h-8 px-2 sm:px-3 text-xs flex-1 sm:flex-none"
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            <span className="sm:hidden">✓</span>
                            <span className="hidden sm:inline">Approuver</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'reject')}
                            disabled={actionLoading === `reject-${user.id}`}
                            className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30 h-7 sm:h-8 px-2 sm:px-3 text-xs flex-1 sm:flex-none"
                          >
                            <UserX className="h-3 w-3 mr-1" />
                            <span className="sm:hidden">✗</span>
                            <span className="hidden sm:inline">Rejeter</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'delete')}
                            disabled={actionLoading === `delete-${user.id}`}
                            className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 h-7 sm:h-8 px-2 sm:px-3 text-xs flex-1 sm:flex-none"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            <span className="sm:hidden">🗑</span>
                            <span className="hidden sm:inline">Supprimer</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Utilisateurs approuvés optimisés mobile */}
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    <span className="text-sm sm:text-xl">Utilisateurs approuvés ({approvedUsers.length})</span>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs self-start sm:self-center">
                    🛡️ RGPD Ready
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  {approvedUsers.map(user => (
                    <div key={user.id} className="p-2 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                            {user.first_name} {user.last_name}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.company}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              Actif
                            </Badge>
                            <Badge className="bg-red-600/20 text-red-300 border-red-600/30 text-xs">
                              RGPD
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRgpdDelete(user)}
                            className="bg-red-600/20 text-red-300 border-red-600/30 hover:bg-red-600/30 h-7 sm:h-8 px-2 sm:px-3 text-xs w-full sm:w-auto"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            <span className="sm:hidden">RGPD</span>
                            <span className="hidden sm:inline">Suppression RGPD</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audits" className="space-y-3 sm:space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-xl">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-bright-turquoise" />
                  Audits RGPD et Conformité
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Gestion des audits de conformité et surveillance RGPD
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button 
                    onClick={handleRunAudit}
                    disabled={isAuditing}
                    className="bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="truncate">{isAuditing ? 'Audit en cours...' : 'Lancer audit RGPD'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={runUnitTests}
                    className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="truncate">Tests unitaires</span>
                  </Button>
                </div>

                {lastAuditReport && (
                  <div className="p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold text-blue-400 mb-2 text-sm sm:text-base">Dernier rapport d'audit</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-muted-foreground">Score</p>
                        <p className="font-bold text-blue-400">{lastAuditReport.compliance_score}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
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

          <TabsContent value="security" className="space-y-3 sm:space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-xl">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                  Logs de sécurité ({securityLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-1 sm:space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
                  {securityLogs.slice(0, 20).map(log => (
                    <div key={log.id} className="p-2 sm:p-3 bg-purple-500/10 rounded border border-purple-500/20">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                        <span className="font-mono text-xs sm:text-sm text-purple-400 truncate">{log.event_type}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        IP: {log.ip_address || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-3 sm:space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-xl">
                  <Database className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  Maintenance système
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Outils de nettoyage et maintenance de la base de données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                <Button
                  onClick={handleSecurityCleanup}
                  disabled={actionLoading === 'cleanup'}
                  className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {actionLoading === 'cleanup' ? 'Nettoyage...' : 'Nettoyage sécurité'}
                </Button>
                
                <div className="p-3 sm:p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <h4 className="font-semibold text-yellow-400 mb-2 text-sm sm:text-base">Sessions actives</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {activeSessions.length} session(s) utilisateur active(s)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal RGPD */}
      <RgpdDeleteModal
        user={selectedUser}
        isOpen={isRgpdModalOpen}
        onClose={() => {
          console.log('🚪 [ADMIN] Closing RGPD modal');
          setIsRgpdModalOpen(false);
          setSelectedUser(null);
        }}
        onDeleted={handleRgpdDeleteSuccess}
        adminSessionToken={adminSessionToken || ''}
      />
    </div>
  );
};

export default AdminDashboard;
