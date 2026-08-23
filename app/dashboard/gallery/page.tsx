/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { galleryApi } from "@/lib/gallery";
import { GalleryImage } from "@/types/gallery";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function GalleryPage() {
  const [items, setItems] = useState<
    GalleryImage[]
  >([]);

  const [saving, setSaving] =
    useState(false);

  const loadData = async () => {
    try {
      const res =
        await galleryApi.getAll();

      setItems(
        [...res.data].sort(
          (a, b) =>
            a.displayOrder -
            b.displayOrder
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Delete this image?"
      )
    )
      return;

    await galleryApi.delete(id);

    loadData();
  };

  const handleDragEnd = (
    result: any
  ) => {
    if (!result.destination) return;

    const reordered = [...items];

    const [removed] =
      reordered.splice(
        result.source.index,
        1
      );

    reordered.splice(
      result.destination.index,
      0,
      removed
    );

    const updated =
      reordered.map(
        (item, index) => ({
          ...item,
          displayOrder:
            index + 1,
        })
      );

    setItems(updated);
  };

  const saveOrder = async () => {
    try {
      setSaving(true);

      await galleryApi.reorder(
        items.map((item) => ({
          id: item.id,
          displayOrder:
            item.displayOrder,
        }))
      );

      alert(
        "Gallery order updated"
      );

      loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to save order"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Photo Gallery
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
            href="/dashboard/gallery/create"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Image
          </Link>

        </div>

      </div>

      <DragDropContext
        onDragEnd={handleDragEnd}
      >
        <Droppable
          droppableId="gallery"
        >
          {(provided) => (
            <div
              ref={
                provided.innerRef
              }
              {...provided.droppableProps}
              className="space-y-4"
            >
              {items.map(
                (
                  item,
                  index
                ) => (
                  <Draggable
                    key={item.id}
                    draggableId={
                      item.id
                    }
                    index={index}
                  >
                    {(
                      provided
                    ) => (
                      <div
                        ref={
                          provided.innerRef
                        }
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white rounded-lg shadow p-4 flex items-center gap-5"
                      >
                        <img
                          src={`http://localhost:5000${item.imageUrl}`}
                          alt=""
                          className="w-24 h-24 object-cover rounded border"
                        />

                        <div className="flex-1">

                          <p>
                            <strong>
                              Order:
                            </strong>{" "}
                            {
                              item.displayOrder
                            }
                          </p>

                          <p>
                            <strong>
                              Type:
                            </strong>{" "}
                            {
                              item.imageType
                            }
                          </p>

                          <p>
                            <strong>
                              Status:
                            </strong>{" "}
                            {item.isActive
                              ? "Active"
                              : "Inactive"}
                          </p>

                        </div>

                        <div className="flex gap-2">

                          <Link
                            href={`/dashboard/gallery/edit/${item.id}`}
                            className="bg-yellow-500 text-white px-3 py-2 rounded"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-2 rounded"
                          >
                            Delete
                          </button>

                        </div>
                      </div>
                    )}
                  </Draggable>
                )
              )}

              {
                provided.placeholder
              }
            </div>
          )}
        </Droppable>
      </DragDropContext>

    </div>
  );
}