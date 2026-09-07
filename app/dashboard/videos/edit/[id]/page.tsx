/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { videoApi } from "@/lib/video";

export default function EditVideoPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    vimeoId: "",
    category: "PREWEDDING",
    isActive: true,
  });

  useEffect(() => {
    if (params.id) {
      loadVideo();
    }
  }, [params.id]);

  const loadVideo = async () => {
    try {
      const video = await videoApi.getById(params.id as string);

      setFormData({
        title: video.title || "",
        vimeoId: video.vimeoId || "",
        category: video.category || "PREWEDDING",
        isActive: video.isActive,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await videoApi.update(
        params.id as string,
        formData
      );

      alert("Video updated successfully");

      router.push("/dashboard/videos");
    } catch (error) {
      console.error(error);
      alert("Failed to update video");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        Edit Video
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block mb-2">
            Title
          </label>

          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2">
            Vimeo ID
          </label>

          <input
            type="text"
            value={formData.vimeoId}
            onChange={(e) =>
              setFormData({
                ...formData,
                vimeoId: e.target.value,
              })
            }
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">
            Category
          </label>

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
            className="w-full border p-3 rounded"
          >
            <option value="PREWEDDING">
              PREWEDDING
            </option>
             <option value="COMMERCIAL">
              COMMERCIAL
            </option>
           
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({
                ...formData,
                isActive: e.target.checked,
              })
            }
          />

          <label>Active</label>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-5 py-3 rounded"
        >
          Update Video
        </button>
      </form>
    </div>
  );
}