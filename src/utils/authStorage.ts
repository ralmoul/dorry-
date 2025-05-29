
import { User } from '@/types/auth';

const AUTH_STORAGE_KEY = 'dorry_auth_user';

export const getStoredAuth = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      console.log('📦 [STORAGE] Utilisateur récupéré:', user.id);
      return user;
    }
  } catch (error) {
    console.error('❌ [STORAGE] Erreur lecture:', error);
  }
  return null;
};

export const setStoredAuth = (user: User): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    console.log('💾 [STORAGE] Utilisateur sauvegardé:', user.id);
  } catch (error) {
    console.error('❌ [STORAGE] Erreur sauvegarde:', error);
  }
};

export const clearStoredAuth = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    console.log('🗑️ [STORAGE] Stockage nettoyé');
  } catch (error) {
    console.error('❌ [STORAGE] Erreur nettoyage:', error);
  }
};
