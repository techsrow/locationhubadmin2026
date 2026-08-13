/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { getFileUrl } from "@/lib/fileUrl";
import toast from "react-hot-toast";

export default function EditProps() {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/props/${id}`);

        setTitle(res.data.title || "");
        setSubTitle(res.data.subTitle || "");
        setExistingImage(res.data.image || "");
      } catch (error: any) {
        console.error("Fetch Error:", error);

        toast.error(
          error?.response?.data?.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("subTitle", subTitle);

      if (image) {
        formData.append("image", image);
      }

      await api.put(`/props/${id}`, formData);

      toast.success("Props updated successfully");

      router.push("/dashboard/props");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Update failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">
          Edit Props
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Subtitle
            </label>

            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {existingImage && (
            <div>
              <label className="block mb-2 font-medium">
                Current Image
              </label>

              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : getFileUrl(`uploads/${existingImage}`)
                }
                alt="Preview"
                className="w-48 h-48 object-cover rounded-xl border shadow"
              />
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">
              Replace Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] || null)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Update Props
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/props")}
              className="border px-6 py-3 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}