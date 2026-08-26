/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    bookingAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleNameBlur = () => {
    if (!form.slug) {
      setForm({
        ...form,
        slug: generateSlug(form.name),
      });
    }
  };

  const validateForm = () => {
    if (!form.name) return "Product name is required";
    if (!form.slug) return "Slug is required";
    if (!form.price) return "Price is required";
    if (!form.bookingAmount) return "Booking amount is required";

    if (Number(form.bookingAmount) > Number(form.price)) {
      return "Booking amount cannot exceed price";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/products/add", {
        name: form.name,
        slug: form.slug,
        price: Number(form.price),
        bookingAmount: Number(form.bookingAmount),
      });

      router.push("/dashboard/products");
    } catch (err: any) {
      console.error(err);
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">

      <h1 className="text-2xl font-semibold mb-6">
        Add Product
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
            onBlur={handleNameBlur}
            className="w-full border rounded px-3 py-2"
            placeholder="Pre Wedding Silver"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Slug
          </label>

          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="pre-wedding-silver"
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
            placeholder="10000"
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
            placeholder="5000"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-3">

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Creating..." : "Create Product"}
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