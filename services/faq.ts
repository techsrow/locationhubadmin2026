/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "@/lib/api";

export const faqApi = {
  getAll: async () => {
    const response = await api.get("/faq");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/faq/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/faq", data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/faq/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/faq/${id}`);
    return response.data;
  },

  reorder: async (items: any[]) => {
    const response = await api.put("/faq/reorder", {
      items,
    });

    return response.data;
  },
};