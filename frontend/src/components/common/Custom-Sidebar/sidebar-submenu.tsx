"use client";

import React from "react";
import { useSidebar } from "./sidebar-context";

interface SidebarSubmenuProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export const SidebarSubmenu = ({
  icon,
  title,
  children,
  isActive = false,
  className = "",
}: SidebarSubmenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isOpen: isSidebarOpen } = useSidebar();

  const toggleSubmenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`mb-1 ${className}`}>
      <button
        onClick={toggleSubmenu}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive
            ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        <div className="flex items-center">
          <span className="mr-3 flex h-5 w-5 items-center justify-center">
            {icon}
          </span>
          {isSidebarOpen && <span>{title}</span>}
        </div>
        {isSidebarOpen && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      {isSidebarOpen && isOpen && (
        <div className="mt-1 ml-6 space-y-1 border-l border-gray-200 pl-2 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export const SidebarSubmenuItem = ({
  children,
  href = "#",
  isActive = false,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  isActive?: boolean;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={`block rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isActive
          ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-700 dark:text-white"
          : "text-gray-700 dark:text-gray-300"
      } ${className}`}
    >
      {children}
    </a>
  );
};
