/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [form, setForm] = useState({
    name: "",
    price: "",
    bookingAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/id/${productId}`);

      setForm({
        name: res.data.name,
        price: String(res.data.price),
        bookingAmount: String(res.data.bookingAmount),
      });

    } catch (err) {
      console.error("Failed loading product", err);
      setError("Failed to load product");
    }

    setPageLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.name) return "Product name required";
    if (!form.price) return "Price required";
    if (!form.bookingAmount) return "Booking amount required";

    if (Number(form.bookingAmount) > Number(form.price)) {
      return "Booking amount cannot exceed price";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {

      await api.put(`/products/${productId}`, {
        name: form.name,
        price: Number(form.price),
        bookingAmount: Number(form.bookingAmount),
      });

      router.push("/dashboard/products");

    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    }

    setLoading(false);
  };

  if (pageLoading) {
    return <div className="p-6">Loading product...</div>;
  }

  return (
    <div className="p-6 max-w-xl">

      <h1 className="text-2xl font-semibold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {/* Product Name */}

        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Price */}

        <div>
          <label className="block text-sm font-medium mb-1">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Booking Amount */}

        <div>
          <label className="block text-sm font-medium mb-1">
            Booking Amount
          </label>

          <input
            type="number"
            name="bookingAmount"
            value={form.bookingAmount}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Buttons */}

        <div className="flex gap-3 pt-3">

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard/products")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}