/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '../api/axios';

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  interviewAddress: string;
  salary?: string;
  isActive: boolean;
  createdAt: string;
};

type CompanyStore = {
  jobs: Job[];
  companyProfile: any;
  loading: boolean;

  fetchMyJobs: () => Promise<void>;
  fetchCompanyProfile: () => Promise<void>;
  createJob: (data: any) => Promise<void>;
  updateJob: (id: string, data: any) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
  jobs: [],
  companyProfile: null,
  loading: false,

  fetchMyJobs: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/jobs/myjobs');
      console.log(res.data)
      set({ jobs: res.data.jobs || res.data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchCompanyProfile: async () => {
    try {
      const res = await api.get('/api/jobs/:companyId'); // Adjust based on your route
      set({ companyProfile: res.data.data });
    } catch (err) {
      console.error(err);
    }
  },

  createJob: async (data) => {
    const res = await api.post('/api/jobs', data);
    set((state) => ({ jobs: [res.data.job, ...state.jobs] }));
  },

  updateJob: async (id, data) => {
    await api.put(`/api/jobs/${id}`, data);
    // Refresh list
    await useCompanyStore.getState().fetchMyJobs();
  },

  deleteJob: async (id) => {
    await api.delete(`/api/jobs/${id}`);
    set((state) => ({ jobs: state.jobs.filter(j => j.id !== id) }));
  },
}));