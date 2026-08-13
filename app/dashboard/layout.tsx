/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }

  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="flex flex-col flex-1">

        {/* Header */}

        <Header />

        {/* Page Content */}

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>

  );

}