import OpenAI from 'openai';

let openai: OpenAI | null = null;

// Initialiser OpenAI seulement si la clé API est disponible
const initOpenAI = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey && !openai) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Nécessaire pour utiliser dans le navigateur
    });
  }
  return openai;
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const client = initOpenAI();
    
    if (!client) {
      console.warn('Clé API OpenAI non configurée');
      return 'Clé API non configurée - ajoutez VITE_OPENAI_API_KEY dans Vercel';
    }

    // Convertir le Blob en File pour OpenAI avec format WebM
    const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
    
    // Appeler l'API Whisper
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'fr', // Français
      response_format: 'text'
    });

    return transcription;
  } catch (error) {
    console.error('Erreur transcription Whisper:', error);
    return 'Erreur lors de la transcription';
  }
};
