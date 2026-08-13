/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import SetupGalleryManager from "@/app/components/SetupGalleryManager";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

interface SetupType {
  id: string;
  title: string;
  mainImage: string;
  content: string;
  slug: string;
}

export default function SetupDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [Editor, setEditor] = useState<any>(null);
  const [setupData, setSetupData] = useState<SetupType | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===== Load Editor ===== */

  useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      setEditor(() => mod.default);
    });
  }, []);

  /* ===== Fetch Setup ===== */

  useEffect(() => {
    if (!id) return;
    fetchSetup();
  }, [id]);

  const fetchSetup = async () => {
    try {
      const res = await api.get(`/setups/id/${id}`);
      setSetupData(res.data);
      setTitle(res.data.title);
      setSlug(res.data.slug);
      setContent(res.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  /* ===== Update ===== */

  const handleUpdate = async () => {
    if (!title) return alert("Title required");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      await api.put(`/setups/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Updated successfully");
      fetchSetup();
      setPreview(null);
      setMainImage(null);
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!setupData) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Setup</h1>

        <button
          onClick={() => router.push("/dashboard/setups")}
          className="text-blue-600"
        >
          Back
        </button>
      </div>

      {/* MAIN IMAGE */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Current Main Image
        </label>

        <img
          src={`${process.env.NEXT_PUBLIC_FILE_URL}${setupData.mainImage}`}
          className="w-72 h-44 object-cover rounded"
          alt="Main"
        />
      </div>

      {/* TITLE */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Title</label>
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* CONTENT */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Content</label>

        {Editor && (
          <CKEditor
            editor={Editor}
            data={content}
            onChange={(event: any, editor: any) =>
              setContent(editor.getData())
            }
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Page Url</label>
        <input
          className="w-full border p-2 rounded"
          value={slug}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded mb-10"
      >
        {loading ? "Updating..." : "Update Setup"}
      </button>

      <hr className="my-10" />

      {/* GALLERY SECTION */}
      <h2 className="text-xl font-bold mb-6">Gallery Images</h2>

      <SetupGalleryManager setupId={id} />
    </div>
  );
}
