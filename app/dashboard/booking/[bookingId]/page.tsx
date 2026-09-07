/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";

export default function BookingDetails() {


  const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { bookingId } = useParams();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    const res = await api.get(`/bookings/${bookingId}`);
    setBooking(res.data);
  };

  const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);


  const total = Number(booking?.totalAmount || 0);
const paid = Number(booking?.bookingAmount || 0);
const gst = Number(booking?.gstAmount || 0);

const packagePrice = total - gst;
const pending = total - paid;
  if (!booking) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-2xl font-bold">
        Booking #{booking.bookingId}
      </h1>

      {/* ORDER INFO */}

      <div className="bg-white shadow rounded-lg p-6">

        <h2 className="text-lg font-semibold mb-4">
          Order Information
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <div>
            <strong>Product:</strong> {booking.product?.name}
          </div>

          <div>
  <strong>Booked For:</strong>{" "}
  {formatDate(booking.bookingDate)}
</div>

<div>
  <strong>Booking Done On:</strong>{" "}
  {formatDateTime(booking.createdAt)}
</div>

          <div>
            <strong>Status:</strong> {booking.paymentStatus}
          </div>

        </div>

        <div className="mt-4">

          <strong>Slots</strong>

          <ul className="list-disc ml-6 mt-2">

            {booking.slots.map((s: any, i: number) => (
              <li key={i}>
                {s.slot.label} ({s.slot.startTime} - {s.slot.endTime})
              </li>
            ))}

          </ul>

        </div>

      </div>

      {/* BILLING INFO */}

      <div className="bg-white shadow rounded-lg p-6">

        <h2 className="text-lg font-semibold mb-4">
          Billing Information
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <div>
            <strong>Name:</strong>{" "}
            {booking.firstName} {booking.lastName}
          </div>

          <div>
            <strong>Email:</strong> {booking.email}
          </div>

          <div>
            <strong>Phone:</strong> {booking.phone}
          </div>

          <div>
            <strong>City:</strong> {booking.city}
          </div>

          <div>
  <strong>State:</strong> {booking.state || "-"}
</div>

          <div>
            <strong>Address:</strong> {booking.address}
          </div>

          <div>
            <strong>Postcode:</strong> {booking.postcode}
          </div>

          <div>
  <strong>Found Us Via:</strong>{" "}
  {booking.source || "-"}
</div>

<div className="col-span-2">
  <strong>Notes:</strong>{" "}
  {booking.notes || "-"}
</div>

        </div>

      </div>

      {/* PAYMENT INFO */}

    {/* PAYMENT INFORMATION */}

{/* PAYMENT SUMMARY */}

<div className="bg-white shadow rounded-lg p-6">

<h2 className="text-lg font-semibold mb-4">
Payment Summary
</h2>

<div className="grid grid-cols-2 gap-4 text-sm">

<div>
  <strong>Package Price:</strong> ₹{formatCurrency(packagePrice)}
</div>

<div>
  <strong>GST:</strong> ₹{formatCurrency(gst)}
</div>

<div className="font-semibold">
  <strong>Total Amount:</strong> ₹{formatCurrency(total)}
</div>

<div className="text-green-600">
  <strong>Advance Paid:</strong> ₹{formatCurrency(paid)}
</div>

<div className="text-red-600">
  <strong>Pending Amount:</strong> ₹{formatCurrency(pending)}
</div>
</div>

</div>

    </div>
  );
}