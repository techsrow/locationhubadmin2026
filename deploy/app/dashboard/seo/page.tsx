/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getSeoPages,
  deleteSeoPage,
} from "@/services/seoService";

interface SeoPageType {
  id: string;
  pageKey: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string | null;
}

export default function SeoPage() {
  const [pages, setPages] = useState<SeoPageType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPages = async () => {
    try {
      const res = await getSeoPages();
      setPages(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleDelete = async (
    pageKey: string
  ) => {
    const confirmDelete = window.confirm(
      `Delete SEO page "${pageKey}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteSeoPage(pageKey);

      setPages((prev) =>
        prev.filter(
          (item) => item.pageKey !== pageKey
        )
      );
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          SEO Pages
        </h1>

        <Link
          href="/dashboard/seo/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add SEO
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 border">
                Page Key
              </th>

              <th className="text-left p-3 border">
                Meta Title
              </th>

              <th className="text-left p-3 border">
                OG Image
              </th>

              <th className="text-center p-3 border">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-6"
                >
                  No SEO records found
                </td>
              </tr>
            ) : (
              pages.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 border">
                    {item.pageKey}
                  </td>

                  <td className="p-3 border">
                    {item.metaTitle}
                  </td>

                  <td className="p-3 border">
                    {item.ogImage ? (
                      <img
                        src={`http://localhost:5000${item.ogImage}`}
                        alt=""
                        className="w-20 h-12 object-cover rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3 border">
                    <div className="flex justify-center gap-2">

                     <Link
  href={`/dashboard/seo/edit/${item.pageKey}`}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Edit
</Link>

                      <button
                        onClick={() =>
                          handleDelete(item.pageKey)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}