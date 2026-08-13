/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface SetupType {
  id: string;
  title: string;
  mainImage: string;
  createdAt: string;
}

export default function SetupListPage() {
  const [setups, setSetups] = useState<SetupType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSetups();
  }, []);

  const fetchSetups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/setups");
      setSetups(res.data);
    } catch (error) {
      console.error("Failed to fetch setups", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this setup?")) return;

    try {
      await api.delete(`/setups/${id}`);
      fetchSetups();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">Setups</h1>

        <Link
          href="/dashboard/setup/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Create Setup
        </Link>
      </div>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {setups.map((setup) => (
          <div
            key={setup.id}
            className="border rounded overflow-hidden shadow bg-white"
          >
            <img
              src={`${process.env.NEXT_PUBLIC_FILE_URL}${setup.mainImage}`}
              alt={setup.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="font-semibold mb-2">{setup.title}</h2>

              <div className="flex justify-between">
                <Link
                  href={`/dashboard/setup/${setup.id}`}
                  className="text-blue-600"
                >
                  Manage
                </Link>

                <button
                  onClick={() => handleDelete(setup.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
