/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface Booking {
  bookingId: string;
  bookingDate: string;
  firstName: string;
  lastName: string;
  phone: string;
  paymentStatus: string;
  product: {
    name: string;
  };
  slots: any[];
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (error) {
      console.error("Error loading bookings", error);
    }
  };

  /* SEARCH FILTER */

  const filtered = bookings.filter((b) =>
    `${b.firstName} ${b.lastName} ${b.bookingId}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* PAGINATION */

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginated = filtered.slice(start, end);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / rowsPerPage)
  );

  return (
    <div className="p-8">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Bookings
        </h1>

        <input
          placeholder="Search bookings..."
          className="border rounded-lg px-4 py-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page on search
          }}
        />

      </div>

      {/* TABLE */}

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">

            <tr>
              <th className="p-4">Booking ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Product</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {paginated.length === 0 && (

              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>

            )}

            {paginated.map((b) => (

              <tr key={b.bookingId} className="border-t hover:bg-gray-50">

                <td className="p-4 font-mono">
                  {b.bookingId}
                </td>

                <td className="p-4">
                  {b.firstName} {b.lastName}
                </td>

                <td className="p-4">
                  {b.phone}
                </td>

                <td className="p-4">
                  {b.product?.name}
                </td>

                <td className="p-4">
                  {new Date(b.bookingDate).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 text-xs rounded-full
                    ${
                      b.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {b.paymentStatus}
                  </span>

                </td>

                <td className="p-4">

                  <Link
                    href={`/dashboard/booking/${b.bookingId}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* PAGINATION */}

        <div className="flex justify-end gap-2 p-4 border-t">

          {Array.from({ length: totalPages }).map((_, i) => {

            const pageNumber = i + 1;

            return (

              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-3 py-1 border rounded text-sm
                ${
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