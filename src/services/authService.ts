
import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData } from '@/types/auth';
import bcrypt from 'bcryptjs';

export const authService = {
  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; user?: User }> {
    try {
      console.log('🔐 [LOGIN] Tentative de connexion locale pour:', data.email);
      
      // Chercher l'utilisateur dans la table users locale
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email)
        .single();

      if (error || !userData) {
        console.error('❌ [LOGIN] Utilisateur non trouvé:', error?.message);
        return { success: false };
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(data.password, userData.password_hash);
      if (!isPasswordValid) {
        console.error('❌ [LOGIN] Mot de passe incorrect');
        return { success: false };
      }

      // Vérifier si l'utilisateur est approuvé
      if (!userData.is_approved) {
        console.error('❌ [LOGIN] Utilisateur non approuvé');
        return { success: false };
      }

      // Créer l'objet user
      const user: User = {
        id: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        company: userData.company,
        isApproved: userData.is_approved,
        createdAt: userData.created_at,
      };

      console.log('✅ [LOGIN] Connexion locale réussie pour:', user.firstName, user.email);
      return { success: true, user };

    } catch (error) {
      console.error('💥 [LOGIN] Erreur inattendue:', error);
      return { success: false };
    }
  },

  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('📝 [SIGNUP] Création de compte local pour:', data.email);
      
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        console.error('❌ [SIGNUP] Utilisateur déjà existant');
        return false;
      }

      // Hasher le mot de passe
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Créer l'utilisateur
      const { error } = await supabase
        .from('users')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          password_hash: passwordHash,
          is_approved: true, // Auto-approuvé pour simplifier
        });

      if (error) {
        console.error('❌ [SIGNUP] Erreur création utilisateur:', error.message);
        return false;
      }

      console.log('🎉 [SIGNUP] Utilisateur créé avec succès');
      return true;

    } catch (error) {
      console.error('💥 [SIGNUP] Erreur inattendue:', error);
      return false;
    }
  }
};
