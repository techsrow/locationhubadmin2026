/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { getFileUrl } from "@/lib/fileUrl";

interface Testimonial {
  id: string;
  title: string;
  imageUrl: string;
  displayorder: number;
}

export default function TestimonialPage() {
  const [items, setItems] = useState<Testimonial[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const res = await api.get("/testimonials");
    setItems(res.data);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    await api.put("/testimonials/reorder", {
      items: newItems.map((item) => ({ id: item.id })),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;

    await api.delete(`/testimonials/${id}`);
    fetchTestimonials();
  };

  return (
    <div className="p-6">

      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>

        <Link
          href="/dashboard/testimonial/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Testimonial
        </Link>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({ item, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 shadow bg-white"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-500 mb-2"
      >
        ⠿ Drag
      </div>

      <img
  src={getFileUrl(`uploads/${item.imageUrl}`)}
  className="w-full h-48 object-cover rounded"
/>


      <h3 className="mt-2 font-semibold">{item.title}</h3>

      <button
        onClick={() => onDelete(item.id)}
        className="mt-3 text-red-500 text-sm"
      >
        Delete
      </button>
    </div>
  );
}
