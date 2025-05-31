
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user?.isApproved) {
      console.log('✅ [LOGIN_FORM] User already authenticated, redirecting to app');
      navigate('/app');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Tentative de connexion...');
    setIsLoading(true);

    try {
      const result = await login({
        email,
        password,
        rememberMe
      });

      if (result.success) {
        console.log('✅ Connexion réussie, redirection vers /app...');
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté."
        });
        // Navigation automatique vers l'application
        navigate('/app');
      } else {
        console.log('❌ Échec de la connexion:', result.message);
        toast({
          title: "Erreur de connexion",
          description: result.message || "Email ou mot de passe incorrect",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('💥 Erreur lors de la connexion:', error);
      toast({
        title: "Erreur",
        description: "Email ou mot de passe incorrect",
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
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4 bg-[4649eebf] bg-[#4649ee]/75 relative">
      {/* Bouton retour en haut à gauche de la page */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleBackToHome} 
        className="absolute top-6 left-6 text-white hover:text-white/80 hover:bg-white/10 z-10"
        disabled={isLoading}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Accueil
      </Button>

      <Card className="w-full max-w-sm sm:max-w-md bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent text-2xl sm:text-3xl">
            Dorry
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-white">
            Votre assistante vocal intelligent vous attend
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={isLoading}
                className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-10 sm:h-11 text-white placeholder:text-gray-400" 
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm text-white">Mot de passe</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={isLoading}
                  className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise pr-10 h-10 sm:h-11 text-white placeholder:text-gray-400" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-bright-turquoise text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                disabled={isLoading}
                className="border-bright-turquoise/50 data-[state=checked]:bg-bright-turquoise data-[state=checked]:border-bright-turquoise" 
              />
              <Label htmlFor="rememberMe" className="text-xs sm:text-sm text-white">
                Rester connecté
              </Label>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold h-10 sm:h-11 text-sm sm:text-base"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>
          <div className="mt-3 sm:mt-4 text-center">
            <button 
              type="button" 
              onClick={onSwitchToSignup} 
              className="text-bright-turquoise hover:text-bright-turquoise/80 text-xs sm:text-sm"
              disabled={isLoading}
            >
              Créer un compte
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
