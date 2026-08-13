/* eslint-disable react-hooks/set-state-in-effect */
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
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getFileUrl } from "@/lib/fileUrl";


interface PropsItem {
  id: string;
  title: string;
  subTitle: string;
  image: string;
}

export default function PropsPage() {
  const [items, setItems] = useState<PropsItem[]>([]);
  const router = useRouter();

  const fetchProps = async () => {
    const res = await api.get("/props");
    setItems(res.data);
  };

  useEffect(() => {
    fetchProps();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;

    await api.delete(`/props/${id}`);
    fetchProps();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      await api.put("/props/reorder", {
        items: newItems.map(i => ({ id: i.id })),
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Props</h1>
        <button
          onClick={() => router.push("/dashboard/props/create")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Props
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4">
            {items.map(item => (
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

  const router = useRouter();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border p-4 rounded flex items-center gap-4 bg-white shadow"
    >
      <div {...listeners} className="cursor-move text-gray-500">☰</div>

     <img
  src={getFileUrl(`uploads/${item.image}`)}
  className="w-20 h-20 object-cover rounded"
/>


      <div className="flex-1">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.subTitle}</p>
      </div>

      <button
        onClick={() => router.push(`/dashboard/props/edit/${item.id}`)}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Edit
      </button>

      <button
        onClick={() => onDelete(item.id)}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );
}
