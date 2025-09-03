"use client"
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Settings,
  HelpCircle,
  User,
  Menu,
  ChevronDown,
  X,
  Search,
  BookOpen,
  Zap,
  Sparkles,
  BarChart3,
  FolderOpen,
  Archive,
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { PromptBox } from '@/components/ui/chatgpt-prompt-input';

export const DorryDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      <Sidebar 
        user={user} 
        navigate={navigate} 
        logout={logout} 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatContent 
        user={user} 
        navigate={navigate} 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
};

const Sidebar = ({ user, navigate, logout, isOpen, onToggle }: any) => {
  const [selected, setSelected] = useState("new-conversation");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleNewConversation = () => {
    setSelected("new-conversation");
  };

  if (!isOpen) return null;

  return (
    <div className="w-64 h-screen bg-[#171717] text-white flex flex-col">
      {/* Header avec bouton nouveau chat */}
      <div className="p-3">
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#404040] hover:bg-[#2a2a2a] transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Nouveau chat
        </button>
      </div>

      {/* Navigation principale */}
      <div className="px-3 space-y-2">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm">
          <Search className="h-4 w-4" />
          Rechercher des chats
        </button>
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm">
          <BookOpen className="h-4 w-4" />
          Bibliothèque
        </button>
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto px-3 mt-6">
        <div className="text-xs text-gray-400 mb-2 px-2">Chats</div>
        <div className="text-sm text-gray-500 px-2 py-4 text-center">
          Aucun historique de conversation pour le moment
        </div>
      </div>

      {/* Footer avec compte utilisateur */}
      <div className="border-t border-[#404040] p-3 relative">
        <div 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user?.firstName?.[0]?.toUpperCase() || 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.firstName || 'Trade Invest'}</p>
            <p className="text-xs text-gray-400">Plus</p>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
        </div>
        
        {/* Menu profil */}
        {showProfileMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#2a2a2a] border border-[#404040] rounded-lg shadow-lg py-2">
            <button 
              onClick={() => {
                navigate('/profile');
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a] transition-colors"
            >
              <User className="h-4 w-4 inline mr-2" />
              Mon profil
            </button>
            <button 
              onClick={() => {
                navigate('/settings');
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a] transition-colors"
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Paramètres
            </button>
            <hr className="border-[#404040] my-2" />
            <button 
              onClick={() => {
                logout();
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3a3a3a] transition-colors"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatContent = ({ user, navigate, sidebarOpen, onToggleSidebar }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState("Dorry Pro");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const promptBoxRef = React.useRef<HTMLTextAreaElement>(null);

  // Phrases d'accueil dynamiques
  const welcomePhrases = [
    "Par quoi commençons-nous ?",
    "Que voulez-vous créer aujourd'hui ?",
    "Comment puis-je vous aider ?",
    "Quelle est votre question ?",
    "Sur quoi travaillons-nous ?",
    "Que souhaitez-vous explorer ?",
  ];

  const [currentPhrase] = useState(() => 
    welcomePhrases[Math.floor(Math.random() * welcomePhrases.length)]
  );

  const models = [
    { id: 'dorry-pro', name: 'Dorry Pro', description: 'Modèle le plus avancé' },
    { id: 'dorry-creative', name: 'Dorry Creative', description: 'Optimisé pour la créativité' },
    { id: 'dorry-analyst', name: 'Dorry Analyst', description: 'Spécialisé en analyse' },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;
    
    if (!message?.trim()) return;

    // Ajouter le message utilisateur
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
    };

    setMessages(prev => [...prev, userMessage]);

    // Réinitialiser le formulaire ET le PromptBox
    event.currentTarget.reset();
    if (promptBoxRef.current && 'reset' in promptBoxRef.current) {
      (promptBoxRef.current as any).reset();
    }

    try {
      // Envoyer au webhook N8N
      const response = await fetch('https://n8n.srv938173.hstgr.cloud/webhook-test/7e21fc77-8e1e-4a40-a98c-746f44b6d613', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          user: user?.firstName || 'Utilisateur',
          timestamp: new Date().toISOString(),
          model: selectedModel
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Ignorer les messages "workflow started" et autres trucs inutiles
        if (data.response && !data.response.includes('Workflow was started') && !data.response.includes('workflow')) {
          const assistantMessage = {
            id: Date.now() + 1,
            type: 'assistant',
            content: data.response,
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else if (data.message && !data.message.includes('Workflow was started') && !data.message.includes('workflow')) {
          const assistantMessage = {
            id: Date.now() + 1,
            type: 'assistant',
            content: data.message,
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
      } else {
        throw new Error('Erreur webhook');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi au webhook:', error);
      
      // Pas de message d'erreur, on attend juste la vraie réponse du webhook
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#212121]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#404040]">
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          {sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Sélecteur de modèle */}
          <div className="relative">
            <button 
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <span>{selectedModel}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showModelDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#2a2a2a] border border-[#404040] rounded-lg shadow-lg z-50">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.name);
                      setShowModelDropdown(false);
                    }}
                    className="w-full text-left p-3 hover:bg-[#3a3a3a] transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="font-medium text-white">{model.name}</div>
                    <div className="text-xs text-gray-400">{model.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>


      </div>

      {/* Zone de contenu */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          // Écran d'accueil
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <h1 className="text-3xl font-semibold text-white mb-8">
                {currentPhrase}
              </h1>
            </div>
          </div>
        ) : (
          // Messages
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`py-4 ${message.type === 'user' ? 'text-right' : 'flex gap-4'}`}>
                  {message.type === 'user' ? (
                    // Message utilisateur à droite, sans avatar
                    <p className="text-white leading-relaxed">{message.content}</p>
                  ) : (
                    // Message assistant à gauche, sans avatar
                    <>
                      <div className="flex-1">
                        <p className="text-white leading-relaxed">{message.content}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zone de saisie */}
        <div className="border-t border-[#404040] p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <PromptBox ref={promptBoxRef} name="message" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DorryDashboard;