/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Product = {
  id: string;
  name: string;
};

export default function LockDatePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string>("ALL");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function lockDate() {
    if (!date) {
      alert("Please select a date");
      return;
    }

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
        alert(res.data.message);

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-[#5a0f2e] mb-8">
          Lock Booking Date
        </h1>

        <div className="mb-5">
          <label className="block mb-2 text-lg font-medium">
            Product
          </label>

          <select
            value={productId}
            onChange={(e) =>
              setProductId(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          >
            <option value="ALL">
              🔒 All Products
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {productId === "ALL" && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            This will lock the selected date
            for ALL products and ALL slots.
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          onClick={lockDate}
          disabled={loading}
          className="w-full bg-[#5a0f2e] text-white py-3 rounded-lg font-medium hover:bg-[#430b22]"
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