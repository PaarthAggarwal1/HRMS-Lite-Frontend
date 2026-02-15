import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Users, CalendarCheck, Menu, X } from "lucide-react";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/employees", label: "Employees", icon: Users },
    { path: "/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  // Auto close sidebar when route changes (important UX fix)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const currentPage =
    navItems.find((item) => item.path === location.pathname)?.label ||
    "HRMS Lite";

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= Desktop Sidebar ================= */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white fixed h-full z-30">

        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
          <span className="text-lg font-bold">HRMS Lite</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* ================= Main Section ================= */}
      <div className="flex-1 md:ml-64 flex flex-col">

        {/* Header */}
        <header className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 bg-white border-b shadow-sm sticky top-0 z-20">

          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-1"
            >
              <Menu size={22} />
            </button>

            <h1 className="text-base sm:text-lg font-semibold truncate">
              {currentPage}
            </h1>
          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* ================= Mobile Sidebar ================= */}

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sliding Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 md:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <span className="text-lg font-bold">HRMS Lite</span>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

    </div>
  );
}
