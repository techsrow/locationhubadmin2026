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
  pageUrl: string;
}

export default function SetupDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [Editor, setEditor] = useState<any>(null);

  const [setupData, setSetupData] =
    useState<SetupType | null>(null);

  const [title, setTitle] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [content, setContent] = useState("");

  const [mainImage, setMainImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD EDITOR
  ========================= */

  useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then(
      (mod) => {
        setEditor(() => mod.default);
      }
    );
  }, []);

  /* =========================
     FETCH SETUP
  ========================= */

  useEffect(() => {
    if (!id) return;
    fetchSetup();
  }, [id]);

  const fetchSetup = async () => {
    try {
      const res = await api.get(`/setups/id/${id}`);

      setSetupData(res.data);

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

  /* =========================
     IMAGE CHANGE
  ========================= */

  const handleImageChange = (file: File) => {
    setMainImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* =========================
     UPDATE
  ========================= */

  const handleUpdate = async () => {
    if (!title.trim()) {
      alert("Title required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("pageUrl", pageUrl);
      formData.append("content", content);

      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      await api.put(`/setups/${id}`, formData, {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      });

      alert("Setup updated successfully");

      fetchSetup();

      setMainImage(null);
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!setupData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Manage Setup
        </h1>

        <button
          onClick={() =>
            router.push("/dashboard/setups")
          }
          className="text-blue-600 hover:underline"
        >
          Back
        </button>
      </div>

      {/* TITLE */}

      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* PAGE URL */}

      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Page URL
        </label>

        <input
          type="text"
          value={pageUrl}
          onChange={(e) =>
            setPageUrl(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* MAIN IMAGE */}

      <div className="mb-8">
        <label className="block mb-3 font-semibold">
          Main Image
        </label>

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="
                w-full
                max-w-md
                h-64
                object-cover
                rounded-xl
                border
                shadow-sm
              "
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
            transition-all
          "
        >
          <div className="text-5xl mb-2">
            📷
          </div>

          <span className="font-medium">
            Click to Select New Image
          </span>

          <span className="text-sm text-gray-500">
            JPG • PNG • WEBP
          </span>
        </label>

        <input
          id="mainImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (!file) return;

            handleImageChange(file);
          }}
        />

        {mainImage && (
          <p className="mt-3 text-green-600 text-sm">
            Selected: {mainImage.name}
          </p>
        )}
      </div>

      {/* CONTENT */}

      <div className="mb-8">
        <label className="block mb-2 font-medium">
          Content
        </label>

        {Editor && (
          <CKEditor
            editor={Editor}
            data={content}
            onChange={(
              event: any,
              editor: any
            ) => {
              setContent(
                editor.getData()
              );
            }}
          />
        )}
      </div>

      {/* UPDATE BUTTON */}

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="
          bg-black
          text-white
          px-8
          py-3
          rounded-lg
          hover:opacity-90
          disabled:opacity-50
          mb-10
        "
      >
        {loading
          ? "Updating..."
          : "Update Setup"}
      </button>

      <hr className="my-10" />

      {/* GALLERY */}

      <h2 className="text-2xl font-bold mb-6">
        Gallery Images
      </h2>

      <SetupGalleryManager setupId={id} />
    </div>
  );
}