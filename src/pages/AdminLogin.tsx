
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(password);
      
      if (result.success) {
        toast({
          title: "Accès administrateur autorisé",
          description: "Redirection vers le panel d'administration...",
        });
        navigate('/admin-dashboard');
      } else {
        toast({
          title: "Accès refusé",
          description: result.message || "Mot de passe incorrect.",
          variant: "destructive"
        });
        setPassword('');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Une erreur s'est produite lors de la connexion.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

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
            Accès sécurisé - Authentification requise
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-white">
                Mot de passe administrateur
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Entrez le mot de passe maître"
                  className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-11 text-white placeholder:text-gray-400 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold h-11"
            >
              {isLoading ? 'Vérification...' : 'Accéder à l\'administration'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
