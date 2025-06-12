"use client";

import { UserAPI, type UserProfile } from "@/src/services/user-api";
import * as React from "react";
// import { useNotification, notify } from "@/components/custom-notification/notification"

interface DynamicProfileSectionProps {
  onProfileClick: () => void;
  onThemeToggle: () => void;
  onLogout: () => void;
  isDarkMode?: boolean;
}

export function DynamicProfileSection({
  onProfileClick,
  onThemeToggle,
  onLogout,
  isDarkMode = false,
}: DynamicProfileSectionProps) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // const { addNotification } = useNotification()
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Fetch user data on component mount
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await UserAPI.getCurrentUser();
        setUser(userData);

        // Show welcome notification after data loads
        // setTimeout(() => {
        //   addNotification(notify.success("Welcome back!", `Hello ${userData.name}, you're successfully logged in.`))
        // }, 500)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load user data";
        setError(errorMessage);
        // addNotification(notify.error("Error", errorMessage))
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // const handleProfileClick = () => {
  //   setIsOpen(false)
  //   addNotification(notify.info("Opening Profile", "Redirecting to your profile page"))
  //   onProfileClick()
  // }

  const handleThemeToggle = () => {
    setIsOpen(false);
    // addNotification(
    //   notify.success(
    //     isDarkMode ? "Light Mode Enabled" : "Dark Mode Enabled",
    //     `Switched to ${isDarkMode ? "light" : "dark"} theme`,
    //   ),
    // )
    onThemeToggle();
  };

  const handleLogout = async () => {
    setIsOpen(false);
    // try {
    //   addNotification(notify.info("Logging out...", "Please wait while we log you out"))
    //   await UserAPI.logout()
    //   addNotification(notify.success("Logged out successfully", "You have been logged out of your account"))
    //   onLogout()
    // } catch (err) {
    //   addNotification(notify.error("Logout failed", "There was an error logging you out"))
    // }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-2">
        <div className="flex items-center w-full p-2 rounded-lg animate-pulse">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="ml-3 flex-1">
            <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="p-2">
        <div className="flex items-center w-full p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
          <div className="h-8 w-8 bg-red-200 rounded-full flex items-center justify-center">
            <svg
              className="h-4 w-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading profile
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-medium text-sm">
            {user.avatar ? (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              user.initials
            )}
          </div>
          {/* Status indicator */}
          <div
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(
              user.status
            )}`}
          ></div>
        </div>
        <div className="ml-3 flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.role}
          </p>
        </div>
        <svg
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-medium text-lg">
                  {user.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    user.initials
                  )}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(
                    user.status
                  )}`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {user.department} • {user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* My Profile */}
            <button
              // onClick={handleProfileClick}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div className="flex-1 text-left">
                <p className="font-medium">My Profile</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  View and edit your profile
                </p>
              </div>
            </button>

            {/* Dark Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isDarkMode ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                )}
              </svg>
              <div className="flex-1 text-left">
                <p className="font-medium">
                  {isDarkMode ? "Light Theme" : "Dark Theme"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Switch appearance
                </p>
              </div>
            </button>

            {/* Separator */}
            <div className="my-2 h-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Log out */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <div className="flex-1 text-left">
                <p className="font-medium">Log out</p>
                <p className="text-xs text-red-400 dark:text-red-500">
                  Sign out of your account
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
