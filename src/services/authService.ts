
import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData } from '@/types/auth';
import bcrypt from 'bcryptjs';

export const authService = {
  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; user?: User }> {
    try {
      console.log('🔐 [LOGIN] Tentative de connexion pour:', data.email);
      
      // Rechercher l'utilisateur dans la table users
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
      const passwordMatch = await bcrypt.compare(data.password, userData.password_hash);
      
      if (!passwordMatch) {
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

      console.log('✅ [LOGIN] Connexion réussie avec ID:', user.id);
      return { success: true, user };

    } catch (error) {
      console.error('💥 [LOGIN] Erreur inattendue:', error);
      return { success: false };
    }
  },

  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('📝 [SIGNUP] Création de compte pour:', data.email);
      
      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        console.error('❌ [SIGNUP] Email déjà utilisé');
        return false;
      }

      // Hasher le mot de passe
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(data.password, saltRounds);

      // Insérer le nouvel utilisateur avec un ID généré automatiquement
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          password_hash: passwordHash,
          is_approved: false // Demande d'approbation par défaut
        })
        .select('id')
        .single();

      if (error) {
        console.error('❌ [SIGNUP] Erreur insertion:', error.message);
        return false;
      }

      console.log('🎉 [SIGNUP] Utilisateur créé avec ID:', newUser.id);
      return true;

    } catch (error) {
      console.error('💥 [SIGNUP] Erreur inattendue:', error);
      return false;
    }
  }
};
