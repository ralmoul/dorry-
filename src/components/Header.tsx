
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, User } from 'lucide-react';

interface HeaderProps {
  onOpenSettings?: () => void;
}

export const Header = ({ onOpenSettings }: HeaderProps) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      window.location.href = '/settings';
    }
  };

  return (
    <header className="bg-card/50 backdrop-blur-lg border-b border-bright-turquoise/20 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-bright-turquoise to-electric-blue rounded-lg flex items-center justify-center">
            <span className="text-dark-navy font-bold text-sm">D</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Dorry
          </h1>
        </div>

        {/* Message d'accueil et actions utilisateur */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white font-medium">
                  Bonjour {user.firstName} 👋
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.company}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSettings}
                  className="text-white hover:text-bright-turquoise hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:text-red-400 hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
