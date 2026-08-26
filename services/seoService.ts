import api from "@/lib/api";

export const getSeoPages = async () => {
  const res = await api.get("/seo");
  return res.data;
};

export const getSeoPage = async (
  pageKey: string
) => {
  const res = await api.get(
    `/seo/${pageKey}`
  );

  return res.data;
};

export const createSeoPage = async (
  data: FormData
) => {
  const res = await api.post(
    "/seo",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const updateSeoPage = async (
  pageKey: string,
  data: FormData
) => {
  const res = await api.put(
    `/seo/${pageKey}`,
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const deleteSeoPage = async (
  pageKey: string
) => {
  const res = await api.delete(
    `/seo/${pageKey}`
  );

  return res.data;
};