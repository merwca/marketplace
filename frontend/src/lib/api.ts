// Get API base URL - supports multiple deployment scenarios:
// 1. Production (default): Use relative paths - works automatically with reverse proxy
// 2. Development: Use NEXT_PUBLIC_API_URL env var (e.g., http://localhost:4000)
// 3. Docker Compose: Set NEXT_PUBLIC_API_URL in docker-compose.yml
const getApiUrl = (): string => {
  // If explicitly configured via environment variable, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In browser, check if API is on same origin (production with reverse proxy)
  if (typeof window !== "undefined") {
    // In development, frontend might be on different port
    // Set NEXT_PUBLIC_API_URL to override this behavior
    return "";
  }

  // Server-side: use relative paths
  return "";
};

const API_URL = getApiUrl();

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

export function get(endpoint: string) {
  return apiCall(endpoint, { method: "GET" });
}

export function post(endpoint: string, data: Record<string, any>) {
  return apiCall(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function put(endpoint: string, data: Record<string, any>) {
  return apiCall(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
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
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_URL}/api/listings`, {
    method: "POST",
    headers,
    body: data,
  }).then(async (res) => {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const detail = body.details?.map((d: any) => d.message).join(", ");
      throw new ApiError(res.status, detail || body.error || "Failed to create listing");
    }
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

// Reviews
export function getSellerReviews(sellerId: string) {
  return apiCall(`/api/reviews/seller/${sellerId}`);
}

export function createReview(sellerId: string, listingId: string, rating: number, text?: string) {
  return apiCall("/api/reviews", {
    method: "POST",
    body: JSON.stringify({ sellerId, listingId, rating, text }),
  });
}

export function deleteReview(reviewId: string) {
  return apiCall(`/api/reviews/${reviewId}`, { method: "DELETE" });
}
