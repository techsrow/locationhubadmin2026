/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { enUS } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function BookingCalendar() {

  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {

    const res = await api.get("/bookings/calendar");

    const formatted = res.data.map((e: any) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    }));

    setEvents(formatted);

  };

  const handleSelectEvent = (event: any) => {
  router.push(`/dashboard/booking/${event.bookingId}`);
};

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Booking Calendar
      </h1>

      <div className="bg-white p-4 rounded shadow">

        <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 600 }}
  onSelectEvent={handleSelectEvent}
/>
      </div>

    </div>

  );

}