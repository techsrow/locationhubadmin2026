/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { faqApi } from "@/services/faq";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

function SortableItem({
  item,
  onDelete,
}: {
  item: FAQ;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-white flex justify-between items-center shadow-sm"
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-500 text-xl select-none"
        >
          ☰
        </div>

        <div>
          <h3 className="font-medium">
            {item.question}
          </h3>

          <div className="mt-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                item.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.isActive
                ? "Active"
                : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href={`/dashboard/faq/edit/${item.id}`}
          className="text-blue-600"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(item.id)}
          className="text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const data = await faqApi.getAll();
      setFaqs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );

    if (!confirmed) return;

    try {
      await faqApi.delete(id);

      setFaqs((prev) =>
        prev.filter((faq) => faq.id !== id)
      );

      alert("Deleted successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Delete failed ❌");
    }
  };

  const handleDragEnd = async (
    event: any
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id)
      return;

    const oldIndex = faqs.findIndex(
      (faq) => faq.id === active.id
    );

    const newIndex = faqs.findIndex(
      (faq) => faq.id === over.id
    );

    const newItems = arrayMove(
      faqs,
      oldIndex,
      newIndex
    );

    setFaqs(newItems);

    const payload = newItems.map(
      (item, index) => ({
        id: item.id,
        displayOrder: index + 1,
      })
    );

    try {
      await faqApi.reorder(payload);

      alert(
        "Display Order Updated Successfully ✅"
      );
    } catch (error) {
      console.error(error);
      alert("Reorder failed ❌");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading FAQs...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          FAQs
        </h1>

        <Link
          href="/dashboard/faq/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add FAQ
        </Link>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={faqs.map(
            (faq) => faq.id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >
          <div className="space-y-3">
            {faqs.map((faq) => (
              <SortableItem
                key={faq.id}
                item={faq}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}