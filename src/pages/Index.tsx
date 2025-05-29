
import React, { useState, useEffect } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleUpcomingFeaturesClick = () => {
    navigate('/upcoming-features');
  };

  // Function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Fond violet avec dégradé et particules animées */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 opacity-80"></div>
      
      {/* Particules animées */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite ${Math.random() * 5}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" 
            alt="Dorry Logo" 
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Dorry
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUpcomingFeaturesClick}
            className="text-cyan-400 hover:bg-cyan-400/10"
          >
            <span className="text-lg">✨</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettingsClick}
            className="text-cyan-400 hover:bg-cyan-400/10"
          >
            <SettingsIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-red-400 hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-4 md:px-8 py-8">
        {user && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Bienvenue, {capitalizeFirstLetter(user.firstName)}
            </h2>
            <p className="text-slate-300">
              Prêt à enregistrer votre prochaine réunion ?
            </p>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          <VoiceRecorder 
            onOpenSettings={handleSettingsClick}
            onOpenUpcomingFeatures={handleUpcomingFeaturesClick}
          />
        </div>
      </main>

      {/* Styles pour l'animation float */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(50px, -30px);
          }
          50% {
            transform: translate(20px, 50px);
          }
          75% {
            transform: translate(-30px, 20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
