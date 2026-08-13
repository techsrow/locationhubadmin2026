/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import SetGalleryManager from "@/app/components/SetGalleryManager";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

interface SetType {
  id: string;
  title: string;
  mainImage: string;
  content: string;
  pageUrl: string;
}

export default function SetDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [Editor, setEditor] = useState<any>(null);

  const [setData, setSetData] = useState<SetType | null>(null);

  const [title, setTitle] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [content, setContent] = useState("");

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      setEditor(() => mod.default);
    });
  }, []);

  useEffect(() => {
    if (id) {
      fetchSet();
    }
  }, [id]);

  const fetchSet = async () => {
    try {
      const res = await api.get(`/set/${id}`);

      setSetData(res.data);

      setTitle(res.data.title);
      setPageUrl(res.data.pageUrl);
      setContent(res.data.content);

      setPreview(
        `${process.env.NEXT_PUBLIC_FILE_URL}${res.data.mainImage}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (file: File) => {
    setMainImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("pageUrl", pageUrl);
      formData.append("content", content);

      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      await api.put(`/set/${id}`, formData);

      alert("Updated Successfully");

      setMainImage(null);

      await fetchSet();
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!setData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-5xl p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Manage Set
        </h1>

        <button
          onClick={() => router.push("/dashboard/set")}
          className="text-blue-600"
        >
          ← Back
        </button>
      </div>

      {/* TITLE */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Title
        </label>

        <input
          type="text"
          className="w-full border rounded-lg p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* IMAGE */}
      <div className="mb-8">
        <label className="block mb-3 font-semibold">
          Main Image
        </label>

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-w-md h-64 object-cover rounded-xl border shadow"
            />
          </div>
        )}

        <label
          htmlFor="mainImage"
          className="
            flex flex-col
            items-center
            justify-center
            w-full
            max-w-md
            h-40
            border-2
            border-dashed
            border-gray-300
            rounded-xl
            cursor-pointer
            hover:border-black
            hover:bg-gray-50
            transition
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4"
            />
          </svg>

          <span className="font-medium">
            Click to Select Image
          </span>

          <span className="text-sm text-gray-500">
            JPG, PNG, WEBP
          </span>
        </label>

        <input
          id="mainImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            handleImageChange(file);
          }}
        />

        {mainImage && (
          <div className="mt-3 text-green-600 text-sm">
            Selected: {mainImage.name}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Content
        </label>

        {Editor && (
          <CKEditor
            editor={Editor}
            data={content}
            onChange={(event: any, editor: any) => {
              setContent(editor.getData());
            }}
          />
        )}
      </div>

      {/* PAGE URL */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Page URL
        </label>

        <input
          type="text"
          className="w-full border rounded-lg p-3"
          value={pageUrl}
          onChange={(e) => setPageUrl(e.target.value)}
        />
      </div>

      {/* UPDATE BUTTON */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Updating..." : "Update Set"}
      </button>

      <hr className="my-10" />

      <h2 className="text-2xl font-bold mb-4">
        Gallery Images
      </h2>

      <SetGalleryManager setId={id as string} />
    </div>
  );
}