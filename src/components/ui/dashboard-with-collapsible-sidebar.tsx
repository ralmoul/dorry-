"use client"
import React, { useState, useEffect } from "react";
import {
  Home,
  DollarSign,
  Monitor,
  ShoppingCart,
  Tag,
  BarChart3,
  Users,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  TrendingUp,
  Activity,
  Package,
  Bell,
  Settings,
  HelpCircle,
  User,
  Mic,
  FileText,
  Download,
  Clock,
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const DorryDashboard = () => {
  const [isDark, setIsDark] = useState(true); // Toujours en mode sombre pour correspondre au thème
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Fond avec dégradé orange/jaune comme dans le héros */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900"></div>
      
      {/* Particules animées comme dans le héros */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 opacity-10"
            style={{
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite ${Math.random() * 5}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full">
        <Sidebar user={user} navigate={navigate} logout={logout} />
        <DashboardContent isDark={isDark} setIsDark={setIsDark} user={user} navigate={navigate} />
      </div>

      {/* Styles pour l'animation float */}
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
    </div>
  );
};

const Sidebar = ({ user, navigate, logout }: any) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  const handleNavigation = (title: string, path?: string) => {
    setSelected(title);
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-orange-500/20 bg-slate-900/90 backdrop-blur-md p-2 shadow-xl shadow-orange-500/5`}
    >
      <TitleSection open={open} user={user} />

      <div className="space-y-1 mb-8">
        <Option
          Icon={Home}
          title="Dashboard"
          selected={selected}
          setSelected={(title) => handleNavigation(title)}
          open={open}
        />
        <Option
          Icon={Mic}
          title="Enregistrements"
          selected={selected}
          setSelected={(title) => handleNavigation(title)}
          open={open}
          notifs={3}
        />
        <Option
          Icon={FileText}
          title="Synthèses"
          selected={selected}
          setSelected={(title) => handleNavigation(title)}
          open={open}
        />
        <Option
          Icon={BarChart3}
          title="Analytiques"
          selected={selected}
          setSelected={(title) => handleNavigation(title)}
          open={open}
        />
        <Option
          Icon={Download}
          title="Exports"
          selected={selected}
          setSelected={(title) => handleNavigation(title)}
          open={open}
        />
        <Option
          Icon={Clock}
          title="Historique"
          selected={selected}
          setSelected={(title) => handleNavigation(title)}
          open={open}
        />
      </div>

      {open && (
        <div className="border-t border-orange-500/20 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-orange-300/70 uppercase tracking-wide">
            Compte
          </div>
          <Option
            Icon={Settings}
            title="Paramètres"
            selected={selected}
            setSelected={(title) => handleNavigation(title, '/settings')}
            open={open}
          />
          <Option
            Icon={HelpCircle}
            title="Aide & Support"
            selected={selected}
            setSelected={(title) => handleNavigation(title)}
            open={open}
          />
        </div>
      )}

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }: any) => {
  const isSelected = selected === title;
  
  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected 
          ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 shadow-sm border-l-2 border-orange-400" 
          : "text-orange-100/70 hover:bg-orange-500/10 hover:text-orange-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>
      
      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-xs text-black font-medium">
          {notifs}
        </span>
      )}
    </button>
  );
};

const TitleSection = ({ open, user }: any) => {
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="mb-6 border-b border-orange-500/20 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-orange-500/10">
        <div className="flex items-center gap-3">
          <DorryLogo />
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent">
                    {user ? capitalizeFirstLetter(user.firstName) : 'Utilisateur'}
                  </span>
                  <span className="block text-xs text-orange-300/70">
                    Plan Pro
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-orange-400" />
        )}
      </div>
    </div>
  );
};

const DorryLogo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 shadow-sm">
      <span className="text-black font-bold text-lg">D</span>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: any) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-orange-500/20 transition-colors hover:bg-orange-500/10"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-orange-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-orange-300 transition-opacity duration-200 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Masquer
          </span>
        )}
      </div>
    </button>
  );
};

const DashboardContent = ({ isDark, setIsDark, user, navigate }: any) => {
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="flex-1 bg-slate-900/50 backdrop-blur-sm p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-orange-100/70 mt-1">
            Bienvenue {user ? capitalizeFirstLetter(user.firstName) : ''}, prêt à enregistrer ?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-slate-800/50 border border-orange-500/20 text-orange-300 hover:text-orange-200 hover:bg-orange-500/10 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-500/20 bg-slate-800/50 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200 transition-colors"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 rounded-lg bg-slate-800/50 border border-orange-500/20 text-orange-300 hover:text-orange-200 hover:bg-orange-500/10 transition-colors"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-orange-500/20 bg-slate-800/30 backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-orange-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg">
              <Mic className="h-5 w-5 text-orange-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <h3 className="font-medium text-orange-100/70 mb-1">Enregistrements</h3>
          <p className="text-2xl font-bold text-orange-200">24</p>
          <p className="text-sm text-green-400 mt-1">+12% ce mois</p>
        </div>
        
        <div className="p-6 rounded-xl border border-orange-500/20 bg-slate-800/30 backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-orange-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
              <FileText className="h-5 w-5 text-green-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <h3 className="font-medium text-orange-100/70 mb-1">Synthèses</h3>
          <p className="text-2xl font-bold text-orange-200">18</p>
          <p className="text-sm text-green-400 mt-1">+5% cette semaine</p>
        </div>
        
        <div className="p-6 rounded-xl border border-orange-500/20 bg-slate-800/30 backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-orange-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <h3 className="font-medium text-orange-100/70 mb-1">Temps total</h3>
          <p className="text-2xl font-bold text-orange-200">12h 34m</p>
          <p className="text-sm text-green-400 mt-1">+8% aujourd'hui</p>
        </div>

        <div className="p-6 rounded-xl border border-orange-500/20 bg-slate-800/30 backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-orange-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
              <Download className="h-5 w-5 text-blue-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <h3 className="font-medium text-orange-100/70 mb-1">Exports</h3>
          <p className="text-2xl font-bold text-orange-200">7</p>
          <p className="text-sm text-green-400 mt-1">+3 cette semaine</p>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-orange-500/20 bg-slate-800/30 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent">
                Activité récente
              </h3>
              <button className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Voir tout
              </button>
            </div>
            <div className="space-y-4">
              {[
                { icon: Mic, title: "Nouvel enregistrement", desc: "Réunion équipe marketing", time: "Il y a 2 min", color: "orange" },
                { icon: FileText, title: "Synthèse générée", desc: "Entretien client - Projet A", time: "Il y a 5 min", color: "green" },
                { icon: Download, title: "Export terminé", desc: "Rapport mensuel PDF", time: "Il y a 10 min", color: "blue" },
                { icon: Activity, title: "Analyse complète", desc: "Détection des points clés", time: "Il y a 1h", color: "purple" },
                { icon: Bell, title: "Nouvelle notification", desc: "Résultats de l'analyse IA", time: "Il y a 2h", color: "yellow" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-orange-500/5 transition-colors cursor-pointer">
                  <div className={`p-2 rounded-lg ${
                    activity.color === 'orange' ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20' :
                    activity.color === 'green' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' :
                    activity.color === 'blue' ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' :
                    activity.color === 'purple' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' :
                    'bg-gradient-to-r from-yellow-500/20 to-amber-500/20'
                  }`}>
                    <activity.icon className={`h-4 w-4 ${
                      activity.color === 'orange' ? 'text-orange-400' :
                      activity.color === 'green' ? 'text-green-400' :
                      activity.color === 'blue' ? 'text-blue-400' :
                      activity.color === 'purple' ? 'text-purple-400' :
                      'text-yellow-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-orange-200 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-orange-100/60 truncate">
                      {activity.desc}
                    </p>
                  </div>
                  <div className="text-xs text-orange-300/50">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="rounded-xl border border-orange-500/20 bg-slate-800/30 backdrop-blur-sm p-6 shadow-sm">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent mb-4">
              Statistiques rapides
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-100/70">Qualité audio</span>
                <span className="text-sm font-medium text-orange-200">94%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-100/70">Précision IA</span>
                <span className="text-sm font-medium text-orange-200">87%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-100/70">Temps de traitement</span>
                <span className="text-sm font-medium text-orange-200">2.3s</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-orange-500/20 bg-slate-800/30 backdrop-blur-sm p-6 shadow-sm">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent mb-4">
              Derniers enregistrements
            </h3>
            <div className="space-y-3">
              {['Réunion équipe', 'Entretien client', 'Formation interne', 'Brainstorming'].map((recording, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <span className="text-sm text-orange-100/70">{recording}</span>
                  <span className="text-sm font-medium text-orange-200">
                    {Math.floor(Math.random() * 30 + 5)}min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DorryDashboard;
