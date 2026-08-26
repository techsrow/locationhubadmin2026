/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { HiOutlineBars3 } from "react-icons/hi2";

interface SetupType {
  id: string;
  title: string;
  mainImage: string;
  displayOrder: number;
  createdAt: string;
}

/* ==================================
   SORTABLE CARD
================================== */

function SortableSetupCard({
  setup,
  children,
}: {
  setup: SetupType;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: setup.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

/* ==================================
   PAGE
================================== */

export default function SetupListPage() {
  const [setups, setSetups] = useState<SetupType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSetups();
  }, []);

  /* ==========================
     FETCH
  ========================== */

  const fetchSetups = async () => {
    try {
      setLoading(true);

      const res = await api.get("/setups");

      const sorted = res.data.sort(
        (a: SetupType, b: SetupType) =>
          a.displayOrder - b.displayOrder
      );

      setSetups(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================
     DELETE
  ========================== */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this setup?")) return;

    try {
      await api.delete(`/setups/${id}`);

      fetchSetups();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  /* ==========================
     DRAG END
  ========================== */

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setSetups((items) => {
        const oldIndex = items.findIndex(
          (item) => item.id === active.id
        );

        const newIndex = items.findIndex(
          (item) => item.id === over.id
        );

        return arrayMove(
          items,
          oldIndex,
          newIndex
        );
      });
    }
  };

  /* ==========================
     SAVE ORDER
  ========================== */

  const saveOrder = async () => {
    try {
      setSaving(true);

      const order = setups.map(
        (item, index) => ({
          id: item.id,
          displayOrder: index + 1,
        })
      );

      await api.patch(
        "/setups/reorder",
        {
          order,
        }
      );

      alert(
        "Display Order Updated Successfully"
      );

      fetchSetups();
    } catch (error) {
      console.error(error);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Setups
        </h1>

        <div className="flex gap-3">
          <button
            onClick={saveOrder}
            disabled={saving}
            className="bg-green-600 text-white px-5 py-2 rounded"
          >
            {saving
              ? "Saving..."
              : "Save Order"}
          </button>

          <Link
            href="/dashboard/setup/create"
            className="bg-black text-white px-5 py-2 rounded"
          >
            + Create Setup
          </Link>
        </div>
      </div>

      {loading && (
        <p>Loading setups...</p>
      )}

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={setups.map(
            (item) => item.id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {setups.map((setup) => (
              <SortableSetupCard
                key={setup.id}
                setup={setup}
              >
                <div className="relative border rounded-xl overflow-hidden shadow bg-white cursor-move">
                  {/* ORDER */}

                 <div className="absolute top-2 left-2 flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg text-sm z-10 shadow">
  <HiOutlineBars3 className="text-lg" />
  <span>#{setup.displayOrder}</span>
</div>

                  {/* IMAGE */}

                  <img
                    src={`${process.env.NEXT_PUBLIC_FILE_URL}${setup.mainImage}`}
                    alt={setup.title}
                    className="w-full h-52 object-cover"
                  />

                  {/* CONTENT */}

                  <div className="p-4">
                    <h2 className="font-semibold text-lg mb-3">
                      {setup.title}
                    </h2>

                    <div className="flex justify-between">
                      <Link
                        href={`/dashboard/setup/${setup.id}`}
                        className="text-blue-600"
                      >
                        Manage
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            setup.id
                          )
                        }
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </SortableSetupCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}