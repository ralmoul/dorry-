
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Vérifications basiques
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast({
        title: "Erreur",
        description: "Prénom, nom, email et mot de passe sont obligatoires.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup(formData);
      if (success) {
        toast({
          title: "Compte créé",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter."
        });
        // Rediriger vers login après succès
        setTimeout(() => {
          onSwitchToLogin();
        }, 1500);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer le compte. Vérifiez vos informations.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      toast({
        title: "Erreur",
        description: "Une erreur technique est survenue.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4 bg-[#4649ee]/75 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToHome}
        className="absolute top-6 left-6 text-bright-turquoise hover:text-bright-turquoise/80 hover:bg-bright-turquoise/10 z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Accueil
      </Button>

      <Card className="w-full max-w-sm sm:max-w-md bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Rejoindre Dorry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="firstName" className="text-sm text-white">Prénom *</Label>
                <Input id="firstName" value={formData.firstName} onChange={handleInputChange('firstName')} required className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm text-white placeholder:text-gray-400" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="lastName" className="text-sm text-white">Nom *</Label>
                <Input id="lastName" value={formData.lastName} onChange={handleInputChange('lastName')} required className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm text-white placeholder:text-gray-400" />
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm text-white">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleInputChange('email')} required className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm text-white placeholder:text-gray-400" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-sm text-white">Téléphone</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange('phone')} className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm text-white placeholder:text-gray-400" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="company" className="text-sm text-white">Entreprise</Label>
              <Input id="company" value={formData.company} onChange={handleInputChange('company')} className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm text-white placeholder:text-gray-400" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm text-white">Mot de passe * (min. 6 caractères)</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange('password')} required minLength={6} className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise pr-10 h-9 sm:h-11 text-sm text-white placeholder:text-gray-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-bright-turquoise">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold h-10 sm:h-11 text-sm sm:text-base">
              {isLoading ? 'Création...' : 'Créer le compte'}
            </Button>
          </form>
          <div className="mt-3 sm:mt-4 text-center">
            <button type="button" onClick={onSwitchToLogin} className="text-bright-turquoise hover:text-bright-turquoise/80 text-xs sm:text-sm">
              Déjà un compte ? Se connecter
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
