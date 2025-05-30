
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  isApproved: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Interface pour la base de données
export interface DatabaseProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// Interface pour les enregistrements vocaux
export interface VoiceRecording {
  id: string;
  user_id: string;
  name: string | null;
  duration: number;
  blob_data: string;
  blob_type: string;
  created_at: string;
  updated_at: string;
}
