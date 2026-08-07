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
    const res = await api.get('/api/admin/companies');
    set({ companies: res.data.data || res.data });
  } catch (err: any) {
    if (err?.response?.status === 404 || !err?.response) {
      await new Promise((r) => setTimeout(r, 1500));
      try {
        const res = await api.get('/api/admin/companies');
        set({ companies: res.data.data || res.data });
        return;
      } catch {
        // do NOT clear companies — keep whatever is already in state
      }
    }
    console.error('Failed to fetch companies:', err);
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
      cacRc: String(data.cacRc).replace(/\s+/g, "").toUpperCase(),
      address: data.address || "",
    };

    // 1. Call API
    let res: any = null;
    try {
      res = await api.post("/api/admin/companies/onboard", payload);
    } catch (err: any) {
      const status = err?.response?.status;
      // 409 = already exists; 404 often false negative on free tier
      if (status !== 409 && status !== 404) {
        throw err;
      }
    }

    //Optimistic row so UI updates even if refetch 404s
    const optimistic = {
      id: res?.data?.companyId || `temp-${Date.now()}`,
      userId: res?.data?.userId || null,
      name: payload.name,
      cacRc: payload.cacRc,
      address: payload.address || null,
      status: "APPROVED",
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      // avoid duplicate if already in list (e.g. 409)
      const exists = state.companies.some(
        (c) => c.cacRc === payload.cacRc || c.id === optimistic.id,
      );
      if (exists) return state;
      return { companies: [optimistic, ...state.companies] };
    });

    //Best-effort refetch (ignore failure)
    try {
      await get().fetchAllCompanies();
    } catch {
      // keep optimistic row
    }
  },

  updateCompany: async (id, data) => {
    await api.put(`/api/admin/companies/${id}`, data);
    await get().fetchAllCompanies();
  },

  deleteCompany: async (userId: string) => {
    //Optimistic update — remove from UI right away
    set((state) => ({
      companies: state.companies.filter(
        (c) => c.userId !== userId && c.id !== userId,
      ),
    }));

    //Call API (ignore flaky 404/500)
    try {
      await api.delete(`/api/admin/companies/${userId}`);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status !== 404 && status !== 500) {
        // Real failure → put it back and rethrow
        await get()
          .fetchAllCompanies()
          .catch(() => {});
        throw err;
      }
    }

    // Best-effort refresh (don't fail the whole action if this 404s)
    try {
      await get().fetchAllCompanies();
    } catch {
      // list already updated optimistically
    }
  },
}));
