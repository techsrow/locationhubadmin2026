/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface GalleryImage {
  id: string;
  imageUrl: string;
  category: "INDIAN" | "WESTERN";
  displayorder: number;
}

interface Props {
  endpoint: string;
}

export default function CostumeGalleryManager({
  endpoint,
}: Props) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  const [uploading, setUploading] = useState(false);

  const [category, setCategory] =
    useState<"INDIAN" | "WESTERN">(
      "INDIAN"
    );

  const [filter, setFilter] =
    useState("ALL");

  useEffect(() => {
    loadImages();
  }, [filter]);

  const loadImages = async () => {
    try {
      const url =
        filter === "ALL"
          ? `/${endpoint}`
          : `/${endpoint}?category=${filter}`;

      const res = await api.get(url);

      setImages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!files?.length) return;

    try {
      setUploading(true);

      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("image", file);
      });

      formData.append(
        "category",
        category
      );

      await api.post(
        `/${endpoint}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setFiles(null);

      await loadImages();

      alert("Uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this image?"
      )
    )
      return;

    try {
      await api.delete(
        `/${endpoint}/${id}`
      );

      await loadImages();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  const updateCategory = async (
  id: string,
  category: string
) => {
  try {
    await api.put(
      `/${endpoint}/${id}/category`,
      {
        category,
      }
    );

    await loadImages();
  } catch (error) {
    console.error(error);
    alert("Update failed");
  }
};

  return (
    <div className="space-y-6">

      {/* Upload Box */}

      <div className="bg-white border rounded-xl p-6">

        <h2 className="font-semibold text-lg mb-4">
          Upload Images
        </h2>

        <div className="flex flex-col md:flex-row gap-4">

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as
                  | "INDIAN"
                  | "WESTERN"
              )
            }
            className="border rounded-lg px-4 py-2"
          >
            <option value="INDIAN">
              Indian
            </option>

            <option value="WESTERN">
              Western
            </option>
          </select>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setFiles(
                e.target.files
              )
            }
          />

          <button
            onClick={
              handleUpload
            }
            disabled={
              uploading
            }
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            {uploading
              ? "Uploading..."
              : "Upload"}
          </button>

        </div>

      </div>

      {/* Filters */}

      <div className="flex gap-3">

        {[
          "ALL",
          "INDIAN",
          "WESTERN",
        ].map((item) => (
          <button
            key={item}
            onClick={() =>
              setFilter(item)
            }
            className={`px-4 py-2 rounded-lg border
            ${
              filter === item
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {item}
          </button>
        ))}

      </div>

      {/* Gallery */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {images.map(
          (image) => (
            <div
              key={image.id}
              className="border rounded-xl overflow-hidden bg-white"
            >

              <div className="relative">

               

               <img
src={`${process.env.NEXT_PUBLIC_FILE_URL}${image.imageUrl}`}
  alt=""
  className="w-full  object-cover"
/>

                <span
                  className={`absolute top-2 left-2 px-2 py-1 text-xs rounded
                  ${
                    image.category ===
                    "INDIAN"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {
                    image.category
                  }
                </span>

              </div>

             <div className="p-3 space-y-2">

  <select
    value={image.category}
    onChange={(e) =>
      updateCategory(
        image.id,
        e.target.value
      )
    }
    className="w-full border rounded-lg px-3 py-2"
  >
    <option value="INDIAN">
      Indian
    </option>

    <option value="WESTERN">
      Western
    </option>
  </select>

  <button
    onClick={() =>
      deleteImage(image.id)
    }
    className="w-full bg-red-500 text-white py-2 rounded"
  >
    Delete
  </button>

</div>

            </div>
          )
        )}

      </div>

    </div>
  );
}