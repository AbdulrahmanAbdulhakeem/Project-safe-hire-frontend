/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import api from "../api/axios";

type HeatmapPoint = {
  lat: number;
  lng: number;
  intensity: number;
  jobId: string;
  title: string;
  company: string;
  reportCount: number;
  verified: boolean;
};

type PublicStore = {
  jobs: any[];
  verification: any;
  selectedCompany: any;
  loading: boolean;
  error: string | null;

  fetchJobs: () => Promise<void>;
  verifyCompany: (cacRc: string) => Promise<void>;
  getCompanyById: (id: string) => Promise<void>;
  clearVerification: () => void;
  heatmapData: HeatmapPoint[];
  fetchHeatmapData: () => Promise<void>;
};

export const usePublicStore = create<PublicStore>((set) => ({
  jobs: [],
  verification: null,
  selectedCompany: null,
  loading: false,
  error: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/api/public");
      set({
        jobs: res.data.jobs || res.data,
        error: null,
      });
    } catch (err: any) {
      console.error("Fetch jobs error:", err);
      set({ error: "Failed to load jobs. Please check your connection." });
    } finally {
      set({ loading: false });
    }
  },

  verifyCompany: async (cacRc: string) => {
    set({ loading: true, verification: null });
    try {
      const res = await api.get(
        `/api/public/companies/verify/${encodeURIComponent(cacRc.trim())}`,
      );
      set({ verification: res.data });
    } catch (err: any) {
      set({
        verification: {
          isRegisteredOnSafeHire: false,
          isVerifiedRegistry: false,
          message:
            err.response?.data?.message || "Could not verify this RC number.",
        },
      });
    } finally {
      set({ loading: false });
    }
  },

  getCompanyById: async (id: string) => {
    set({ loading: true, selectedCompany: null });
    try {
      const res = await api.get(`/api/public/companies/${id}`);
      set({ selectedCompany: res.data.data || res.data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  heatmapData: [],

  fetchHeatmapData: async () => {
  try {
    const res = await api.get('/api/public/heatmap');
    set({ heatmapData: res.data.data || res.data });
  } catch (err) {
    console.error(err);
  }
},

  clearVerification: () => set({ verification: null }),
}));
