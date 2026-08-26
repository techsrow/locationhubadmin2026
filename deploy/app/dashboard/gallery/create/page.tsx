/* eslint-disable react-hooks/immutability */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { galleryApi } from "@/lib/gallery";

export default function CreateGallery() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [preview, setPreview] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [form, setForm] = useState({
    imageType: "wide",
    isActive: true,
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPreview(previewUrl);
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      throw new Error(
        "Please select an image"
      );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      selectedFile
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        "Image upload failed"
      );
    }

    const data =
      await response.json();

    return data.url;
  };

 const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append(
    "imageType",
    form.imageType
  );

  formData.append(
    "isActive",
    String(form.isActive)
  );

  if (selectedFile) {
    formData.append(
      "image",
      selectedFile
    );
  }

  await galleryApi.create(
    formData
  );

  router.push(
    "/dashboard/gallery"
  );
};

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Add Gallery Image
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-6"
      >

        {/* File */}

        <div>

          <label className="block mb-2 font-medium">
            Select Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleFileChange
            }
            className="border p-3 w-full rounded"
          />

        </div>

        {/* Preview */}

        {preview && (
          <div>

            <label className="block mb-2 font-medium">
              Preview
            </label>

            <img
              src={preview}
              alt="Preview"
              className="w-64 h-64 object-cover border rounded-lg"
            />

          </div>
        )}

        {/* Image Type */}

        <div>

          <label className="block mb-2 font-medium">
            Image Type
          </label>

          <select
            className="border p-3 w-full rounded"
            value={
              form.imageType
            }
            onChange={(e) =>
              setForm({
                ...form,
                imageType:
                  e.target.value,
              })
            }
          >
            <option value="wide">
              Wide
            </option>

            <option value="tall">
              Tall
            </option>
          </select>

        </div>

        {/* Active */}

        <div>

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={
                form.isActive
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  isActive:
                    e.target.checked,
                })
              }
            />

            Active

          </label>

        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Uploading..."
            : "Save Image"}
        </button>

      </form>

    </div>
  );
}