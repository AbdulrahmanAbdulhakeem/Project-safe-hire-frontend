/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '../api/axios';

type AdminStore = {
  companies: any[];
  stats: any;
  loading: boolean;

  fetchAllCompanies: () => Promise<void>;
  fetchStats: () => Promise<void>;
  onboardCompany: (data: any) => Promise<void>;
  updateCompany: (id: string, data: any) => Promise<void>;
  deleteCompany: (userId: string) => Promise<void>;
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  companies: [],
  stats: null,
  loading: false,

  fetchAllCompanies: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/admin/companies');
      set({ companies: res.data.data || res.data });
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await api.get('/api/admin/stats');
      set({ stats: res.data.data });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      set({ stats: { totalCompanies: 0, totalJobs: 0, totalAdmins: 1, pendingCompanies: 0 } });
    }
  },

  onboardCompany: async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
      cacRc: data.cacRc.replace(/\s+/g, '').toUpperCase(),
      address: data.address || "",
    };

    const res = await api.post('/api/admin/companies/onboard', payload);
    
    // Immediately add to list
    set((state) => ({
      companies: [res.data, ...state.companies]
    }));
  },

  updateCompany: async (id, data) => {
    await api.put(`/api/admin/companies/${id}`, data);
    await get().fetchAllCompanies();
  },

  deleteCompany: async (userId: string) => {
    try {
      await api.delete(`/api/admin/companies/${userId}`);
      await get().fetchAllCompanies();
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },
}));