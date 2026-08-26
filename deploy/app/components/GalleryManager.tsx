/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { getFileUrl } from "@/lib/fileUrl";




/* ================= SORTABLE ITEM ================= */

function SortableItem({
  image,
  imageKey,
  titleKey,
  onDelete,
  onPreview,
  onEdit,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };



  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl shadow-md overflow-hidden 
                 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing 
                   bg-gray-100 text-center py-1 text-xs font-medium"
      >
        Drag
      </div>
{titleKey && image[titleKey] && (
  <div className="p-3 text-center bg-gray-50">
    <p className="font-semibold text-gray-800 truncate">
      {image[titleKey]}
    </p>
  </div>
)}
      <img
        src={getFileUrl(image[imageKey])}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => onPreview(image)}
      />

      

     <div className="grid grid-cols-2">
  <button
    type="button"
    onClick={() => onEdit(image)}
    className="bg-blue-500 hover:bg-blue-600 text-white py-2 transition font-medium"
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => onDelete(image.id)}
    className="bg-red-500 hover:bg-red-600 text-white py-2 transition font-medium"
  >
    Delete
  </button>
</div>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function GalleryManager({
  endpoint,
  imageKey = "imageUrl",
  orderKey = "displayorder",
  showTitle = false,
  showPageUrl = false,
}: {
  endpoint: string;
  imageKey?: string;
  orderKey?: string;
  showTitle?: boolean;
  showPageUrl?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [previewImage, setPreviewImage] = useState("");

  const [images, setImages] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const baseURL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";

  /* ================= FETCH ================= */

  const fetchImages = async () => {
    try {
      const res = await api.get(`/${endpoint}`);
      setImages(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);


const handleEdit = (item: any) => {
  setSelectedFile(null);
  setEditId(item.id);
  setTitle(item.title || "");
  setPageUrl(item.pageUrl || "");
  setPreviewImage(getFileUrl(item[imageKey]));

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const resetForm = () => {
  setEditId(null);
  setTitle("");
  setPageUrl("");
  setSelectedFile(null);
  setPreviewImage("");
};

const handleSave = async () => {
  try {
    setLoading(true);

    if (showTitle && !title) {
      toast.error("Title is required");
      return;
    }

    if (showPageUrl && !pageUrl) {
      toast.error("Page URL is required");
      return;
    }

    const formData = new FormData();

    if (showTitle) {
      formData.append("title", title);
    }

    if (showPageUrl) {
      formData.append("pageUrl", pageUrl);
    }

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (editId) {
      await api.put(`/${endpoint}/${editId}`, formData);

      toast.success("Updated successfully");
    } else {
      if (!selectedFile) {
        toast.error("Please select image");
        return;
      }

      await api.post(`/${endpoint}`, formData);

      toast.success("Created successfully");
    }

    resetForm();
    fetchImages();
  } catch (error) {
    console.error(error);
    toast.error("Save failed");
  } finally {
    setLoading(false);
  }
};



  /* ================= DELETE ================= */

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/${endpoint}/${deleteId}`);

      toast.success("Deleted successfully");

      setImages((prev) =>
        prev.filter((img) => img.id !== deleteId)
      );
    } catch (error: any) {
      console.error("Delete error:", error.response?.data || error);
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  /* ================= DRAG REORDER ================= */

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
        [orderKey]: index + 1,
      }));

      try {
        await api.put(`/${endpoint}/reorder`, {
          items: payload,
        });
        toast.success("Order updated");
      } catch {
        toast.error("Reorder failed");
      }
    }
  };

  return (
    <div>
      {/* ================= UPLOAD ================= */}

      <div className="mb-10 space-y-4">

  {showTitle && (
    <input
      type="text"
      placeholder="Enter Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full border p-2 rounded"
    />
  )}
  {showPageUrl && (
  <input
    type="text"
    placeholder="Enter Page URL"
    value={pageUrl}
    onChange={(e) => setPageUrl(e.target.value)}
    className="w-full border p-2 rounded"
  />
)}
  <label
    className="flex flex-col items-center justify-center 
               w-full h-40 border-2 border-dashed 
               border-gray-300 rounded-xl cursor-pointer 
               bg-white hover:bg-gray-50 transition"
  >
    <p className="text-sm text-gray-500 font-medium">
      Click to upload image
    </p>

    <input
  type="file"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  }}
/>
  </label>

{previewImage && (
  <div className="mt-4">
    <img
      src={previewImage}
      alt="Preview"
      className="w-40 h-40 object-cover rounded-lg border"
    />
  </div>
)}

<div className="flex gap-3 mt-4">
  <button
    type="button"
    onClick={handleSave}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
  >
    {editId ? "Update Add-On" : "Create Add-On"}
  </button>

  {editId && (
    <button
      type="button"
      onClick={resetForm}
      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
    >
      Cancel
    </button>
  )}
</div>
</div>


      {/* ================= LOADING ================= */}

      {loading && (
        <div className="flex justify-center my-6">
          <div className="w-10 h-10 border-4 border-blue-500 
                          border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ================= DRAG AREA ================= */}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-4 gap-8">
            {images.map((img) => (
              <SortableItem
  key={img.id}
  image={img}
  imageKey={imageKey}
  titleKey="title"
  onDelete={(id: string) => setDeleteId(id)}
  onPreview={(image: any) => setPreview(image)}
  onEdit={handleEdit}
/>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* ================= DELETE MODAL ================= */}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Delete
            </h2>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PREVIEW MODAL ================= */}

      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
          onClick={() => setPreview(null)}
        >
          <img
  src={getFileUrl(preview[imageKey])}
  className="max-h-[85vh] rounded-xl shadow-2xl"
/>

        </div>
      )}
    </div>
  );
}
