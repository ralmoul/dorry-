


export const WEBHOOK_URL = 'https://n8n.srv938173.hstgr.cloud/webhook-test/7e21fc77-8e1e-4a40-a98c-746f44b6d613';

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


