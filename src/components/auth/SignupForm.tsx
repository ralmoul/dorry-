
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await signup(formData);

    if (success) {
      toast({
        title: "Demande envoyée",
        description: "Votre demande de création de compte a été envoyée. Vous recevrez une confirmation une fois approuvée.",
      });
      onSwitchToLogin();
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du compte.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Rejoindre Dory
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Demande d'accès à votre assistant vocal intelligent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  required
                  className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  required
                  className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                required
                className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={handleInputChange('company')}
                required
                className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
                className="bg-background/50 border-bright-turquoise/30 focus:border-bright-turquoise"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold"
            >
              {isLoading ? 'Envoi...' : 'Demander l\'accès'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-bright-turquoise hover:text-bright-turquoise/80 text-sm"
            >
              Déjà un compte ? Se connecter
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
