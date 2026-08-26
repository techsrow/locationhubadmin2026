/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Props {
  setupId: string;
}

function SortableItem({ image, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const baseURL =
    process.env.NEXT_PUBLIC_FILE_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab bg-gray-100 text-center py-1 text-xs font-medium"
      >
        Drag
      </div>

      <img
        src={`${baseURL}${image.imageUrl}`}
        className="w-full h-48 object-cover"
      />

      <button
        onClick={() => onDelete(image.id)}
        className="w-full bg-red-500 text-white py-2"
      >
        Delete
      </button>
    </div>
  );
}

export default function SetupGalleryManager({ setupId }: Props) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  /* ===== Fetch Gallery ===== */

  const fetchImages = async () => {
    try {
      const res = await api.get(`/setups/id/${setupId}`);
      setImages(res.data.gallery || []);
    } catch {
      toast.error("Failed to fetch gallery");
    }
  };

  useEffect(() => {
    if (setupId) fetchImages();
  }, [setupId]);

  /* ===== Upload ===== */

  const handleUpload = async (e: any) => {
    try {
      setLoading(true);

      const files = e.target.files;
      if (!files) return;

      const formData = new FormData();

      for (let file of files) {
        formData.append("gallery", file);
      }

      await api.put(`/setups/${setupId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Uploaded successfully");
      fetchImages();
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Delete ===== */

  const handleDelete = async (imageId: string) => {
    try {
      await api.delete(`/setups/gallery/${imageId}`);
      toast.success("Deleted");
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ===== Reorder ===== */

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((i) => i.id === active.id);
      const newIndex = images.findIndex((i) => i.id === over.id);

      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages);

      const payload = newImages.map((img, index) => ({
        id: img.id,
        displayOrder: index + 1,
      }));

      try {
        await api.patch(`/setups/gallery/reorder`, {
          order: payload,
        });
        toast.success("Order updated");
      } catch {
        toast.error("Reorder failed");
      }
    }
  };

  return (
    <div>
      {/* Upload Box */}
      <div className="mb-6">
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer">
          <span>Click to upload images</span>
          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {loading && <p className="text-center">Uploading...</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {images.map((img) => (
              <SortableItem
                key={img.id}
                image={img}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
