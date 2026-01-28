import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="w-full bg-white dark:bg-gray-900 z-50 fixed top-0 left-0">
        <Header toggleSidebar={toggleSidebar} />
      </header>

      <div className="flex-1 flex">
        <aside className="lg:w-64 shrink-0 lg:fixed lg:overflow-hidden bg-white dark:bg-gray-800">
          <Sidebar
            isOpen={isSidebarOpen}
            isClosed={() => setIsSidebarOpen(false)}
            role="admin"
          />
        </aside>
        <main className="lg:ml-64 flex-1 md:mb-15 mt-15 py-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      <footer className="w-full bg-yellow-100 text-sm z-40 md:fixed md:bottom-0 md:left-0">
        <Footer />
      </footer>
    </div>
  );
}

export default AdminLayout;
