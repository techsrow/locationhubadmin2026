/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

interface SetType {
  id: string;
  title: string;
  mainImage: string;
  displayorder: number;
  createdAt: string;
}

function SortableCard({
  set,
  handleDelete,
}: {
  set: SetType;
  handleDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: set.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative border rounded-lg overflow-hidden shadow bg-white"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab bg-black text-white px-2 py-1 rounded text-xs z-10"
      >
        Drag
      </div>

      {/* Order Badge */}
      <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded text-sm z-10">
        #{set.displayorder}
      </div>

      <img
        src={`${process.env.NEXT_PUBLIC_FILE_URL}${set.mainImage}`}
        alt={set.title}
        className="w-full h-56 object-cover"
      />

      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4">
          {set.title}
        </h2>

        <div className="flex justify-between">
          <Link
            href={`/dashboard/set/${set.id}`}
            className="text-blue-600"
          >
            Manage
          </Link>

          

          <button
            onClick={() => handleDelete(set.id)}
            className="text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SetListPage() {
  const [sets, setSets] = useState<SetType[]>([]);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
    try {
      const res = await api.get("/set");

      const sorted = res.data.sort(
        (a: SetType, b: SetType) =>
          a.displayorder - b.displayorder
      );

      setSets(sorted);
    } catch {
      toast.error("Failed to load sets");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this set?")) return;

    try {
      await api.delete(`/set/${id}`);
      toast.success("Deleted");
      fetchSets();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setSets((items) => {
      const oldIndex = items.findIndex(
        (item) => item.id === active.id
      );

      const newIndex = items.findIndex(
        (item) => item.id === over.id
      );

      const reordered = arrayMove(
        items,
        oldIndex,
        newIndex
      );

      return reordered.map((item, index) => ({
        ...item,
        displayorder: index + 1,
      }));
    });
  };

  const saveOrder = async () => {
    try {
      setSaving(true);

      await api.put("/set/reorder", {
        sets: sets.map((item, index) => ({
          id: item.id,
          displayorder: index + 1,
        })),
      });

      toast.success("Order Updated");
      fetchSets();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Sets
        </h1>

        <div className="flex gap-3">
          <button
            onClick={saveOrder}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {saving
              ? "Saving..."
              : "Save Order"}
          </button>

          <Link
            href="/dashboard/set/create"
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Create Set
          </Link>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sets.map((s) => s.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sets.map((set) => (
              <SortableCard
                key={set.id}
                set={set}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}