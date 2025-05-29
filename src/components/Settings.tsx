import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
interface SettingsProps {
  onBack: () => void;
}
export const Settings = ({
  onBack
}: SettingsProps) => {
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();
  console.log('⚙️ [SETTINGS] Auth state:', {
    isAuthenticated,
    user
  });
  return <div className="min-h-screen gradient-bg p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="text-bright-turquoise hover:text-bright-turquoise/80 hover:bg-bright-turquoise/10 mr-4">
          ← Retour
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
          Paramètres
        </h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Informations du profil */}
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader>
            <CardTitle className="text-bright-turquoise">Profil utilisateur</CardTitle>
            <CardDescription>Vos informations personnelles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAuthenticated && user ? <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prénom</p>
                    <p className="font-medium text-white">{user.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium text-white">{user.lastName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium text-white">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entreprise</p>
                  <p className="font-medium text-white">{user.company}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Property ID</p>
                  <p className="font-mono text-xs bg-background/50 p-2 rounded text-white">{user.id}</p>
                </div>
              </> : <div className="text-center py-4">
                <p className="text-muted-foreground">Aucune information utilisateur disponible</p>
                <p className="text-sm text-muted-foreground mt-2">Veuillez vous connecter pour voir vos informations</p>
              </div>}
          </CardContent>
        </Card>

        {/* Configuration technique */}
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          
          
        </Card>

        {/* Actions */}
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader>
            <CardTitle className="text-bright-turquoise">Actions</CardTitle>
            <CardDescription>Gérer votre session</CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? <Button onClick={logout} variant="destructive" className="w-full">
                Se déconnecter
              </Button> : <div className="text-center">
                <p className="text-muted-foreground mb-4">Vous n'êtes pas connecté</p>
                <Button onClick={() => window.location.href = '/login'} className="w-full">
                  Se connecter
                </Button>
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
};