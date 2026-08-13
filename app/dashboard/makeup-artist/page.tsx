/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "@/lib/api";
import Link from "next/link";
import { getFileUrl } from "@/lib/fileUrl";


interface Item {
  id: string;
  image: string;
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
      className="border p-3 rounded flex items-center justify-between bg-white"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* 🔥 DRAG HANDLE ONLY */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab px-2 text-gray-500 select-none"
        >
          ☰
        </div>

       <img
  src={getFileUrl(item.image)}
  className="w-20 h-20 object-cover rounded"
/>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex gap-3">
        <Link
          href={`/dashboard/makeup-artist/edit/${item.id}`}
          className="text-blue-600"
        >
          Edit
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 prevent DnD swallowing click
            onDelete(item.id);
          }}
          className="text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function MakeupArtistPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("/makeup-artist");
    setItems(res.data);
  };

 const handleDelete = async (id: string) => {
  try {
    await axios.delete(`/makeup-artist/${id}`);
    alert("Deleted successfully ✅");
    fetchData();
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Delete failed ❌");
  }
};


 const handleDragEnd = async (event: any) => {
  const { active, over } = event;

  if (!over) return;

  if (active.id !== over.id) {
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    try {
      await axios.put("/makeup-artist/reorder", {
        items: newItems.map((i) => ({ id: i.id })),
      });

      alert("Order updated successfully 🔄✅");
    } catch (error) {
      console.error("Reorder failed:", error);
      alert("Reorder failed ❌");
    }
  }
};


  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Makeup Artist</h1>
        <Link
          href="/dashboard/makeup-artist/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Images
        </Link>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
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
