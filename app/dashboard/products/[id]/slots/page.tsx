/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

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

  /* ---------- TIME FORMAT ---------- */

  function formatTime(time: string) {
    const [h, m] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(h);
    date.setMinutes(m);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function generateLabel(start: string, end: string) {
    if (!start || !end) return "";
    return `${formatTime(start)} - ${formatTime(end)}`;
  }

  /* ---------- PREVENT OVERLAP ---------- */

  function isOverlapping(start: string, end: string, slots: any[]) {
    const newStart = new Date(`1970-01-01T${start}:00`);
    const newEnd = new Date(`1970-01-01T${end}:00`);

    return slots.some((slot) => {
      const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
      const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);

      return newStart < existingEnd && newEnd > existingStart;
    });
  }

  /* ---------- ADD SLOT ---------- */

  const addSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.startTime || !form.endTime) {
      alert("Select start and end time");
      return;
    }

    if (isOverlapping(form.startTime, form.endTime, slots)) {
      alert("Slot overlaps with existing slot");
      return;
    }

    const label = generateLabel(form.startTime, form.endTime);

    setLoading(true);

    try {
      const res = await api.post("/products/add-slot", {
        productId,
        label,
        startTime: form.startTime,
        endTime: form.endTime,
      });

      setSlots([...slots, res.data.slot]);

      setForm({
        startTime: "",
        endTime: "",
      });
    } catch (err) {
      console.error("Slot creation failed", err);
    }

    setLoading(false);
  };

  /* ---------- DELETE SLOT ---------- */

  const deleteSlot = async (id: string) => {
    const confirmDelete = confirm("Delete this slot?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/slots/${id}`);
      setSlots(slots.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl">

      <h1 className="text-2xl font-semibold mb-6">
        Slots — {productName}
      </h1>

      {/* ---------- ADD SLOT FORM ---------- */}

      <form
        onSubmit={addSlot}
        className="bg-white shadow rounded-lg p-5 mb-6 space-y-4"
      >
        <h2 className="font-semibold">Add Slot</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">
              Start Time
            </label>

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              End Time
            </label>

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

        </div>

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Slot"}
        </button>
      </form>

      {/* ---------- SLOT CARDS ---------- */}

      {slots.length === 0 && (
        <p className="text-gray-500">No slots added yet</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">

        {slots.map((slot) => (

          <div
            key={slot.id}
            className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
          >

            <div>
              <p className="font-medium">
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </p>

              <p className="text-sm text-gray-500">
                {slot.label}
              </p>
            </div>

            <button
              onClick={() => deleteSlot(slot.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}