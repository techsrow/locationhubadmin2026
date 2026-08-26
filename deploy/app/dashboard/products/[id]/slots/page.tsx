/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";


interface Slot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
}

export default function SlotManager() {
  const params = useParams();
  const productId = params.id as string;

  const [slots, setSlots] = useState<Slot[]>([]);
  const [productName, setProductName] = useState("");

  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/id/${productId}`);
      setProductName(res.data.name);
      setSlots(res.data.slots || []);
    } catch (err) {
      console.error("Failed loading product", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const [editingSlotId, setEditingSlotId] =
  useState<string | null>(null);

const [editForm, setEditForm] = useState({
  startTime: "",
  endTime: "",
});
  /* ---------- TIME FORMAT ---------- */

  function formatTime(time: string) {
  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

  function generateLabel(start: string, end: string) {
    if (!start || !end) return "";
    return `${formatTime(start)} - ${formatTime(end)}`;
  }

  /* ---------- PREVENT OVERLAP ---------- */

  // function isOverlapping(start: string, end: string, slots: any[]) {
  //   const newStart = new Date(`1970-01-01T${start}:00`);
  //   const newEnd = new Date(`1970-01-01T${end}:00`);

  //   return slots.some((slot) => {
  //     const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
  //     const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);

  //     return newStart < existingEnd && newEnd > existingStart;
  //   });
  // }

  const handleStartTimeChange = (value: string | null) => {
  setForm({
    ...form,
    startTime: value || "",
  });
};

const handleEndTimeChange = (value: string | null) => {
  setForm({
    ...form,
    endTime: value || "",
  });
};

  /* ---------- ADD SLOT ---------- */

  const addSlot = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.startTime || !form.endTime) {
    toast.error("Select start and end time");
    return;
  }

  // if (
  //   isOverlapping(
  //     form.startTime,
  //     form.endTime,
  //     slots
  //   )
  // ) {
  //   toast.error(
  //     "Slot overlaps with existing slot"
  //   );
  //   return;
  // }

  const label = generateLabel(
    form.startTime,
    form.endTime
  );

  setLoading(true);

  try {
    const res = await api.post(
      "/products/add-slot",
      {
        productId,
        label,
        startTime: form.startTime,
        endTime: form.endTime,
      }
    );

    if (res.data.success) {
      setSlots([
        ...slots,
        res.data.slot,
      ]);

      setForm({
        startTime: "",
        endTime: "",
      });

      toast.success(
        "Slot added successfully"
      );
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to create slot"
    );
  } finally {
    setLoading(false);
  }
};




  /* ---------- DELETE SLOT ---------- */

 const deleteSlot = async (id: string) => {
  const confirmDelete = window.confirm(
    "Delete this slot?"
  );

  if (!confirmDelete) return;

  try {
    const res = await api.delete(
      `/products/slot/${id}`
    );

    if (res.data.success) {
      setSlots(
        slots.filter(
          (s) => s.id !== id
        )
      );

      toast.success(
        res.data.message ||
          "Slot deleted successfully"
      );
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to delete slot"
    );
  }
};

const startEdit = (slot: Slot) => {
  setEditingSlotId(slot.id);

  setEditForm({
    startTime: slot.startTime,
    endTime: slot.endTime,
  });
};

const cancelEdit = () => {
  setEditingSlotId(null);

  setEditForm({
    startTime: "",
    endTime: "",
  });
};

const saveSlot = async () => {
  if (
    !editForm.startTime ||
    !editForm.endTime
  ) {
    toast.error(
      "Please select start and end time"
    );
    return;
  }

  try {
    const res = await api.put(
      `/products/slot/${editingSlotId}`,
      {
        startTime: editForm.startTime,
        endTime: editForm.endTime,
      }
    );

    if (res.data.success) {
      toast.success(
        res.data.message ||
          "Slot updated successfully"
      );

      setEditingSlotId(null);

      fetchProduct();
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to update slot"
    );
  }
};


  return (
    <div className="p-6 max-w-4xl">

  <h1 className="text-2xl font-semibold mb-6">
    Slots — {productName}
  </h1>

  {/* ADD SLOT */}

  <form
    onSubmit={addSlot}
    className="bg-white shadow rounded-lg p-5 mb-6 space-y-4"
  >
    <h2 className="font-semibold">
      Add Slot
    </h2>

    <div className="grid md:grid-cols-2 gap-4">

      <div>
        <label className="text-sm text-gray-600 block mb-2">
          Start Time
        </label>

        <TimePicker
          value={form.startTime}
          onChange={(value: string | null) =>
            setForm({
              ...form,
              startTime: value || "",
            })
          }
          format="h:mm a"
          disableClock
          clearIcon={null}
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-2">
          End Time
        </label>

        <TimePicker
          value={form.endTime}
          onChange={(value: string | null) =>
            setForm({
              ...form,
              endTime: value || "",
            })
          }
          format="h:mm a"
          disableClock
          clearIcon={null}
        />
      </div>

    </div>

    <button
      type="submit"
      disabled={loading}
      className="bg-black text-white px-4 py-2 rounded"
    >
      {loading ? "Adding..." : "Add Slot"}
    </button>
  </form>

  {/* SLOT LIST */}

  {slots.length === 0 && (
    <p className="text-gray-500">
      No slots added yet
    </p>
  )}

  <div className="grid md:grid-cols-2 gap-4">

    {slots.map((slot) => (

      <div
        key={slot.id}
        className="border rounded-lg p-4 shadow-sm"
      >

        {editingSlotId === slot.id ? (

          <div className="space-y-3">

            <div className="grid grid-cols-2 gap-3">

              <TimePicker
                value={editForm.startTime}
                onChange={(value: string | null) =>
                  setEditForm({
                    ...editForm,
                    startTime: value || "",
                  })
                }
                format="h:mm a"
                disableClock
                clearIcon={null}
              />

              <TimePicker
                value={editForm.endTime}
                onChange={(value: string | null) =>
                  setEditForm({
                    ...editForm,
                    endTime: value || "",
                  })
                }
                format="h:mm a"
                disableClock
                clearIcon={null}
              />

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={saveSlot}
                className="bg-green-600 text-white px-3 py-2 rounded"
              >
                Save
              </button>

              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-3 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        ) : (

          <div className="flex justify-between items-center">

            <div>

              <p className="font-medium">
                {formatTime(slot.startTime)}
                {" - "}
                {formatTime(slot.endTime)}
              </p>

              <p className="text-sm text-gray-500">
                {slot.label}
              </p>

            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() => startEdit(slot)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => deleteSlot(slot.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>

            </div>

          </div>

        )}

      </div>

    ))}

  </div>

</div>
  );
}