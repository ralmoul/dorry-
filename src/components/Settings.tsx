
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen gradient-bg p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-bright-turquoise hover:text-bright-turquoise/80 hover:bg-bright-turquoise/10 mr-4"
        >
          ← Retour
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
          Paramètres
        </h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Préférences d'affichage */}
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader>
            <CardTitle className="text-bright-turquoise">Préférences d'affichage</CardTitle>
            <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <Label htmlFor="theme-toggle" className="text-sm font-medium">
                  Mode sombre
                </Label>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Basculez entre le mode clair et sombre selon vos préférences
            </p>
          </CardContent>
        </Card>

        {/* Informations du profil */}
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader>
            <CardTitle className="text-bright-turquoise">Profil utilisateur</CardTitle>
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
              <p className="font-mono text-xs bg-background/50 p-2 rounded">{user?.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Configuration technique */}
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader>
            <CardTitle className="text-bright-turquoise">Configuration</CardTitle>
            <CardDescription>Paramètres techniques de l'application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">URL de transmission</p>
              <p className="font-mono text-xs bg-background/50 p-2 rounded break-all">
                https://n8n-4m8i.onrender.com/webhook-test/d4e8f563-b641-484a-8e40-8ef6564362f2
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tous vos messages vocaux sont automatiquement transmis à cette adresse
              </p>
            </div>
            
            <Separator className="bg-bright-turquoise/20" />
            
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
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader>
            <CardTitle className="text-bright-turquoise">Actions</CardTitle>
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
  );
};
