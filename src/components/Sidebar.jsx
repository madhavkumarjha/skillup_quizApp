import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Home, Book, Users, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ role, isOpen, isClosed }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const sidebarRef = useRef(null);

  const handleMenuToggle = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        isClosed(); // auto close sidebar
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Sidebar menu items per role
  const menuItems = {
    student: [
      { name: "Dashboard", icon: Home, path: "/student/dashboard" },
      { name: "My Courses", icon: Book, path: "/student/courses" },
      { name: "Quizzes", icon: ClipboardList, path: "/student/quizzes" },
    ],

    instructor: [
      { name: "Dashboard", icon: Home, path: "/instructor" },
      {
        name: "Courses",
        icon: Book,
        children: [
          { name: "All Courses", path: "/instructor/courses" },
          { name: "Create Course", path: "/instructor/course/create" },
        ],
      },
      {
        name: "Manage Quizzes",
        icon: ClipboardList,
          children: [
          { name: "All Quizzes", path: "/instructor/quizzes" },
          { name: "Create Quiz", path: "/instructor/quiz/create" },
          ]

      },
      { name: "Students", icon: Users, path: "/instructor/students" },
    ],
    admin: [
      { name: "Dashboard", icon: Home, path: "/admin" },
      { name: "Students", icon: Users, path: "/admin/students" },
      {
        name: "Instructors",
        icon: ClipboardList,
        children: [
          { name: "All Instructors", path: "/admin/instructors" },
          { name: "Create Instructor", path: "/admin/instructor/create" },
        ],
      },
    ],
  };

  const currentMenu = menuItems[role] || menuItems.student;

  return (
    <>
      {/* Sidebar container */}
      <aside
      ref={sidebarRef}
        className={`fixed lg:static top-0 left-0 z-40 h-full lg:h-auto w-64 bg-white dark:bg-gray-800 shadow-sm transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <nav className="p-4 space-y-2 md:mt-16">
          <button
            className="lg:hidden text-gray-600 dark:text-gray-200 z-30"
            onClick={isClosed}
          >
            <X size={20} />
          </button>
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            // If the menu has children (submenu)
            if (item.children) {
              const isExpanded = openMenu === item.name;

              return (
                <div key={item.name}>
                  <button
                    onClick={() => handleMenuToggle(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-md transition-all ${
                      isExpanded
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} />
                      {item.name}
                    </span>
                    <span className="ml-auto">{isExpanded ? "▲" : "▼"}</span>
                  </button>

                  {/* Submenu items */}
                  {isExpanded && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            onClick={isClosed}
                            className={`block px-4 py-1 rounded-md text-sm transition-all ${
                              isChildActive
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-800 dark:text-white"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            }`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Normal single menu item
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                onClick={isClosed}
              >
                <Icon size={18} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
