"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {

  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      pathname.startsWith(path)
        ? "bg-white text-black font-semibold shadow"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  /* -----------------------
     Navigation
  ----------------------- */

  const navItems = [

    { name: "Dashboard", path: "/dashboard", icon: "📊" },

    { name: "Products", path: "/dashboard/products", icon: "📦" },
    { name: "Lock Slots & Date", path: "/dashboard/lock-date", icon: "⏰" },
    { name: "Bookings", path: "/dashboard/booking", icon: "📑" },
    { name: "Calendar", path: "/dashboard/calendar", icon: "📅" },

    { name: "Bride Gallery", path: "/dashboard/bride", icon: "👰" },
    { name: "Groom Gallery", path: "/dashboard/groom", icon: "🤵" },

    { name: "Home Slider", path: "/dashboard/slider", icon: "🖼️" },
    { name: "Our Set", path: "/dashboard/set", icon: "🏛️" },

    { name: "Add-On Services", path: "/dashboard/addon", icon: "➕" },

    { name: "Setups", path: "/dashboard/setup", icon: "📄" },
    { name: "Testimonial", path: "/dashboard/testimonial", icon: "⭐" },
    { name: "Props", path: "/dashboard/props", icon: "🎭" },

    { name: "Make Up Artist", path: "/dashboard/makeup-artist", icon: "💄" }

  ];

  return (

    <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-6">

      {/* Logo */}

      <div className="mb-12">
        <h1 className="text-2xl font-bold tracking-wide">
          Locations
          <span className="text-blue-400">Admin</span>
        </h1>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2">

        {navItems.map((item) => (

          <Link
            key={item.path}
            href={item.path}
            className={linkClass(item.path)}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>

        ))}

      </nav>

      {/* Logout */}

      <button
        onClick={logout}
        className="mt-6 bg-red-600 hover:bg-red-700 transition px-4 py-3 rounded-lg"
      >
        Logout
      </button>

    </aside>

  );

}