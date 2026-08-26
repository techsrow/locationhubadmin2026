/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Page {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  isPublished: boolean;
  createdAt: string;
}

export default function CmsPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const res = await api.get("/pages/admin");
      setPages(res.data.data || []);
    } catch (error) {
      console.error("Failed to load pages", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this page?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/pages/admin/${id}`);

      setPages((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete page");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await api.patch(`/pages/admin/${id}/toggle-publish`);

      loadPages();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filtered = pages.filter((item) =>
    `${item.title} ${item.slug}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginated = filtered.slice(start, end);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / rowsPerPage)
  );

  return (
    <div className="p-8">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-bold">
          CMS Pages
        </h1>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search pages..."
            className="border rounded-lg px-4 py-2"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <Link
            href="/dashboard/cms-pages/create"
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Create Page
          </Link>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">

            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Meta Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>

          </thead>

          <tbody>

            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-gray-500"
                >
                  No pages found
                </td>
              </tr>
            )}

            {paginated.map((item) => (

              <tr
                key={item.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {item.title}
                </td>

                <td className="p-4">
                  /{item.slug}
                </td>

                <td className="p-4">
                  {item.metaTitle || "-"}
                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      handleTogglePublish(item.id)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isPublished
                      ? "Published"
                      : "Draft"}
                  </button>

                </td>

                <td className="p-4">
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <div className="flex gap-4">

                    <Link
                      href={`/dashboard/cms-pages/edit/${item.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* Pagination */}

        <div className="flex justify-end gap-2 p-4 border-t">

          {Array.from({
            length: totalPages,
          }).map((_, i) => {

            const pageNumber = i + 1;

            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-3 py-1 border rounded text-sm ${
                  page === pageNumber
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

        </div>

      </div>

    </div>
  );
}