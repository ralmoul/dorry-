import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Nécessaire pour utiliser dans le navigateur
});

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Convertir le Blob en File pour OpenAI
    const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
    
    // Appeler l'API Whisper
    const transcription = await openai.audio.transcriptions.create({
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
