
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('❌ [AUTH] useAuth called outside of AuthProvider');
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  console.log('🔍 [AUTH] Current auth state in useAuth:', {
    isAuthenticated: context.isAuthenticated,
    hasUser: !!context.user,
    userFirstName: context.user?.firstName || 'none'
  });
  
  return context;
};
