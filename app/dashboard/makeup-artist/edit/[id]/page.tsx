/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { getFileUrl } from "@/lib/fileUrl";
import toast from "react-hot-toast";

export default function EditMakeupArtist() {
  const { id } = useParams();
  const router = useRouter();

  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/makeup-artist/${id}`);
      setImage(res.data.image);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load image");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      if (file) {
        formData.append("image", file);
      }

      await axios.put(`/makeup-artist/${id}`, formData);

      toast.success("Image updated successfully");

      router.push("/dashboard/makeup-artist");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border p-8">

        <h1 className="text-3xl font-bold mb-2">
          Edit Makeup Artist Image
        </h1>

        <p className="text-gray-500 mb-8">
          Replace existing image.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block mb-3 font-medium">
              Current Image
            </label>

            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : getFileUrl(image)
              }
              alt="Preview"
              className="w-72 h-72 object-cover rounded-2xl border shadow"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Upload New Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Image"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/makeup-artist")
              }
              className="border px-6 py-3 rounded-xl hover:bg-gray-100"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}