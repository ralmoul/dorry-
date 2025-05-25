
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Users, UserCheck, Clock, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserDetailsModal } from './admin/UserDetailsModal';

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

export const AdminPanel = () => {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    console.log('Chargement des utilisateurs...');
    const savedUsers = JSON.parse(localStorage.getItem('dory_users') || '[]');
    console.log('Utilisateurs chargés depuis localStorage:', savedUsers);
    setUsers(savedUsers);
  };

  const updateUserStatus = (userId: string, isApproved: boolean) => {
    console.log(`Mise à jour du statut de l'utilisateur ${userId} vers ${isApproved ? 'approuvé' : 'rejeté'}`);
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isApproved } : user
    );
    
    localStorage.setItem('dory_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setIsModalOpen(false);
    
    const action = isApproved ? 'approuvé' : 'rejeté';
    toast({
      title: `Utilisateur ${action}`,
      description: `Le compte a été ${action} avec succès.`,
      variant: isApproved ? "default" : "destructive",
    });
  };

  const deleteUser = (userId: string) => {
    console.log(`Suppression de l'utilisateur ${userId}`);
    const updatedUsers = users.filter(user => user.id !== userId);
    localStorage.setItem('dory_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setIsModalOpen(false);
    
    toast({
      title: "Utilisateur supprimé",
      description: "Le compte a été supprimé définitivement.",
      variant: "destructive",
    });
  };

  const openUserDetails = (user: PendingUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const pendingUsers = users.filter(user => !user.isApproved);
  const approvedUsers = users.filter(user => user.isApproved);

  console.log('Utilisateurs en attente:', pendingUsers);
  console.log('Utilisateurs approuvés:', approvedUsers);

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
              Gérez les demandes de création de compte et les utilisateurs approuvés
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
                  <p className="text-sm text-muted-foreground">Utilisateurs approuvés</p>
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

        {/* Bouton pour recharger les données */}
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Debug: {users.length} utilisateur(s) total - {pendingUsers.length} en attente - {approvedUsers.length} approuvé(s)
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

        {pendingUsers.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardHeader>
              <CardTitle className="text-xl text-bright-turquoise flex items-center gap-2 font-sharp">
                <Clock className="h-5 w-5" />
                Demandes en attente ({pendingUsers.length})
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
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium font-sharp">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.company}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
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
                            onClick={() => updateUserStatus(user.id, true)}
                            className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                          >
                            <Check className="h-4 w-4" />
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
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium font-sharp">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.company}</TableCell>
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
                            onClick={() => openUserDetails(user)}
                            className="bg-bright-turquoise/10 border-bright-turquoise/30 text-bright-turquoise hover:bg-bright-turquoise/20"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, false)}
                            className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                          >
                            Révoquer
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
                Aucune demande de création de compte n'a été reçue pour le moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <UserDetailsModal
        user={selectedUser}
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
