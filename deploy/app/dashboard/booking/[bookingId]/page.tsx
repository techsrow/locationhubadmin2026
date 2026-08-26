/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";

export default function BookingDetails() {

  const { bookingId } = useParams();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    const res = await api.get(`/bookings/${bookingId}`);
    setBooking(res.data);
  };


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
            <strong>Date:</strong>{" "}
            {new Date(booking.bookingDate).toLocaleDateString()}
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
            <strong>Address:</strong> {booking.address}
          </div>

          <div>
            <strong>Postcode:</strong> {booking.postcode}
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
<strong>Package Price:</strong> ₹{packagePrice}
</div>

<div>
<strong>GST:</strong> ₹{gst}
</div>

<div className="font-semibold">
<strong>Total Amount:</strong> ₹{total}
</div>

<div className="text-green-600">
<strong>Advance Paid:</strong> ₹{paid}
</div>

<div className="text-red-600">
<strong>Pending Amount:</strong> ₹{pending}
</div>

</div>

</div>

    </div>
  );
}