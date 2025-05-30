
import { useState } from 'react';
import { AdminPanel } from '@/components/AdminPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const ADMIN_PASSWORD = 'TBv$nq7A#9sDSTt';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Vérification plus rapide (200ms au lieu de 500ms)
    await new Promise(resolve => setTimeout(resolve, 200));

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Accès autorisé",
        description: "Bienvenue dans l'interface d'administration.",
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Mot de passe incorrect.",
        variant: "destructive"
      });
      setPassword('');
    }
    setIsLoading(false);
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (isAuthenticated) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4 bg-[#4649ee]/75 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToHome}
        className="absolute top-6 left-6 text-white hover:text-white/80 hover:bg-white/10 z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Accueil
      </Button>

      <Card className="w-full max-w-sm sm:max-w-md bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader className="text-center p-4 sm:p-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-dark-navy" />
          </div>
          <CardTitle className="font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent text-2xl sm:text-3xl">
            Administration
          </CardTitle>
          <CardDescription className="text-white text-sm sm:text-base">
            Accès réglementé - Mot de passe requis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-white">
                Mot de passe administrateur
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Entrez le mot de passe"
                className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-11 text-white placeholder:text-gray-400"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold h-11"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-navy"></div>
                  <span>Vérification...</span>
                </div>
              ) : (
                'Accéder à l\'administration'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-xs text-white">
              Accès autorisé uniquement pour l'administrateur
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
