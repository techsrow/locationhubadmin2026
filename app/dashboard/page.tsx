/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

type DashboardData = {
  totalBookings: number;
  revenue: number;
  pendingPayments: number;
  todayBookings: number;
  monthlyRevenue: { month: string; amount: number }[];
  topPackages: { product: string; count: number }[];
};

export default function DashboardPage() {

  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/analytics/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));

  }, []);

  if (!data) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (

    <div className="p-8 space-y-8">

      {/* Stats Cards */}

      <div className="grid grid-cols-4 gap-6">

        <Card title="Total Bookings" value={data.totalBookings} />

        <Card title="Revenue" value={`₹${data.revenue}`} />

        <Card title="Pending Payments" value={`₹${data.pendingPayments}`} />

        <Card title="Today's Bookings" value={data.todayBookings} />

      </div>

      {/* Monthly Revenue Chart */}

      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-lg font-semibold mb-4">
          Monthly Revenue
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={data.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" />
          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* Top Packages Chart */}

      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-lg font-semibold mb-4">
          Top Packages
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={data.topPackages}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}

function Card({ title, value }: { title: string; value: any }) {

  return (

    <div className="bg-white shadow rounded p-6">

      <p className="text-gray-500">{title}</p>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>

    </div>

  );

}