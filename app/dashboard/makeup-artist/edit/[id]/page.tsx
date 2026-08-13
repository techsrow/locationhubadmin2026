/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function EditMakeupArtist() {
  const { id } = useParams();
  const router = useRouter();

  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(`/makeup-artist/${id}`);
    setImage(res.data.image);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) formData.append("image", file);

    await axios.put(`/makeup-artist/${id}`, formData);

    router.push("/dashboard/makeup-artist");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Image</h1>

      <img
        src={`http://localhost:5000${image}`}
        className="w-40 mb-4"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}
