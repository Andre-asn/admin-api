"use client"

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar?: string
  initials: string
  phone: string
  status: "online" | "offline" | "away"
  lastLogin: string
  joinedDate: string
  permissions: string[]
}

// Mock API data - in real app this would come from your backend
const mockUserData: UserProfile = {
  id: "user_123",
  name: "Murli Patel",
  email: "murli@definesolutions.com",
  role: "Senior Doctor",
  department: "Cardiology",
  initials: "M",
  phone: "+1 (555) 123-4567",
  status: "online",
  lastLogin: "2024-01-15T10:30:00Z",
  joinedDate: "2022-03-15T00:00:00Z",
  permissions: ["read", "write", "admin"],
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class UserAPI {
  static async getCurrentUser(): Promise<UserProfile> {
    // Simulate network delay
    await delay(800)

    // Simulate potential API errors (uncomment to test error handling)
    // if (Math.random() > 0.8) {
    //   throw new Error("Failed to fetch user data")
    // }

    return mockUserData
  }

  static async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await delay(1000)

    // Simulate update
    const updatedUser = { ...mockUserData, ...updates }

    // In real app, you'd send this to your backend
    console.log("Updating user profile:", updates)

    return updatedUser
  }

  static async logout(): Promise<void> {
    await delay(500)

    // Clear any stored tokens, etc.
    localStorage.removeItem("authToken")
    console.log("User logged out")
  }
}
