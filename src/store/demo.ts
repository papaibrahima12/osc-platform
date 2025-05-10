import { create } from 'zustand';
import type {NGO, Profile, Activity, NGOActivitySector, NGOBeneficiary} from '../types/user';
import {
  listNGOs,
  createNGO,
  updateNGO as updateNGOApi,
  listActivities,
  createActivity,
  updateActivity as updateActivityApi,
  listUsers, listBeneficiairies, listManagers, getMyNGO
} from '../lib/api';

interface DemoState {
  ngos: NGO[];
  users: Profile[];
  myOsc: NGO | null;
  managers: Profile[];
  activities: NGOActivitySector[];
  beneficiairies: NGOBeneficiary[];
  loading: boolean;
  error: string | null;
  fetchNGOs: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchManagers: () => Promise<void>;
  fetchActivities: (ngoId?: string) => Promise<void>;
  fetchMyOSC: (userId?: string) => Promise<void>;
  fetchBeneficiairies: (ngoId?: string) => Promise<void>;
  addNGO: (ngo: Omit<NGO, 'id'>) => Promise<NGO>;
  updateNGO: (id: string, data: Partial<NGO>) => Promise<NGO>;
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<Activity>;
  updateActivity: (id: string, data: Partial<Activity>) => Promise<Activity>;
  clearError: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  ngos: [],
  users: [],
  myOsc: null as NGO | null,
  managers: [],
  activities: [],
  beneficiairies: [],
  loading: false,
  error: null,

    fetchNGOs: async () => {
    set({ loading: true, error: null });
    try {
      const ngos = await listNGOs();
      set({ ngos });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement de l\'osc ' });
    } finally {
      set({ loading: false });
    }
  },

   fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await listUsers();
      set({ users });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement des utilisateurs' });
    } finally {
      set({ loading: false });
    }
  },

    fetchManagers: async () => {
        set({ loading: true, error: null });
        try {
            const managers = await listManagers();
            set({ managers });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement des managers' });
        } finally {
            set({ loading: false });
        }
    },

    fetchActivities: async (ngoId?: string) => {
    set({ loading: true, error: null });
    try {
      const activities = await listActivities(ngoId);
      set({ activities });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement des activités' });
    } finally {
      set({ loading: false });
    }
  },

    fetchMyOSC: async (userId?: string) => {
      set({ loading: true, error: null });
      try {
        const myOsc = await getMyNGO(userId);
        if (myOsc.manager_id === userId) {
          set({ myOsc });
        } else {
          set({ myOsc: null });
        }
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement des activités' });
      } finally {
        set({ loading: false });
      }
    },

    fetchBeneficiairies: async (ngoId?: string) => {
    set({ loading: true, error: null });
    try {
      const beneficiairies = await listBeneficiairies(ngoId);
      set({ beneficiairies });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement des bénéficiaires' });
    } finally {
      set({ loading: false });
    }
  },

   addNGO: async (ngo) => {
    set({ loading: true, error: null });
    try {
      const newNGO = await createNGO(ngo);
      set((state) => ({ ngos: [...state.ngos, newNGO] }));
      return newNGO;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de l\'ONG' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateNGO: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedNGO = await updateNGOApi(id, data);
      set((state) => ({
        ngos: state.ngos.map((ngo) => 
          ngo.id === id ? updatedNGO : ngo
        )
      }));
      return updatedNGO;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour de l\'ONG' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addActivity: async (activity) => {
    set({ loading: true, error: null });
    try {
      const newActivity = await createActivity(activity);
      set((state) => ({ activities: [...state.activities, newActivity] }));
      return newActivity;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de l\'activité' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateActivity: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedActivity = await updateActivityApi(id, data);
      set((state) => ({
        activities: state.activities.map((activity) =>
          activity.id === id ? updatedActivity : activity
        )
      }));
      return updatedActivity;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour de l\'activité' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null })
}));