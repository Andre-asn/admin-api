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
import { SidebarSubmenu, SidebarSubmenuItem } from "./sidebar-submenu";
import { SidebarProvider } from "./sidebar-context";
// import { ProfileDropdown } from "@/components/user-profile/profile-dropdown";
// import { ToastProvider, ToastContainer } from "@/components/custom-toast/toast";
// import { useToast, toast } from "@/components/custom-toast/toast";

const user = {
  name: "Dr. Jane Smith",
  email: "jane.smith@hospital.com",
  role: "Cardiologist",
  avatar: "/placeholder.svg?height=32&width=32",
};

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  // const { addToast } = useToast();

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

  const handleSettingsClick = () => {
    window.location.href = "/dashboard/settings";
  };

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

              <SidebarSubmenu
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
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                }
                title="Appointments"
              >
                <SidebarSubmenuItem href="/dashboard/appointments">
                  All Appointments
                </SidebarSubmenuItem>
                <SidebarSubmenuItem href="/dashboard/appointments/new">
                  New Appointment
                </SidebarSubmenuItem>
                <SidebarSubmenuItem href="/dashboard/appointments/calendar">
                  Calendar View
                </SidebarSubmenuItem>
              </SidebarSubmenu>
            </SidebarNavGroup>

            <SidebarNavGroup title="Management">
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
                href="/dashboard/records"
              >
                Medical Records
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
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                }
                href="/dashboard/prescriptions"
              >
                Prescriptions
              </SidebarNavItem>
            </SidebarNavGroup>
          </SidebarContent>

          {/* <SidebarFooter>
            <ProfileDropdown
              user={user}
              onProfileClick={handleProfileClick}
              onSettingsClick={handleSettingsClick}
              onLogout={handleLogout}
            />
          </SidebarFooter> */}
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center border-b px-4">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold">Doctor Management System</h2>
          </header>

          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </SidebarProvider>
  );
};

const DashboardLayoutWithProfile = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    // <ToastProvider>
    <DashboardContent>{children}</DashboardContent>
    // </ToastProvider>
  );
};

export default DashboardLayoutWithProfile;
