/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateMakeupArtist() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!files) {
      toast.error("Please select images");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("/makeup-artist", formData);

      toast.success("Images uploaded successfully");

      router.push("/dashboard/makeup-artist");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border p-8">

        <h1 className="text-3xl font-bold mb-2">
          Upload Makeup Artist Images
        </h1>

        <p className="text-gray-500 mb-8">
          Upload one or multiple images.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Select Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
              className="w-full border rounded-xl p-3"
            />
          </div>

          {files && files.length > 0 && (
            <div>
              <label className="block mb-3 font-medium">
                Preview
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from(files).map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    className="h-40 w-full object-cover rounded-xl border shadow"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Images"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/makeup-artist")}
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