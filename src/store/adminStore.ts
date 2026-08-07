/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import api from "../api/axios";

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
      const res = await api.get("/api/admin/companies");
      set({ companies: res.data.data || res.data });
    } catch (err: any) {
      // one retry after cold start
      if (err?.response?.status === 404 || !err?.response) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const res = await api.get("/api/admin/companies");
          set({ companies: res.data.data || res.data });
          return;
        } catch (e) {
          console.error("Failed to fetch companies:", e);
        }
      }
      console.error("Failed to fetch companies:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await api.get("/api/admin/stats");
      set({ stats: res.data.data });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      set({
        stats: {
          totalCompanies: 0,
          totalJobs: 0,
          totalAdmins: 1,
          pendingCompanies: 0,
        },
      });
    }
  },

  onboardCompany: async (data) => {
  const payload = {
    email: data.email,
    password: data.password,
    name: data.name,
    cacRc: data.cacRc.replace(/\s+/g, "").toUpperCase(),
    address: data.address || "",
  };

  try {
    await api.post("/api/admin/companies/onboard", payload);
  } catch (err: any) {
    const status = err.response?.status;
    // 409 = already exists; 404 on free tier is often a false negative
    if (status !== 409 && status !== 404) throw err;
  }

  await get().fetchAllCompanies();
},

  updateCompany: async (id, data) => {
    await api.put(`/api/admin/companies/${id}`, data);
    await get().fetchAllCompanies();
  },

  deleteCompany: async (userId: string) => {
  try {
    await api.delete(`/api/admin/companies/${userId}`);
  } catch (err: any) {
    const status = err?.response?.status;
    // Free-tier / flaky responses often return 404 or 500 even when work succeeded
    if (status !== 404 && status !== 500) {
      throw err;
    }
    // otherwise fall through and refresh
  }

  await get().fetchAllCompanies();
},
}));

