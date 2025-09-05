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
import { AIVoiceInput } from '@/components/ui/ai-voice-input';
import { SimpleVoiceMessage } from '@/components/ui/simple-voice-message';
import { transcribeAudio } from '@/services/whisper';

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

  // Effacer les messages quand on change de modèle
  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel);
    setMessages([]); // Nouvelle conversation
    setShowModelDropdown(false);
  };

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
    { id: 'dorry-compte-rendu', name: 'Dorry Compte rendu', description: 'Spécialisé en compte rendu' },
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
      messageType: 'text'
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
          user: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            id: user?.id || '',
            fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
            // Ajout d'autres infos utilisateur disponibles
            ...user
          },
          timestamp: new Date().toISOString(),
          model: selectedModel,
          messageType: 'text' // Pour différencier text/vocal plus tard
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

  // Gestion des messages vocaux - VERSION SIMPLE QUI MARCHE
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  
  const handleVoiceStop = async (duration: number, audioBlob?: Blob) => {
    console.log('🎤 DEBUT handleVoiceStop:', { duration, hasBlob: !!audioBlob, blobSize: audioBlob?.size, isProcessing: isProcessingVoice });
    
    if (isProcessingVoice) {
      console.log('⚠️ Déjà en cours de traitement, ignore');
      return;
    }
    
    if (!audioBlob || duration <= 0) {
      console.log('❌ Pas d\'audio ou durée nulle');
      return;
    }
    
    setIsProcessingVoice(true);

    // 1. Ajouter IMMÉDIATEMENT le message vocal à la conversation
    const messageId = Date.now();
    const voiceMessage = {
      id: messageId,
      type: 'user',
      content: `Message vocal (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
      messageType: 'voice',
      duration,
      transcription: 'Transcription en cours...'
    };
    
    console.log('💬 Ajout message vocal au chat');
    setMessages(prev => [...prev, voiceMessage]);

    // 2. Envoyer IMMÉDIATEMENT au webhook N8N
    console.log('📤 ENVOI AU WEBHOOK MAINTENANT...');
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.wav');
      
      // DONNÉES UTILISATEUR EN CHAMPS SÉPARÉS
      formData.append('firstName', user?.firstName || '');
      formData.append('lastName', user?.lastName || '');
      formData.append('email', user?.email || '');
      formData.append('phone', user?.phone || '');
      formData.append('company', user?.company || '');
      formData.append('userId', user?.id || '');
      formData.append('fullName', `${user?.firstName || ''} ${user?.lastName || ''}`.trim());
      
      formData.append('message', `Message vocal de ${duration} secondes`);
      formData.append('timestamp', new Date().toISOString());
      formData.append('model', selectedModel);
      formData.append('messageType', 'voice');
      formData.append('duration', duration.toString());

      console.log('🌐 Fetch vers webhook...');
      const response = await fetch('https://n8n.srv938173.hstgr.cloud/webhook-test/7e21fc77-8e1e-4a40-a98c-746f44b6d613', {
        method: 'POST',
        body: formData,
      });
      
      console.log('✅ Réponse reçue:', { status: response.status, ok: response.ok });

      if (response.ok) {
        const data = await response.text();
        console.log('📄 Contenu réponse:', data);
        
        if (!data.includes('Workflow was started') && !data.includes('workflow')) {
          const assistantMessage = {
            id: Date.now() + 1,
            type: 'assistant',
            content: data,
            messageType: 'text'
          };
          setMessages(prev => [...prev, assistantMessage]);
          console.log('💬 Réponse assistant ajoutée');
        }
      } else {
        console.error('❌ Erreur HTTP:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ ERREUR FETCH:', error);
    }

    // 3. Transcription en parallèle (optionnel)
    try {
      console.log('📝 Début transcription...');
      const transcription = await transcribeAudio(audioBlob);
      console.log('📝 Transcription reçue:', transcription);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, transcription }
          : msg
      ));
      console.log('📝 Transcription mise à jour');
    } catch (error) {
      console.error('❌ Erreur transcription:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, transcription: 'Erreur lors de la transcription' }
          : msg
      ));
    }
    
    // Réinitialiser le flag de traitement
    setIsProcessingVoice(false);
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
                    onClick={() => handleModelChange(model.name)}
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
                <div key={message.id} className={`py-4 ${message.type === 'user' ? 'text-right' : ''}`}>
                  {message.type === 'user' ? (
                    message.messageType === 'voice' ? (
                      // Message vocal avec transcription
                      <SimpleVoiceMessage
                        duration={message.duration}
                        transcription={message.transcription}
                      />
                    ) : (
                      // Message texte utilisateur à droite, dans une bulle ronde grise
                      <div className="inline-block bg-[#2f2f2f] text-white px-4 py-2 rounded-3xl max-w-[80%]">
                        <p className="leading-relaxed">{message.content}</p>
                      </div>
                    )
                  ) : (
                    // Message assistant à gauche, texte direct sans bulle
                    <p className="text-white leading-relaxed">{message.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zone de saisie */}
        <div className="border-t border-[#404040] p-4">
          <div className="max-w-3xl mx-auto">
            {selectedModel === "Dorry Compte rendu" ? (
              // Mode vocal pour Compte rendu
              <AIVoiceInput 
                onStart={() => console.log('Enregistrement vocal démarré')}
                onStop={handleVoiceStop}
                key="voice-input" 
              />
            ) : (
              // Mode texte pour Dorry Pro
              <form onSubmit={handleSubmit}>
                <PromptBox ref={promptBoxRef} name="message" />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DorryDashboard;