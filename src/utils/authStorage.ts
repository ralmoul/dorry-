
import { User } from '@/types/auth';

// Note: Avec Supabase Auth, la gestion de la session est automatique
// Ce fichier est conservé pour la compatibilité mais n'est plus utilisé
export const authStorage = {
  loadUser(): User | null {
    console.log('ℹ️ [AUTH] authStorage.loadUser() called but Supabase handles session automatically');
    return null;
  },

  saveUser(user: User, rememberMe: boolean): void {
    console.log('ℹ️ [AUTH] authStorage.saveUser() called but Supabase handles session automatically');
  },

  clearUser(): void {
    console.log('ℹ️ [AUTH] authStorage.clearUser() called but Supabase handles session automatically');
  }
};
