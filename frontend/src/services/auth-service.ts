// Authentication service for handling API requests

interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SignInResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    gender: string;
    email: string;
  };
}

interface ForgotPasswordData {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// Base API URL - replace with your actual API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Sign in a user with email and password
 */
export const Login = async (
  credentials: SignInCredentials
): Promise<SignInResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
      // credentials: "include", // Include cookies for session management
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Store token in localStorage if rememberMe is true
    if (credentials.rememberMe && data.token) {
      localStorage.setItem("auth_token", data.token);
      // Also store in sessionStorage for immediate use
      sessionStorage.setItem("auth_token", data.token);
    } else if (data.token) {
      // Store in sessionStorage only if rememberMe is false
      sessionStorage.setItem("auth_token", data.token);
    }

    // Store user data
    if (data.user) {
      localStorage.setItem("user_data", JSON.stringify(data.user));
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
      // message: data.message || "Login successful",
    };
  } catch (error) {
    console.error("Sign in error:", error);

    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to server. Please check your internet connection."
      );
    }

    throw error;
  }
};

/**
 * Send forgot password request
 */
export const forgotPassword = async (
  data: ForgotPasswordData
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return {
      success: true,
      message: result.message || "Password reset link sent to your email",
    };
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to server. Please check your internet connection."
      );
    }

    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    // Remove tokens from storage
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");

    // Call the API to invalidate the session
    await fetch(`${API_URL}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Sign out error:", error);
    // Don't throw error for sign out, just log it
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    return await response.json();
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

/**
 * Get the authentication token
 */
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Try sessionStorage first, then localStorage
    return (
      sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")
    );
  }
  return null;
};

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Get stored user data
 */
export const getUserData = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};
