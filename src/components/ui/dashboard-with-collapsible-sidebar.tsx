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
  MessageSquare,
  Plus,
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { PromptBox } from '@/components/ui/chatgpt-prompt-input';

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
        <ChatContent isDark={isDark} setIsDark={setIsDark} user={user} navigate={navigate} />
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
  const [selected, setSelected] = useState("new-conversation");

  const handleNavigation = (title: string, path?: string) => {
    setSelected(title);
    if (path) {
      navigate(path);
    }
  };

  const handleNewConversation = () => {
    setSelected("new-conversation");
    // Ici on pourrait déclencher la création d'une nouvelle conversation
  };

  // Simuler un historique de conversations
  const conversations = [
    { id: '1', title: 'Analyse du marché', time: '2h', preview: 'Peux-tu analyser les tendances...' },
    { id: '2', title: 'Stratégie marketing', time: '1j', preview: 'Comment améliorer notre...' },
    { id: '3', title: 'Développement produit', time: '3j', preview: 'Quelles sont les meilleures...' },
    { id: '4', title: 'Ressources humaines', time: '5j', preview: 'Comment optimiser le...' },
    { id: '5', title: 'Finance et budget', time: '1sem', preview: 'Aide-moi à comprendre...' },
  ];

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-orange-500/20 bg-slate-900/90 backdrop-blur-md p-2 shadow-xl shadow-orange-500/5`}
    >
      <TitleSection open={open} user={user} />

      {/* Nouvelle Conversation Button */}
      <div className="mb-4">
        <button
          onClick={handleNewConversation}
          className={`w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 text-orange-200 hover:from-orange-500/30 hover:to-yellow-500/30 transition-all duration-200 ${
            !open && 'justify-center'
          }`}
        >
          <Plus className="h-4 w-4 flex-shrink-0" />
          {open && <span className="text-sm font-medium">Nouvelle conversation</span>}
        </button>
      </div>

      {/* Historique des Conversations */}
      {open && (
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="px-3 py-2 text-xs font-medium text-orange-300/70 uppercase tracking-wide mb-2">
            Historique
          </div>
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selected === conversation.id}
                onSelect={() => setSelected(conversation.id)}
              />
            ))}
          </div>
        </div>
      )}

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

const ConversationItem = ({ conversation, isSelected, onSelect }: any) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
        isSelected 
          ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-l-2 border-orange-400" 
          : "hover:bg-orange-500/10"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-3 w-3 text-orange-400 flex-shrink-0" />
            <h4 className="text-sm font-medium text-orange-200 truncate">
              {conversation.title}
            </h4>
          </div>
          <p className="text-xs text-orange-300/60 truncate">
            {conversation.preview}
          </p>
        </div>
        <span className="text-xs text-orange-400/50 ml-2 flex-shrink-0">
          {conversation.time}
        </span>
      </div>
    </button>
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

const ChatContent = ({ isDark, setIsDark, user, navigate }: any) => {
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Messages de démonstration
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `Bonjour ${user ? capitalizeFirstLetter(user.firstName) : 'utilisateur'} ! Je suis votre assistant IA Dorry. Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date(Date.now() - 10000)
    }
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;
    
    if (!message?.trim()) return;

    // Ajouter le message utilisateur
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simuler une réponse de l'assistant
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `Merci pour votre message : "${message}". Je suis en cours de développement et je pourrai bientôt vous aider avec vos analyses et synthèses !`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    // Réinitialiser le formulaire
    event.currentTarget.reset();
  };

  return (
    <div className="flex-1 bg-slate-900/50 backdrop-blur-sm flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-orange-500/20">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent">
            Chat avec Dorry
          </h1>
          <p className="text-orange-100/70 text-sm mt-1">
            Votre assistant IA pour l'analyse et la synthèse
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black'
                  : 'bg-slate-800/50 border border-orange-500/20 text-orange-100'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-black/70' : 'text-orange-300/50'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-orange-500/20">
        <form onSubmit={handleSubmit}>
          <PromptBox name="message" />
        </form>
      </div>
    </div>
  );
};

export default DorryDashboard;
