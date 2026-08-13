/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateMakeupArtist() {
  const [files, setFiles] = useState<FileList | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!files) return;

    const formData = new FormData();

    Array.from(files).forEach(file => {
      formData.append("images", file);
    });

    await axios.post("/makeup-artist", formData);

    router.push("/dashboard/makeup-artist");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Upload Makeup Artist Images</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
