"use client"
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from "@/components/custom-dropdown/dropdown"
// import { useToast, toast } from "@/components/custom-toast/toast"

interface User {
  name: string
  email: string
  role: string
  avatar: string
}

interface ProfileDropdownProps {
  user: User
  onProfileClick: () => void
  onSettingsClick: () => void
  onLogout: () => void
}

export function ProfileDropdown({ user, onProfileClick, onSettingsClick, onLogout }: ProfileDropdownProps) {
  // const { addToast } = useToast()

  const handleLogout = () => {
    // addToast(toast.success("Logged out successfully", "You have been logged out of your account"))
    onLogout()
  }

  const handleProfileClick = () => {
    // addToast(toast.info("Opening Profile", "Redirecting to your profile page"))
    onProfileClick()
  }

  const handleSettingsClick = () => {
    // addToast(toast.info("Opening Settings", "Redirecting to settings page"))
    onSettingsClick()
  }

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button className="flex w-full items-center rounded-md p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-full w-full object-cover" />
          </div>
          <div className="ml-2 flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.role}</p>
          </div>
          <svg className="ml-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownTrigger>

      <DropdownContent align="right">
        <DropdownLabel>My Account</DropdownLabel>

        <DropdownItem onClick={handleProfileClick}>
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </div>
        </DropdownItem>

        <DropdownItem onClick={handleSettingsClick}>
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </div>
        </DropdownItem>

        <DropdownSeparator />

        <DropdownItem>
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Help & Support
          </div>
        </DropdownItem>

        <DropdownSeparator />

        <DropdownItem onClick={handleLogout}>
          <div className="flex items-center text-red-600">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign out
          </div>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )
}
