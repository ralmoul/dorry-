
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Moon, Sun } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar gauche (identique) */}
      <div className="w-64 bg-card/50 backdrop-blur-sm border-r border-border p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ai-cyan to-ai-blue bg-clip-text text-transparent">
            Dory
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Assistant vocal IA
          </p>
        </div>
        
        {user && (
          <div className="mb-auto">
            <p className="text-sm text-muted-foreground">Bonjour,</p>
            <p className="text-lg font-semibold text-foreground">{user.firstName}</p>
          </div>
        )}
      </div>

      {/* Zone principale des paramètres */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-ai-blue hover:text-ai-cyan hover:bg-accent mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ai-cyan to-ai-blue bg-clip-text text-transparent">
            Paramètres
          </h1>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Paramètres d'affichage */}
          <Card className="glassmorphism border-border/50">
            <CardHeader>
              <CardTitle className="text-ai-blue flex items-center gap-2">
                {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                Apparence
              </CardTitle>
              <CardDescription>Personnalisez l'affichage de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mode d'affichage</p>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'light' ? 'Mode clair actuel' : 'Mode sombre actuel'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-ai-cyan" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-ai-blue"
                  />
                  <Moon className="w-4 h-4 text-ai-purple" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations du profil */}
          <Card className="glassmorphism border-border/50">
            <CardHeader>
              <CardTitle className="text-ai-green">Profil utilisateur</CardTitle>
              <CardDescription>Vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prénom</p>
                  <p className="font-medium">{user?.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{user?.lastName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{user?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entreprise</p>
                <p className="font-medium">{user?.company}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID utilisateur</p>
                <p className="font-mono text-xs bg-muted/50 p-2 rounded">{user?.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Configuration technique */}
          <Card className="glassmorphism border-border/50">
            <CardHeader>
              <CardTitle className="text-ai-purple">Configuration</CardTitle>
              <CardDescription>Paramètres techniques de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">URL de transmission</p>
                <p className="font-mono text-xs bg-muted/50 p-2 rounded break-all">
                  https://n8n-4m8i.onrender.com/webhook-test/d4e8f563-b641-484a-8e40-8ef6564362f2
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tous vos messages vocaux sont automatiquement transmis à cette adresse
                </p>
              </div>
              
              <Separator className="bg-border/50" />
              
              <div>
                <p className="text-sm text-muted-foreground">Qualité audio</p>
                <p className="font-medium">Haute qualité (44.1 kHz)</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Format d'enregistrement</p>
                <p className="font-medium">WebM avec codec Opus</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="glassmorphism border-border/50">
            <CardHeader>
              <CardTitle className="text-ai-pink">Actions</CardTitle>
              <CardDescription>Gérer votre session</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={logout}
                variant="destructive"
                className="w-full"
              >
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
