
import { User } from '@/types/auth';

export const authStorage = {
  loadUser(): User | null {
    console.log('🚀 [AUTH] Loading user from storage...');
    
    const savedUser = localStorage.getItem('dory_user');
    const sessionUser = sessionStorage.getItem('dory_user');
    
    const userToLoad = savedUser || sessionUser;
    
    if (userToLoad) {
      try {
        const user = JSON.parse(userToLoad);
        console.log('✅ [AUTH] User found in storage:', { id: user.id, email: user.email });
        return user;
      } catch (error) {
        console.error('❌ [AUTH] Error loading user data:', error);
        authStorage.clearUser();
        return null;
      }
    } else {
      console.log('ℹ️ [AUTH] No user found in storage');
      return null;
    }
  },

  saveUser(user: User, rememberMe: boolean): void {
    // Clear existing data
    localStorage.removeItem('dory_user');
    sessionStorage.removeItem('dory_user');
    
    if (rememberMe) {
      console.log('💾 [AUTH] Storing in localStorage (persistent)');
      localStorage.setItem('dory_user', JSON.stringify(user));
      localStorage.setItem('dory_remember_me', 'true');
    } else {
      console.log('🔄 [AUTH] Storing in sessionStorage (session only)');
      sessionStorage.setItem('dory_user', JSON.stringify(user));
      localStorage.setItem('dory_remember_me', 'false');
    }
  },

  clearUser(): void {
    console.log('🗑️ [AUTH] Clearing user data from storage');
    localStorage.removeItem('dory_user');
    sessionStorage.removeItem('dory_user');
    localStorage.removeItem('dory_remember_me');
  }
};
