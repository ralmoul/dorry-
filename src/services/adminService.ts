
import { supabase } from '@/integrations/supabase/client';

export interface AdminUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  is_approved: boolean;
  created_at: string;
}

export const adminService = {
  // Gestion des utilisateurs
  async getAllUsers(): Promise<AdminUserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [ADMIN] Erreur récupération utilisateurs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('💥 [ADMIN] Erreur critique:', error);
      throw error;
    }
  },

  async approveUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('approve_user_profile', {
        user_id: userId
      });

      if (error) {
        console.error('❌ [ADMIN] Erreur approbation:', error);
        throw error;
      }

      console.log('✅ [ADMIN] Utilisateur approuvé:', userId);
    } catch (error) {
      console.error('💥 [ADMIN] Erreur critique approbation:', error);
      throw error;
    }
  },

  async rejectUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('reject_user_profile', {
        user_id: userId
      });

      if (error) {
        console.error('❌ [ADMIN] Erreur rejet:', error);
        throw error;
      }

      console.log('✅ [ADMIN] Utilisateur rejeté:', userId);
    } catch (error) {
      console.error('💥 [ADMIN] Erreur critique rejet:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      console.log('🗑️ [ADMIN] Début suppression utilisateur:', userId);
      
      // Appeler la fonction Edge pour supprimer complètement l'utilisateur
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) {
        console.error('❌ [ADMIN] Erreur suppression via Edge Function:', error);
        throw error;
      }

      console.log('✅ [ADMIN] Utilisateur supprimé complètement:', data);
    } catch (error) {
      console.error('💥 [ADMIN] Erreur critique suppression:', error);
      throw error;
    }
  },

  // Nouvelle méthode pour suppression RGPD complète
  async deleteUserRgpd(userId: string, adminSessionToken: string, exportData: boolean = false): Promise<any> {
    try {
      console.log('🗑️ [ADMIN] Démarrage suppression RGPD pour utilisateur:', userId);
      
      const { data, error } = await supabase.functions.invoke('admin-delete-user-rgpd', {
        body: {
          userId,
          adminSessionToken,
          exportData
        }
      });

      if (error) {
        console.error('❌ [ADMIN] Erreur suppression RGPD:', error);
        throw error;
      }

      console.log('✅ [ADMIN] Suppression RGPD réussie:', data);
      return data;
    } catch (error) {
      console.error('💥 [ADMIN] Erreur critique suppression RGPD:', error);
      throw error;
    }
  },

  // Gestion des audits de sécurité
  async getSecurityLogs(limit: number = 100): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ [ADMIN] Erreur récupération logs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('💥 [ADMIN] Erreur critique logs:', error);
      throw error;
    }
  },

  // Gestion des sessions
  async getActiveSessions(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) {
        console.error('❌ [ADMIN] Erreur récupération sessions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('💥 [ADMIN] Erreur critique sessions:', error);
      throw error;
    }
  },

  // Nettoyage manuel
  async triggerSecurityCleanup(): Promise<void> {
    try {
      const { error } = await supabase.rpc('cleanup_expired_security_data');

      if (error) {
        console.error('❌ [ADMIN] Erreur nettoyage sécurité:', error);
        throw error;
      }

      console.log('✅ [ADMIN] Nettoyage sécurité effectué');
    } catch (error) {
      console.error('💥 [ADMIN] Erreur critique nettoyage:', error);
      throw error;
    }
  }
};
