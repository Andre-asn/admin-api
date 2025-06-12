// Base API service for handling common API requests

// Base API URL - using your backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Get the authentication token
 */
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Try sessionStorage first, then localStorage
    return (
      sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")
    );
  }
  return null;
};

/**
 * Create headers with authentication token
 */
const createHeaders = (contentType = "application/json"): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": contentType,
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async (response: Response) => {
  let data;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.log("Non-JSON response:", text);
    data = { message: text };
  }

  if (!response.ok) {
    // Handle unauthorized errors
    if (response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    throw new Error(data.message || data.error || "API request failed");
  }

  return data;
};

/**
 * GET request
 */
export const get = async (endpoint: string) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: createHeaders(),
    credentials: "include",
  });

  return handleResponse(response);
};

/**
 * POST request
 */
export const post = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify(data),
    credentials: "include",
  });

  return handleResponse(response);
};

/**
 * PUT request
 */
export const put = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: createHeaders(),
    body: JSON.stringify(data),
    credentials: "include",
  });

  return handleResponse(response);
};

/**
 * DELETE request
 */
export const del = async (endpoint: string) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: createHeaders(),
    credentials: "include",
  });

  return handleResponse(response);
};

/**
 * Upload file
 */
export const uploadFile = async (
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
) => {
  const formData = new FormData();
  formData.append("file", file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      // Don't set Content-Type here, it will be set automatically with the boundary
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
    credentials: "include",
  });

  return handleResponse(response);
};
