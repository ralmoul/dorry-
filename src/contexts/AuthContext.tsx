
import { createContext } from 'react';
import { AuthState, SignupFormData, LoginFormData } from '@/types/auth';

export interface AuthContextType extends AuthState {
  login: (data: LoginFormData & { rememberMe?: boolean }) => Promise<{ success: boolean; message?: string }>;
  signup: (data: SignupFormData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
