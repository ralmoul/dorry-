
import { WEBHOOK_URL, AUDIO_LIMITS } from './constants';
import { User } from '@/types/auth';

export const validateUser = (user: User | null): void => {
  if (!user) {
    console.error('❌ [WEBHOOK] ERREUR: Utilisateur non connecté!');
    throw new Error('Vous devez être connecté pour envoyer un enregistrement');
  }
};

export const validateWebhookUrl = (): void => {
  if (WEBHOOK_URL !== 'https://ralmoul.app.n8n.cloud/webhook/11980a15-4394-40a7-a207-915d7cd9bdd1') {
    console.error('❌ [WEBHOOK] ERREUR CRITIQUE: URL incorrecte!');
    throw new Error('URL webhook incorrecte');
  }
};

export const validateAudioFile = (audioBlob: Blob): void => {
  if (audioBlob.size === 0) {
    console.error('❌ [WEBHOOK] ERREUR: Fichier audio vide!');
    throw new Error('Fichier audio vide - problème d\'enregistrement');
  }
  
  if (audioBlob.size > AUDIO_LIMITS.MAX_SIZE) {
    console.error('❌ [WEBHOOK] ERREUR: Fichier trop volumineux:', audioBlob.size, 'bytes');
    throw new Error('Fichier audio trop volumineux (max 25MB)');
  }
  
  console.log('✅ [WEBHOOK] Taille du fichier validée');
};
