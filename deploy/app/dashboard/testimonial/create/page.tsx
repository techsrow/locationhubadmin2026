/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateTestimonial() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title) {
      alert("Title required");
      return;
    }

    if (!image) {
      alert("Image required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    await api.post("/testimonials", formData);

    router.push("/dashboard/testimonial");
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Add Testimonial</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <button className="bg-black text-white px-4 py-2 rounded w-full">
          Upload
        </button>
      </form>
    </div>
  );
}
