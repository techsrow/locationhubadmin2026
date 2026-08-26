/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";

export const pageService = {
  getAll: () => api.get("/pages/admin"),

  getById: (id: string) =>
    api.get(`/pages/admin/${id}`),

  create: (data: any) =>
    api.post("/pages/admin", data),

  update: (id: string, data: any) =>
    api.put(`/pages/admin/${id}`, data),

  delete: (id: string) =>
    api.delete(`/pages/admin/${id}`),

  togglePublish: (id: string) =>
    api.patch(`/pages/admin/${id}/toggle-publish`),
};