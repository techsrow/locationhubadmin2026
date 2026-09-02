/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import api from "@/lib/api";

interface GalleryImage {
  id: string;
  imageUrl: string;
  category: "INDIAN" | "WESTERN";
  displayorder: number;
}

interface Props {
  endpoint: string;
}

export default function CostumeGalleryManager({
  endpoint,
}: Props) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] =
    useState<"INDIAN" | "WESTERN">(
      "INDIAN"
    );

  const [filter, setFilter] =
    useState("ALL");

  useEffect(() => {
    loadImages();
  }, [filter]);

  const loadImages = async () => {
    try {
      const url =
        filter === "ALL"
          ? `/${endpoint}`
          : `/${endpoint}?category=${filter}`;

      const res = await api.get(url);

      setImages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!files?.length) return;

    try {
      setUploading(true);

      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("image", file);
      });

      formData.append(
        "category",
        category
      );

      await api.post(
        `/${endpoint}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setFiles(null);

      await loadImages();

      alert("Uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

 const handleDragEnd = async (result: any) => {
  if (!result.destination) return;

  const reordered = [...images];

  const [removed] = reordered.splice(
    result.source.index,
    1
  );

  reordered.splice(
    result.destination.index,
    0,
    removed
  );

  const updatedImages = reordered.map(
    (item, index) => ({
      ...item,
      displayorder: index + 1,
    })
  );

  setImages(updatedImages);

  try {
    await api.put(
      `/${endpoint}/reorder`,
      {
        items: updatedImages.map(
          (item) => ({
            id: item.id,
            displayorder: item.displayorder,
          })
        ),
      }
    );

    setMessage("✅ Order saved successfully");

setTimeout(() => {
  setMessage("");
}, 3000);

  } catch (error) {
    console.error(error);
    alert("❌ Reorder failed");
    loadImages();
  }
};

  const deleteImage = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this image?"
      )
    )
      return;

    try {
      await api.delete(
        `/${endpoint}/${id}`
      );

      await loadImages();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  const updateCategory = async (
  id: string,
  category: string
) => {
  try {
    await api.put(
      `/${endpoint}/${id}/category`,
      {
        category,
      }
    );

    await loadImages();
  } catch (error) {
    console.error(error);
    alert("Update failed");
  }
};

const updateDisplayOrder = async (
  id: string,
  displayorder: number
) => {
  try {
    await api.put(
      `/${endpoint}/${id}/order`,
      {
        displayorder,
      }
    );

    await loadImages();

    setMessage(
      "✅ Display order updated"
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);

  } catch (error) {
    console.error(error);
    alert("Order update failed");
  }
};

  return (
    <div className="space-y-6">

      {/* Upload Box */}

      <div className="bg-white border rounded-xl p-6">

        <h2 className="font-semibold text-lg mb-4">
          Upload Images
        </h2>

        <div className="flex flex-col md:flex-row gap-4">

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as
                  | "INDIAN"
                  | "WESTERN"
              )
            }
            className="border rounded-lg px-4 py-2"
          >
            <option value="INDIAN">
              Indian
            </option>

            <option value="WESTERN">
              Western
            </option>
          </select>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setFiles(
                e.target.files
              )
            }
          />

          <button
            onClick={
              handleUpload
            }
            disabled={
              uploading
            }
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            {uploading
              ? "Uploading..."
              : "Upload"}
          </button>

        </div>

      </div>

      {/* Filters */}

      <div className="flex gap-3">

        {[
          "ALL",
          "INDIAN",
          "WESTERN",
        ].map((item) => (
          <button
            key={item}
            onClick={() =>
              setFilter(item)
            }
            className={`px-4 py-2 rounded-lg border
            ${
              filter === item
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {item}
          </button>
        ))}
{message && (
  <div className="bg-green-100 text-green-700 border border-green-300 px-4 py-2 rounded-lg">
    {message}
  </div>
)}
      </div>

      {/* Gallery */}

      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {images.map(
          (image) => (
            <div
              key={image.id}
              className="border rounded-xl overflow-hidden bg-white"
            >

              <div className="relative">

               

               <img
src={`${process.env.NEXT_PUBLIC_FILE_URL}${image.imageUrl}`}
  alt=""
  className="w-full  object-cover"
/>

                <span
                  className={`absolute top-2 left-2 px-2 py-1 text-xs rounded
                  ${
                    image.category ===
                    "INDIAN"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {
                    image.category
                  }
                </span>

              </div>

             <div className="p-3 space-y-2">

  <select
    value={image.category}
    onChange={(e) =>
      updateCategory(
        image.id,
        e.target.value
      )
    }
    className="w-full border rounded-lg px-3 py-2"
  >
    <option value="INDIAN">
      Indian
    </option>

    <option value="WESTERN">
      Western
    </option>
  </select>

  <button
    onClick={() =>
      deleteImage(image.id)
    }
    className="w-full bg-red-500 text-white py-2 rounded"
  >
    Delete
  </button>

</div>

            </div>
          )
        )}

      </div> */}
      <DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="gallery">
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="flex flex-col gap-4 max-w-4xl"
      >
        
        {images.map((image, index) => (
          <Draggable
            key={image.id}
            draggableId={image.id}
            index={index}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={`bg-white border rounded-xl p-4 flex items-center gap-4 transition-all
                  ${
                    snapshot.isDragging
                      ? "shadow-2xl border-blue-500"
                      : ""
                  }`}
              >
                {/* Drag Handle */}
                <div
                  {...provided.dragHandleProps}
                  className="cursor-grab text-2xl px-2 select-none"
                >
                  ☰
                </div>

                {/* Thumbnail */}
                <img
                  src={`${process.env.NEXT_PUBLIC_FILE_URL}${image.imageUrl}`}
                  alt=""
                  className="w-24 h-24 object-cover rounded-lg border"
                />

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        image.category === "INDIAN"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {image.category}
                    </span>

                    <span className="bg-black text-white text-xs px-2 py-1 rounded">
                      Order #{image.displayorder}
                    </span>
                  </div>

                  <select
                    value={image.category}
                    onChange={(e) =>
                      updateCategory(
                        image.id,
                        e.target.value
                      )
                    }
                    className="border rounded-lg px-3 py-2 mr-2"
                  >
                    <option value="INDIAN">
                      Indian
                    </option>

                    <option value="WESTERN">
                      Western
                    </option>
                  </select>

                  <button
                    onClick={() =>
                      deleteImage(image.id)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </Draggable>
        ))}

        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>

    </div>
  );
}