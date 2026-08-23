/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { galleryApi } from "@/lib/gallery";

export default function EditGallery({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const { id } = use(params);

  const [loading, setLoading] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewImage, setPreviewImage] =
    useState("");

  const [form, setForm] = useState({
    imageType: "wide",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res =
        await galleryApi.getById(id);

      setForm({
        imageType:
          res.data.imageType || "wide",
        isActive:
          res.data.isActive ?? true,
      });

      setPreviewImage(
        `${process.env.NEXT_PUBLIC_API_URL?.replace(
          "/api",
          ""
        )}${res.data.imageUrl}`
      );
    } catch (error) {
      console.error(
        "Failed to load gallery image",
        error
      );
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData =
        new FormData();

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

      await galleryApi.update(
        id,
        formData
      );

      alert(
        "Gallery image updated successfully"
      );

      router.push(
        "/dashboard/gallery"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update gallery image"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Edit Gallery Image
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-6"
      >
        {/* File Upload */}

        <div>
          <label className="block mb-2 font-medium">
            Gallery Image
          </label>

          <label
            className="
              flex flex-col
              items-center
              justify-center
              w-full
              h-40
              border-2
              border-dashed
              border-gray-300
              rounded-xl
              cursor-pointer
              hover:bg-gray-50
            "
          >
            <span className="text-gray-500">
              Click to choose image
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (!file) return;

                setSelectedFile(file);

                setPreviewImage(
                  URL.createObjectURL(
                    file
                  )
                );
              }}
            />
          </label>
        </div>

        {/* Preview */}

        {previewImage && (
          <div>
            <label className="block mb-2 font-medium">
              Preview
            </label>

            <img
              src={previewImage}
              alt="Preview"
              className="
                w-64
                h-64
                object-cover
                rounded-lg
                border
              "
            />
          </div>
        )}

        {/* Image Type */}

        <div>
          <label className="block mb-2 font-medium">
            Image Type
          </label>

          <select
            className="
              border
              p-3
              w-full
              rounded
            "
            value={form.imageType}
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
              checked={form.isActive}
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
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded
          "
        >
          {loading
            ? "Updating..."
            : "Update Image"}
        </button>

      </form>

    </div>
  );
}