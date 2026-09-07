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
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type DashboardData = {
  totalBookings: number;
  revenue: number;
  pendingPayments: number;
  todayBookings: number;

  monthlyRevenue: {
    month: string;
    amount: number;
  }[];

  topPackages: {
    product: string;
    count: number;
  }[];

  bookingSources?: {
    source: string;
    count: number;
  }[];
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  useEffect(() => {
    axios
      .get("https://api.locationshub.in/api/analytics/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 space-y-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Bookings" value={data.totalBookings} />
        <Card
          title="Revenue"
          value={`₹${formatCurrency(data.revenue)}`}
        />
        <Card
          title="Pending Payments"
          value={`₹${formatCurrency(data.pendingPayments)}`}
        />
        <Card
          title="Today's Bookings"
          value={data.todayBookings}
        />
      </div>

      {/* Monthly Revenue */}
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
            <Line
              type="monotone"
              dataKey="amount"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Packages */}
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

      {/* Booking Sources */}
      {/* Booking Sources */}

<div className="bg-white p-6 rounded shadow">

  <h2 className="text-lg font-semibold mb-4">
    Bookings By Source
  </h2>

  {!data.bookingSources || data.bookingSources.length === 0 ? (

    <div className="text-gray-500">
      No source data available
    </div>

  ) : (

    <ResponsiveContainer width="100%" height={350}>

      <PieChart>

        <Pie
          data={data.bookingSources}
          dataKey="count"
          nameKey="source"
          outerRadius={120}
          label
        >

          {data.bookingSources.map((_, index) => (

            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />

          ))}

        </Pie>

        <Tooltip />
        <Legend />

      </PieChart>

    </ResponsiveContainer>

  )}

</div>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="bg-white shadow rounded p-6">
      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}