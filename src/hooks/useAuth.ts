import { create } from 'zustand';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null; 
  setAuth: (user: User, token: string, role?: string) => void; // Updated to accept role
  clearAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  role: null, // Initialize role as null
  setAuth: (user, token, role = 'USER') => set({ user, token, role }), // Default role is 'USER'
  clearAuth: () => set({ user: null, token: null, role: null }), // Clear role on logout
}));