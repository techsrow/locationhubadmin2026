/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createSeoPage,
  updateSeoPage,
} from "@/services/seoService";

interface Props {
  initialData?: any;
  isEdit?: boolean;
}

export default function SeoForm({
  initialData,
  isEdit = false,
}: Props) {
  const router = useRouter();

  const [pageKey, setPageKey] = useState(
    initialData?.pageKey || ""
  );

  const [metaTitle, setMetaTitle] =
    useState(initialData?.metaTitle || "");

  const [
    metaDescription,
    setMetaDescription,
  ] = useState(
    initialData?.metaDescription || ""
  );

  const [ogImageFile, setOgImageFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string>(
      initialData?.ogImage || ""
    );

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "pageKey",
        pageKey
      );

      formData.append(
        "metaTitle",
        metaTitle
      );

      formData.append(
        "metaDescription",
        metaDescription
      );

      if (ogImageFile) {
        formData.append(
          "ogImage",
          ogImageFile
        );
      }

      if (isEdit) {
        await updateSeoPage(
          pageKey,
          formData
        );
      } else {
        await createSeoPage(
          formData
        );
      }

      router.push("/dashboard/seo");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block mb-2 font-medium">
          Page Key
        </label>

        <input
          value={pageKey}
          disabled={isEdit}
          onChange={(e) =>
            setPageKey(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Meta Title
        </label>

        <input
          value={metaTitle}
          onChange={(e) =>
            setMetaTitle(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Meta Description
        </label>

        <textarea
          rows={5}
          value={metaDescription}
          onChange={(e) =>
            setMetaDescription(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          OG Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (!file) return;

            setOgImageFile(file);

            setPreview(
              URL.createObjectURL(
                file
              )
            );
          }}
          className="w-full border p-3 rounded"
        />
      </div>

      {preview && (
        <div>
          <img
            src={preview}
            alt="Preview"
            className="w-80 rounded border"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded"
      >
        {loading
          ? "Saving..."
          : "Save SEO"}
      </button>
    </form>
  );
}