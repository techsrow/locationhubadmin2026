/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import TiptapEditor from "@/app/components/TiptapEditor";

export default function CreatePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    content: "",
    isPublished: true,
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const title = e.target.value;

    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!form.slug.trim()) {
      alert("Slug is required");
      return;
    }

    if (!form.content.trim()) {
      alert("Content is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/pages/admin", form);

      alert("Page created successfully");

      router.push("/dashboard/cms-pages");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to create page"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">

      <div className="mb-6">

        <h1 className="text-2xl font-bold">
          Create CMS Page
        </h1>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >

        {/* TITLE */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Title *
          </label>

          <input
            type="text"
            value={form.title}
            onChange={handleTitleChange}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Terms & Conditions"
          />

        </div>

        {/* SLUG */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Slug *
          </label>

          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                slug: e.target.value,
              }))
            }
            className="w-full border rounded-lg px-4 py-3"
            placeholder="terms-and-conditions"
          />

        </div>

        {/* META TITLE */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Meta Title
          </label>

          <input
            type="text"
            value={form.metaTitle}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                metaTitle: e.target.value,
              }))
            }
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Terms & Conditions | LocationsHub"
          />

        </div>

        {/* META DESCRIPTION */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Meta Description
          </label>

          <textarea
            rows={4}
            value={form.metaDescription}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                metaDescription: e.target.value,
              }))
            }
            className="w-full border rounded-lg px-4 py-3"
            placeholder="SEO description..."
          />

        </div>

        {/* CONTENT */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Content *
          </label>

         <TiptapEditor
  content={form.content}
  onChange={(html) =>
    setForm((prev) => ({
      ...prev,
      content: html,
    }))
  }
/>

          <p className="text-xs text-gray-500 mt-2">
            HTML is supported.
          </p>

        </div>

        {/* PUBLISH */}

        <div>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isPublished: e.target.checked,
                }))
              }
            />

            <span>
              Publish Immediately
            </span>

          </label>

        </div>

        {/* ACTIONS */}

        <div className="flex gap-3">

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            {loading
              ? "Saving..."
              : "Create Page"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/cms-pages")
            }
            className="border px-6 py-3 rounded-lg"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}