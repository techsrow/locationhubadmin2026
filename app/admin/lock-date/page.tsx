"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Product = {
  id: string;
  name: string;
};

export default function LockDatePage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------------------------
     Load Products
  --------------------------*/

  useEffect(() => {

    async function loadProducts() {

      try {

        const res = await api.get("/products");

        setProducts(res.data);

      } catch (error) {

        console.error("Product load error", error);

      }

    }

    loadProducts();

  }, []);

  /* -------------------------
     Lock Date
  --------------------------*/

  async function lockDate() {

    if (!productId || !date) {
      alert("Select product and date");
      return;
    }

    try {

      setLoading(true);

      const res = await api.post("/bookings/admin/lock-date", {
        productId,
        date
      });

      if (res.data.success) {

        alert("Date locked successfully");

      }

    } catch (error) {

      console.error(error);
      alert("Failed to lock date");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white shadow rounded p-8 w-full max-w-md">

        <h1 className="text-2xl font-semibold mb-6 text-[#5a0f2e]">
          Lock Booking Date
        </h1>

        {/* PRODUCT */}
        <div className="mb-4">

          <label className="block mb-1 font-medium">
            Product
          </label>

          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="border p-2 w-full rounded"
          >

            <option value="">Select product</option>

            {products.map((p) => (

              <option key={p.id} value={p.id}>
                {p.name}
              </option>

            ))}

          </select>

        </div>

        {/* DATE */}
        <div className="mb-6">

          <label className="block mb-1 font-medium">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded"
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={lockDate}
          disabled={loading}
          className="w-full bg-[#5a0f2e] text-white py-2 rounded hover:bg-[#3d0a1f]"
        >
          {loading ? "Locking..." : "Lock Date"}
        </button>

      </div>

    </div>

  );
}