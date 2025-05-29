
import { User } from '@/types/auth';

// Note: Avec Supabase Auth, le stockage est géré automatiquement
// Ces fonctions sont maintenues pour la compatibilité mais ne sont plus nécessaires

const AUTH_STORAGE_KEY = 'dorry_auth_user';

export const getStoredAuth = (): User | null => {
  // Avec Supabase Auth, on n'a plus besoin de gérer le stockage manuellement
  console.log('📦 [STORAGE] Utilisation de Supabase Auth - stockage automatique');
  return null;
};

export const setStoredAuth = (user: User): void => {
  // Avec Supabase Auth, on n'a plus besoin de gérer le stockage manuellement
  console.log('💾 [STORAGE] Utilisation de Supabase Auth - stockage automatique pour:', user.id);
};

export const clearStoredAuth = (): void => {
  // Avec Supabase Auth, on n'a plus besoin de gérer le stockage manuellement
  console.log('🗑️ [STORAGE] Utilisation de Supabase Auth - nettoyage automatique');
};
