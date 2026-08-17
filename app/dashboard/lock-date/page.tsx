/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Product = {
  id: string;
  name: string;
};

export default function LockDatePage() {
 
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockedDates, setLockedDates] = useState([]);



  async function loadLockedDates() {
  try {
    const res = await api.get(
      "/bookings/admin/locked-dates"
    );

    setLockedDates(res.data.dates || []);

  } catch (error) {
    console.error(error);
  }
}


async function unlockDate(date: string) {
  const confirmed = window.confirm(
    `Are you sure you want to unlock ${date}?`
  );

  if (!confirmed) return;

  try {
    setLoading(true);

    const res = await api.post(
      "/bookings/admin/unlock-date",
      { date }
    );

    if (res.data.success) {
      alert(
        res.data.message ||
        "Date unlocked successfully"
      );

      await loadLockedDates();
    }
  } catch (error: any) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
      "Failed to unlock date"
    );
  } finally {
    setLoading(false);
  }
}
  /* -------------------------
     Load Products
  -------------------------- */



  /* -------------------------
     Lock Date
  -------------------------- */

  async function lockDate() {
  if (!date) {
    alert("Please select a date");
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to lock ${date}?`
  );

  if (!confirmed) return;

  try {
    setLoading(true);

    const res = await api.post(
      "/bookings/admin/lock-date",
      {
        date,
        reason,
      }
    );

    if (res.data.success) {
      alert(
        res.data.message ||
        "Date locked successfully"
      );

      setDate("");
      setReason("");

      await loadLockedDates();
    }

  } catch (error: any) {

    console.error(error);

    alert(
      error?.response?.data?.message ||
      "Failed to lock date"
    );

  } finally {
    setLoading(false);
  }
}

  return (
   <div className="min-h-screen bg-gray-100 p-4">
  <div className="max-w-3xl mx-auto">

    <div className="bg-white shadow-lg rounded-xl p-8">

      <h1 className="text-2xl font-semibold mb-6 text-[#5a0f2e]">
        Lock Booking Date
      </h1>

      {/* INFO */}

      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        Locked dates will be unavailable for booking across all products.
      </div>

      {/* DATE */}

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Date
        </label>

        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
          className="border p-3 w-full rounded-lg"
        />
      </div>

      {/* REASON */}

      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Reason (Optional)
        </label>

        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Holiday, Maintenance, Personal Event..."
          className="border p-3 w-full rounded-lg"
        />
      </div>

      {/* BUTTON */}

      <button
        onClick={lockDate}
        disabled={loading}
        className="w-full bg-[#5a0f2e] text-white py-3 rounded-lg hover:bg-[#3d0a1f] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Locking..." : "Lock Date"}
      </button>

    </div>

    {/* LOCKED DATES TABLE */}

    <div className="bg-white shadow-lg rounded-xl p-6 mt-6">

      <h2 className="text-xl font-semibold mb-4">
        Locked Dates
      </h2>

      {lockedDates.length === 0 ? (
        <div className="text-gray-500">
          No locked dates found
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Reason
                </th>

                <th className="p-3 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {lockedDates.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {new Date(item.date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td className="p-3">
                    {item.reason || "-"}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        unlockDate(item.date)
                      }
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Unlock
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>

  </div>
</div>
  );
}