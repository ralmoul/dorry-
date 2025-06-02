
export const WEBHOOK_URL = 'https://ralmoul.app.n8n.cloud/webhook/11980a15-4394-40a7-a207-915d7cd9bdd1';

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
