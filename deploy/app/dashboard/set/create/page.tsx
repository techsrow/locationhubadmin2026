/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/lib/api";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

export default function CreateSetPage() {
  const router = useRouter();

  const [Editor, setEditor] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [content, setContent] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Load ClassicEditor only on client
  useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      setEditor(() => mod.default);
    });
  }, []);

  const handleImageChange = (file: File) => {
    setMainImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title || !mainImage) {
      alert("Title and Main Image are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("pageUrl", pageUrl);
      formData.append("content", content);
      formData.append("mainImage", mainImage);

      await api.post("/set", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/dashboard/set");
    } catch (error) {
      console.error(error);
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create Set</h1>

      {/* Title */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Main Image */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Main Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleImageChange(e.target.files[0])
          }
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 w-64 h-40 object-cover rounded"
          />
        )}
      </div>

      {/* CKEditor */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Content</label>

        {Editor && (
          <CKEditor
            editor={Editor}
            data={content}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Page Url</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={pageUrl}
          onChange={(e) => setPageUrl(e.target.value)}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Set"}
      </button>
    </div>
  );
}
