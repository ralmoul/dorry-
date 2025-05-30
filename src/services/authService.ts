
// Service d'authentification étendu avec les nouvelles fonctionnalités de sécurité
import { enhancedAuthService } from './enhancedAuthService';

// Re-exporter les fonctions principales pour maintenir la compatibilité
export const authService = {
  login: enhancedAuthService.secureLogin,
  signup: enhancedAuthService.secureSignup,
};
