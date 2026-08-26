/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CreateProps() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/props", formData);

      toast.success("Props created successfully");

      router.push("/dashboard/props");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create props");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Create Props
          </h1>

          <p className="text-gray-500 mt-2">
            Add a new props item with title, subtitle and image.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">
              Title
            </label>

            <input
              type="text"
              placeholder="Enter title"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block mb-2 font-medium">
              Subtitle
            </label>

            <input
              type="text"
              placeholder="Enter subtitle"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] || null)
              }
              className="w-full border rounded-xl p-3"
              required
            />
          </div>

          {/* Preview */}
          {image && (
            <div>
              <label className="block mb-2 font-medium">
                Image Preview
              </label>

              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-56 h-56 object-cover rounded-xl border shadow"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Props"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/props")}
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