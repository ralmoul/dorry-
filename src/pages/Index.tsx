import React, { useState, useEffect } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Index = () => {
  const {
    user,
    logout,
    isAuthenticated,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Protection d'authentification
  useEffect(() => {
    console.log('🔍 [INDEX] Checking authentication status:', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userApproved: user?.isApproved
    });
    if (!isLoading && (!isAuthenticated || !user || !user.isApproved)) {
      console.log('❌ [INDEX] User not authenticated or not approved, redirecting to login');
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Vérification de l'authentification...</p>
        </div>
      </div>;
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated || !user || !user.isApproved) {
    return null;
  }
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  const handleUpcomingFeaturesClick = () => {
    navigate('/upcoming-features');
  };
  const handleLogoClick = () => {
    navigate('/');
  };
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  return <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Fond violet avec dégradé optimisé */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 opacity-80"></div>
      
      {/* Particules animées réduites */}
      <div className="absolute inset-0 z-0">
        {Array.from({
        length: window.innerWidth > 768 ? 30 : 15
      }).map((_, i) => <div key={i} className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20" style={{
        width: `${Math.random() * 8 + 3}px`,
        height: `${Math.random() * 8 + 3}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite ${Math.random() * 5}s`,
        filter: 'blur(1px)'
      }} />)}
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center space-x-3">
          <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick} loading="lazy" />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleUpcomingFeaturesClick} className="text-cyan-400 hover:bg-cyan-400/10">
            <span className="text-lg">✨</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSettingsClick} className="text-cyan-400 hover:bg-cyan-400/10">
            <SettingsIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoggingOut} className="text-red-400 hover:bg-red-400/10 disabled:opacity-50">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-4 md:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Bienvenue, {capitalizeFirstLetter(user.firstName)}
          </h2>
          <p className="text-slate-300">Prêt à enregistrer votre prochain entretien ?</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <VoiceRecorder onOpenSettings={handleSettingsClick} onOpenUpcomingFeatures={handleUpcomingFeaturesClick} />
        </div>
      </main>

      {/* Styles pour l'animation float optimisée */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(30px, -20px);
          }
          50% {
            transform: translate(15px, 30px);
          }
          75% {
            transform: translate(-20px, 15px);
          }
        }
      `}</style>
    </div>;
};
export default Index;