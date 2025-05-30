
import { useState, useEffect } from 'react';
import { adminAuthService } from '@/services/adminAuthService';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const isValid = await adminAuthService.verifyAdminSession();
      setIsAuthenticated(isValid);
    } catch (error) {
      console.error('❌ [ADMIN_AUTH_HOOK] Erreur vérification:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('🔐 [ADMIN_AUTH_HOOK] Tentative de connexion avec mot de passe:', password.substring(0, 3) + '...');
      
      const result = await adminAuthService.loginAdmin(password);
      
      if (result.success) {
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: 'Mot de passe incorrect' };
      }
    } catch (error) {
      console.error('❌ [ADMIN_AUTH_HOOK] Erreur login:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  };

  const logout = async () => {
    await adminAuthService.logoutAdmin();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
