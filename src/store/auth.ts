import { create } from 'zustand';
import type { Profile } from '../types/user';
import { signIn as apiSignIn, signOut as apiSignOut, getCurrentUser, getProfile } from '../lib/api';

interface AuthState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ user: Profile }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { user: authUser } = await apiSignIn(email, password);

      if (!authUser) {
        console.error('Aucun utilisateur retourné après authentification');
        set({ error: 'Identifiants invalides', loading: false });
        throw new Error('Identifiants invalides');
      }
      
      const profile = await getProfile(authUser.id);

      set({ user: profile, loading: false });
      return { user: { ...profile, user_metadata: authUser.user_metadata } };
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      set({ 
        error: error.message || 'Une erreur est survenue lors de la connexion',
        loading: false 
      });
      throw error;
    }
  },
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await apiSignOut();
      set({ user: null });
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      set({ 
        error: error.message || 'Une erreur est survenue lors de la déconnexion'
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const authUser = await getCurrentUser();

      if (!authUser) {
        set({ user: null, loading: false });
        return;
      }
      
      const profile = await getProfile(authUser.id);

      set({ user: profile, loading: false });
    } catch (error: any) {
      console.error('Erreur de récupération du profil:', error);
      if (error.message === 'Profil non trouvé') {
        set({ user: null, loading: false });
      } else {
        set({ 
          error: error.message || 'Une erreur est survenue lors du chargement du profil',
          loading: false 
        });
      }
    }
  },
  clearError: () => set({ error: null })
}));