"use client";

import type React from "react";
import { useSidebar } from "./sidebar-context";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar = ({ children, className = "" }: SidebarProps) => {
  const { isOpen, isMobile } = useSidebar();

  // For mobile, we'll use a different approach with a modal-like overlay
  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 z-50 bg-black/50 ${
          isOpen ? "block" : "hidden"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className={`fixed left-0 top-0 h-full w-64 overflow-y-auto bg-white p-4 shadow-lg transition-transform duration-300 dark:bg-gray-800 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } ${className}`}
        >
          {children}
        </div>
      </div>
    );
  }

  // For desktop, we'll use a persistent sidebar that can collapse
  return (
    <div
      className={`h-screen transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      } ${className}`}
    >
      <div className="flex h-full flex-col bg-white shadow-md dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
};

export const SidebarHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`border-b p-4 ${className}`}>{children}</div>;
};

export const SidebarContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex-1 overflow-y-auto p-4 ${className}`}>{children}</div>
  );
};

export const SidebarFooter = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`border-t p-4 ${className}`}>{children}</div>;
};

export const SidebarNavGroup = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const { isOpen } = useSidebar();

  return (
    <div className={`mb-4 ${className}`}>
      {isOpen && (
        <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
          {title}
        </h3>
      )}
      <ul className="space-y-1">{children}</ul>
    </div>
  );
};

export const SidebarNavItem = ({
  icon,
  children,
  href = "#",
  isActive = false,
  className = "",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  isActive?: boolean;
  className?: string;
}) => {
  const { isOpen } = useSidebar();

  return (
    <li>
      <a
        href={href}
        className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive
            ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-gray-700 dark:text-gray-300"
        } ${className}`}
      >
        <span className="mr-3 flex h-5 w-5 items-center justify-center">
          {icon}
        </span>
        {isOpen && <span>{children}</span>}
      </a>
    </li>
  );
};

export const SidebarTrigger = ({ className = "" }: { className?: string }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={`flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      aria-label="Toggle Sidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="9" y1="3" y2="21" />
      </svg>
    </button>
  );
};

export const SidebarSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};
