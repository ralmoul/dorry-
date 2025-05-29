
export const WEBHOOK_URL = 'https://n8n-4m8i.onrender.com/webhook/d4e8f563-b641-484a-8e40-8ef6564362f2';

export const AUDIO_LIMITS = {
  MAX_SIZE: 25 * 1024 * 1024, // 25MB
  TIMEOUT: 30000, // 30 seconds
} as const;

export const MIME_TYPES = {
  OGG: 'audio/ogg;codecs=opus',
  WEBM: 'audio/webm;codecs=opus',
  MP4: 'audio/mp4',
  AAC: 'audio/aac',
} as const;
