/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateProps() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    if (image) formData.append("image", image);

    await api.post("/props", formData);

    router.push("/dashboard/props");
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Create Props</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Sub Title"
          className="w-full border p-2 rounded"
          value={subTitle}
          onChange={e => setSubTitle(e.target.value)}
          required
        />

        <input
          type="file"
          onChange={e => setImage(e.target.files?.[0] || null)}
          required
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
