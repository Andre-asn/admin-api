"use client";

import React from "react";
import { DropdownProvider, useDropdown } from "./dropdown-context";

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}

export function Dropdown({ children, className = "" }: DropdownProps) {
  return (
    <DropdownProvider>
      <div className={`relative inline-block text-left ${className}`}>
        {children}
      </div>
    </DropdownProvider>
  );
}

export const DropdownTrigger = ({
  children,
  className = "",
  asChild = false,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) => {
  const { toggleDropdown } = useDropdown();

  if (asChild && React.isValidElement(children)) {
    // return React.cloneElement(children, {
    //   onClick: toggleDropdown,
    //   className: `${children.props.className || ""} ${className}`,
    // });
  }

  return (
    <button onClick={toggleDropdown} className={`${className}`}>
      {children}
    </button>
  );
};

export const DropdownContent = ({
  children,
  className = "",
  align = "right",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) => {
  const { isOpen, closeDropdown } = useDropdown();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  // Close dropdown on escape key
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeDropdown]);

  if (!isOpen) return null;

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 ${alignmentClasses[align]} ${className}`}
      style={{
        animation: isOpen ? "fadeIn 0.1s ease-out" : undefined,
      }}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  const { closeDropdown } = useDropdown();

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      closeDropdown();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white ${className}`}
    >
      {children}
    </button>
  );
};

export const DropdownSeparator = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <div className={`my-1 h-px bg-gray-100 dark:bg-gray-700 ${className}`} />
  );
};

export function DropdownLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 ${className}`}
    >
      {children}
    </div>
  );
}
