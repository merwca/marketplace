const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new ApiError(response.status, error.error || "Request failed");
  }

  return response.json();
}

// Auth
export function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiCall("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: { email: string; password: string }) {
  return apiCall("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMe() {
  return apiCall("/api/auth/me");
}

// Listings
export function getListings(params?: {
  q?: string;
  category?: string;
  city?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.category) query.set("category", params.category);
  if (params?.city) query.set("city", params.city);
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());

  return apiCall(`/api/listings?${query.toString()}`);
}

export function getListing(id: string) {
  return apiCall(`/api/listings/${id}`);
}

export function createListing(data: FormData) {
  const token = getToken();
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_URL}/api/listings`, {
    method: "POST",
    headers,
    body: data,
  }).then((res) => {
    if (!res.ok) throw new ApiError(res.status, "Failed to create listing");
    return res.json();
  });
}

export function updateListing(id: string, data: Record<string, any>) {
  return apiCall(`/api/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteListing(id: string) {
  return apiCall(`/api/listings/${id}`, { method: "DELETE" });
}

export function reportListing(id: string, reason: string) {
  return apiCall(`/api/listings/${id}/report`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// User
export function getProfile() {
  return apiCall("/api/users/me");
}

export function updateProfile(data: Record<string, any>) {
  return apiCall("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function getUserListings() {
  return apiCall("/api/users/me/listings");
}

// Admin
export function getAdminListings(params?: {
  active?: boolean;
  reported?: boolean;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.active !== undefined) query.set("active", params.active.toString());
  if (params?.reported) query.set("reported", "true");
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());

  return apiCall(`/api/admin/listings?${query.toString()}`);
}

export function deleteListingAdmin(id: string) {
  return apiCall(`/api/admin/listings/${id}`, { method: "DELETE" });
}

export function getAdminUsers() {
  return apiCall("/api/admin/users");
}

export function toggleUserBan(id: string) {
  return apiCall(`/api/admin/users/${id}/ban`, { method: "PUT" });
}
