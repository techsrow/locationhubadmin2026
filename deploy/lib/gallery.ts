/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

export const galleryApi = {
  getAll: () =>
    api.get("/gallery/admin"),

  getById: (id: string) =>
    api.get(`/gallery/admin/${id}`),
create: (data: FormData) =>
  api.post(
    "/gallery/admin",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  ),

 update: (
  id: string,
  data: FormData
) =>
  api.put(
    `/gallery/admin/${id}`,
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  ),

  delete: (id: string) =>
    api.delete(
      `/gallery/admin/${id}`
    ),

  reorder: (data: any) =>
    api.put(
      "/gallery/admin/reorder",
      data
    ),

  upload: (
    formData: FormData
  ) =>
    api.post(
      "/gallery/admin/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    ),
};