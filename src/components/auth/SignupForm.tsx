import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm = ({
  onSwitchToLogin
}: SignupFormProps) => {
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
  const {
    signup
  } = useAuth();
  const {
    toast
  } = useToast();
  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await signup(formData);
    if (success) {
      toast({
        title: "Demande envoyée",
        description: "Votre demande de création de compte a été envoyée. Vous recevrez une confirmation une fois approuvée."
      });
      onSwitchToLogin();
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du compte.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };
  return <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <Card className="w-full max-w-sm sm:max-w-md bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Rejoindre Dory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="firstName" className="text-sm">Prénom</Label>
                <Input id="firstName" value={formData.firstName} onChange={handleInputChange('firstName')} required className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="lastName" className="text-sm">Nom</Label>
                <Input id="lastName" value={formData.lastName} onChange={handleInputChange('lastName')} required className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleInputChange('email')} required className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-sm">Téléphone</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange('phone')} required className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="company" className="text-sm">Entreprise</Label>
              <Input id="company" value={formData.company} onChange={handleInputChange('company')} required className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise h-9 sm:h-11 text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm">Mot de passe</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange('password')} required className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise pr-10 h-9 sm:h-11 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-bright-turquoise">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold h-10 sm:h-11 text-sm sm:text-base">
              {isLoading ? 'Envoi...' : 'Demander l\'accès'}
            </Button>
          </form>
          <div className="mt-3 sm:mt-4 text-center">
            <button type="button" onClick={onSwitchToLogin} className="text-bright-turquoise hover:text-bright-turquoise/80 text-xs sm:text-sm">
              Déjà un compte ? Se connecter
            </button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
