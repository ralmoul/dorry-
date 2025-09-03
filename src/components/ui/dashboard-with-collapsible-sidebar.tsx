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

  const handleNewConversation = () => {
    setSelected("new-conversation");
  };

  // GPTs et outils comme ChatGPT
  const gpts = [
    { id: 'dorry-codex', name: 'Dorry Codex', icon: BookOpen },
    { id: 'dorry-sora', name: 'Dorry Sora', icon: Sparkles },
    { id: 'dorry-gpt', name: 'Dorry GPT', icon: Zap },
    { id: 'dorry-prompt-ia', name: 'Dorry Prompt IA', icon: MessageSquare },
    { id: 'dorry-prompt-engineer', name: 'Dorry Prompt Engineer', icon: Settings },
  ];

  // Projets
  const projects = [
    { id: 'agenzys', name: '🔒 Agenzys' },
  ];

  // Historique de conversations
  const conversations = [
    { id: '1', title: 'Devenir pilote de chasse' },
    { id: '2', title: 'ARCE date de début d\'activité' },
    { id: '3', title: 'Code format date N8N' },
    { id: '4', title: 'Indemnisation retard vol' },
    { id: '5', title: 'Faire cracher un agent IA' },
    { id: '6', title: 'Utiliser HTTP request N8n' },
  ];

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

      {/* GPTs Section */}
      <div className="px-3 mt-4">
        <div className="space-y-1">
          {gpts.map((gpt) => {
            const IconComponent = gpt.icon;
            return (
              <button
                key={gpt.id}
                onClick={() => setSelected(gpt.id)}
                className={`w-full text-left p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm flex items-center gap-3 ${
                  selected === gpt.id ? 'bg-[#2a2a2a]' : ''
                }`}
              >
                <IconComponent className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{gpt.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projets Section */}
      <div className="px-3 mt-4">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm">
          <FolderOpen className="h-4 w-4" />
          Nouveau projet
        </button>
        {projects.map((project) => (
          <button
            key={project.id}
            className="w-full text-left p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm flex items-center gap-3 mt-1"
          >
            <Archive className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{project.name}</span>
          </button>
        ))}
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto px-3 mt-4">
        <div className="text-xs text-gray-400 mb-2 px-2">Chats</div>
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelected(conversation.id)}
              className={`w-full text-left p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm ${
                selected === conversation.id ? 'bg-[#2a2a2a]' : ''
              }`}
            >
              <span className="truncate">{conversation.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer avec compte utilisateur */}
      <div className="border-t border-[#404040] p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            TI
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Trade Invest</p>
            <p className="text-xs text-gray-400">Plus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatContent = ({ user, navigate, sidebarOpen, onToggleSidebar }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState("Dorry Pro");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

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
    };

    setMessages(prev => [...prev, userMessage]);

    // Simuler une réponse de l'assistant
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `Je comprends votre demande : "${message}". Je suis Dorry, votre assistant IA spécialisé dans l'analyse et la synthèse. Je peux vous aider à traiter et analyser vos informations de manière efficace.`,
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    // Réinitialiser le formulaire
    event.currentTarget.reset();
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
              <ChevronDown className="h-4 w-4" />
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

        {/* Indicateur mémoire */}
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Utilisation de la mémoire : 272 Mo
            </span>
          </div>
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <User className="h-5 w-5 text-gray-400" />
          </button>
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
                <div key={message.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {message.type === 'user' ? (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-black text-sm font-bold">D</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zone de saisie */}
        <div className="border-t border-[#404040] p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <PromptBox name="message" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DorryDashboard;