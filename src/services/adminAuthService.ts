import { supabase } from '@/integrations/supabase/client';

export interface AdminSession {
  success: boolean;
  session_token?: string;
  expires_at?: string;
}

export const adminAuthService = {
  async loginAdmin(password: string): Promise<AdminSession> {
    try {
      console.log('🔐 [ADMIN_AUTH] Tentative de connexion admin...');
      console.log('🔐 [ADMIN_AUTH] Mot de passe reçu:', password);
      console.log('🔐 [ADMIN_AUTH] Longueur du mot de passe:', password.length);
      console.log('🔐 [ADMIN_AUTH] Mot de passe attendu: N3!ruoQx^sB9pWz7V@ufR@1!nC7x$zK%8Uv*Lt');
      console.log('🔐 [ADMIN_AUTH] Longueur attendue:', 'N3!ruoQx^sB9pWz7V@ufR@1!nC7x$zK%8Uv*Lt'.length);
      console.log('🔐 [ADMIN_AUTH] Comparaison exacte:', password === 'N3!ruoQx^sB9pWz7V@ufR@1!nC7x$zK%8Uv*Lt');
      
      // Obtenir l'IP et user agent du client
      const userAgent = navigator.userAgent;
      
      const { data, error } = await supabase.rpc('create_admin_session', {
        password_input: password,
        client_user_agent: userAgent
      });

      if (error) {
        console.error('❌ [ADMIN_AUTH] Erreur RPC:', error);
        return { success: false };
      }

      console.log('📊 [ADMIN_AUTH] Réponse RPC complète:', data);

      if (data && data.length > 0 && data[0].success) {
        // Stocker le token de session
        localStorage.setItem('admin_session_token', data[0].session_token);
        localStorage.setItem('admin_session_expires', data[0].expires_at);
        console.log('✅ [ADMIN_AUTH] Connexion admin réussie');
        return {
          success: true,
          session_token: data[0].session_token,
          expires_at: data[0].expires_at
        };
      }

      console.log('❌ [ADMIN_AUTH] Mot de passe incorrect selon le serveur');
      return { success: false };
    } catch (error) {
      console.error('💥 [ADMIN_AUTH] Erreur critique:', error);
      return { success: false };
    }
  },

  async verifyAdminSession(): Promise<boolean> {
    try {
      const token = localStorage.getItem('admin_session_token');
      const expires = localStorage.getItem('admin_session_expires');

      if (!token || !expires) {
        console.log('🔍 [ADMIN_AUTH] Aucun token trouvé');
        return false;
      }

      // Vérifier l'expiration côté client
      if (new Date(expires) <= new Date()) {
        console.log('⏰ [ADMIN_AUTH] Token expiré côté client');
        this.logoutAdmin();
        return false;
      }

      // Vérifier côté serveur
      const { data, error } = await supabase.rpc('verify_admin_session', {
        token: token
      });

      if (error || !data) {
        console.log('❌ [ADMIN_AUTH] Vérification serveur échouée:', error);
        this.logoutAdmin();
        return false;
      }

      console.log('✅ [ADMIN_AUTH] Session valide');
      return data;
    } catch (error) {
      console.error('💥 [ADMIN_AUTH] Erreur vérification session:', error);
      this.logoutAdmin();
      return false;
    }
  },

  async logoutAdmin(): Promise<void> {
    try {
      const token = localStorage.getItem('admin_session_token');
      
      if (token) {
        await supabase.rpc('invalidate_admin_session', { token });
      }
    } catch (error) {
      console.error('❌ [ADMIN_AUTH] Erreur logout:', error);
    } finally {
      localStorage.removeItem('admin_session_token');
      localStorage.removeItem('admin_session_expires');
    }
  },

  isAdminLoggedIn(): boolean {
    const token = localStorage.getItem('admin_session_token');
    const expires = localStorage.getItem('admin_session_expires');
    
    if (!token || !expires) {
      return false;
    }

    return new Date(expires) > new Date();
  }
};
