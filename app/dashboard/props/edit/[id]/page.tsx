/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function EditProps() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      const res = await api.get(`/props/${id}`);
      setTitle(res.data.title);
      setSubTitle(res.data.subTitle);
      setExistingImage(res.data.image);
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    if (image) formData.append("image", image);

    await api.put(`/props/${id}`, formData);

    router.push("/dashboard/props");
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Props</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          type="text"
          className="w-full border p-2 rounded"
          value={subTitle}
          onChange={e => setSubTitle(e.target.value)}
        />

        {existingImage && (
          <img
            src={`http://localhost:5000/uploads/${existingImage}`}
            className="w-32 h-32 object-cover rounded"
          />
        )}

        <input
          type="file"
          onChange={e => setImage(e.target.files?.[0] || null)}
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
