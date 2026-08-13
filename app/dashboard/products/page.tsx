/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  bookingAmount: number;
  slots?: any[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

const deleteProduct = async (id: string) => {

  const confirmDelete = confirm("Delete this product?");
  if (!confirmDelete) return;

  try {

    await api.delete(`/products/${id}`);

    setProducts(products.filter((p) => p.id !== id));

  } catch (err: any) {

    alert(err?.response?.data?.message || "Delete failed");

  }
};

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>

        <Link
          href="/dashboard/products/add"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Booking Amount</th>
              <th className="p-3">Slots</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No products found
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr key={product.id} className="border-t">

                <td className="p-3 font-medium">
                  {product.name}
                </td>

                <td className="p-3">
                  ₹{product.price}
                </td>

                <td className="p-3">
                  ₹{product.bookingAmount}
                </td>

                <td className="p-3">
                  {product.slots?.length || 0}
                </td>

                <td className="p-3 flex gap-2">

                  <Link
                    href={`/dashboard/products/edit/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/dashboard/products/${product.id}/slots`}
                    className="text-green-600 hover:underline"
                  >
                    Slots
                  </Link>

                <button
  onClick={() => deleteProduct(product.id)}
  className="text-red-600 hover:underline"
>
  Delete
</button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}