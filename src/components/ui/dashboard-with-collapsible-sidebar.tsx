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
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { PromptBox } from '@/components/ui/chatgpt-prompt-input';

export const DorryDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
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

  // Historique de conversations simple
  const conversations = [
    { id: '1', title: 'Analyse du marché' },
    { id: '2', title: 'Stratégie marketing' },
    { id: '3', title: 'Développement produit' },
    { id: '4', title: 'Ressources humaines' },
    { id: '5', title: 'Finance et budget' },
    { id: '6', title: 'Planification projet' },
    { id: '7', title: 'Optimisation SEO' },
    { id: '8', title: 'Formation équipe' },
  ];

  if (!isOpen) return null;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* Header avec bouton nouveau chat */}
      <div className="p-3">
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Nouveau chat
        </button>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelected(conversation.id)}
              className={`w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-sm ${
                selected === conversation.id ? 'bg-gray-800' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{conversation.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer avec compte utilisateur */}
      <div className="border-t border-gray-700 p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm font-medium">
            {user?.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-400">Plan Pro</p>
          </div>
          <Settings 
            className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" 
            onClick={() => navigate('/settings')}
          />
        </div>
      </div>
    </div>
  );
};



const ChatContent = ({ user, navigate, sidebarOpen, onToggleSidebar }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState("Dorry Pro");

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
    { id: 'dorry-pro', name: 'Dorry Pro' },
    { id: 'dorry-creative', name: 'Dorry Creative' },
    { id: 'dorry-analyst', name: 'Dorry Analyst' },
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
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          {sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Sélecteur de modèle */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span>{selectedModel}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Zone de contenu */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          // Écran d'accueil
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <h1 className="text-3xl font-semibold text-gray-800 mb-8">
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
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {message.type === 'user' ? (
                      <span className="text-sm font-medium">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    ) : (
                      <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zone de saisie */}
        <div className="border-t border-gray-200 p-4">
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
