"use client";

import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarTrigger,
} from "./sidebar";
import { SidebarProvider } from "./sidebar-context";
// import { ProfileSection } from "@/components/user-profile/profile-section";
// import { ToastProvider, ToastContainer } from "@/components/custom-toast/toast";
// import { ThemeProvider, useTheme } from "@/components/theme/theme-context";
// import { useToast, toast } from "@/components/custom-toast/toast";

const user = {
  name: "Murli",
  email: "murli@definesolutions.com",
  initials: "M",
  avatar: "", // Leave empty to show initials
};

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  // const { addToast } = useToast();
  // const { toggleTheme, isDarkMode } = useTheme();

  // React.useEffect(() => {
  //   // Show login successful toast when component mounts
  //   const timer = setTimeout(() => {
  //     addToast(
  //       toast.success("Login Successful", "Welcome back to your dashboard!")
  //     );
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [addToast]);

  const handleProfileClick = () => {
    window.location.href = "/dashboard/profile";
  };

  // const handleThemeToggle = () => {
  //   toggleTheme();
  // };

  const handleLogout = () => {
    // Simulate logout
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h1 className="ml-2 text-lg font-bold">MedManager</h1>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarNavGroup title="Main">
              <SidebarNavItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                }
                isActive={true}
                href="/dashboard"
              >
                Dashboard
              </SidebarNavItem>

              <SidebarNavItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                href="/dashboard/patients"
              >
                Patients
              </SidebarNavItem>

              <SidebarNavItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                }
                href="/dashboard/medicines"
              >
                Medicines
              </SidebarNavItem>

              <SidebarNavItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                }
                href="/dashboard/reports"
              >
                Reports
              </SidebarNavItem>

              <SidebarNavItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                href="/dashboard/users"
              >
                Users
              </SidebarNavItem>

              <SidebarNavItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                }
                href="/dashboard/privacy"
              >
                Privacy
              </SidebarNavItem>

              <SidebarNavItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                }
                href="/dashboard/notifications"
              >
                Notifications
              </SidebarNavItem>
            </SidebarNavGroup>
          </SidebarContent>

          {/* <SidebarFooter>
            <ProfileSection
              user={user}
              onProfileClick={handleProfileClick}
              onThemeToggle={handleThemeToggle}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
            />
          </SidebarFooter> */}
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center border-b px-4 bg-white dark:bg-gray-800">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Doctor Management System
            </h2>
          </header>

          <main className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </SidebarProvider>
  );
};

// export default function DashboardLayoutWithNewProfile({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ThemeProvider>
//       <ToastProvider>
//         <DashboardContent>{children}</DashboardContent>
//       </ToastProvider>
//     </ThemeProvider>
//   );
// }
