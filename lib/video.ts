/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";

export const videoApi = {
  getAll: async () => {
    const res = await api.get("/videos");
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/videos/${id}`);
    return res.data;
  },

  create: async (data: any) => {
    const res = await api.post("/videos", data);
    return res.data;
  },

  update: async (id: string, data: any) => {
    const res = await api.put(`/videos/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/videos/${id}`);
    return res.data;
  },

  reorder: async (items: any[]) => {
    const res = await api.put("/videos/reorder", {
      items,
    });

    return res.data;
  },
};