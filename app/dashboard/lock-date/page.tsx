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
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("ALL");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------------------------
     Load Products
  -------------------------- */

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await api.get("/products");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setProducts(data);
    } catch (error) {
      console.error("Product load error", error);
    }
  }

  /* -------------------------
     Lock Date
  -------------------------- */

  async function lockDate() {
    if (!date) {
      alert("Please select a date");
      return;
    }

    const confirmed = window.confirm(
      productId === "ALL"
        ? "Are you sure you want to lock this date for ALL products?"
        : "Are you sure you want to lock this date?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await api.post(
        "/bookings/admin/lock-date",
        {
          productId,
          date,
        }
      );

      if (res.data.success) {
        alert(
          res.data.message ||
            "Date locked successfully"
        );

        setDate("");
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-[#5a0f2e]">
          Lock Booking Date
        </h1>

        {/* PRODUCT */}

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Product
          </label>

          <select
            value={productId}
            onChange={(e) =>
              setProductId(e.target.value)
            }
            className="border p-3 w-full rounded-lg"
          >
            <option value="ALL">
              🔒 All Products
            </option>

            {products.map((p) => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* WARNING */}

        {productId === "ALL" && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            This will lock the selected date for
            all products and all booking slots.
          </div>
        )}

        {/* DATE */}

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Date
          </label>

          <input
            type="date"
            value={date}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="border p-3 w-full rounded-lg"
          />
        </div>

        {/* BUTTON */}

        <button
          onClick={lockDate}
          disabled={loading}
          className="w-full bg-[#5a0f2e] text-white py-3 rounded-lg hover:bg-[#3d0a1f] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Locking..."
            : productId === "ALL"
            ? "Lock Date For All Products"
            : "Lock Date"}
        </button>
      </div>
    </div>
  );
}