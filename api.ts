import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://virtual-date-api.onrender.com/api/v1";

let isRedirecting = false;

/**
 * Core API request wrapper
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Safely access localStorage in SSR environments (Next.js)
  let token = null;
  if (typeof window !== "undefined") {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        token = JSON.parse(authStorage).state.token;
      }
    } catch (e) {
      console.error("Failed to parse auth token", e);
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("userId");
      if (!isRedirecting && typeof window !== "undefined") {
        isRedirecting = true;
        toast.error("Session corrupted. Please log in again.");
        window.location.href = "/login";
      }
    }
  }
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  // Handle error responses
  if (!res.ok) {
    let errorMessage = `API error: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore JSON parse errors for non-JSON error responses
    }
    
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("userId");
        if (!isRedirecting) {
          isRedirecting = true;
          toast.error("Session expired, please log in again.");
          window.location.href = "/login";
        }
      }
    }
    
    const error = new Error(errorMessage) as any;
    error.status = res.status;
    throw error;
  }

  // Handle empty responses (204 No Content or endpoints explicitly returning no body)
  if (res.status === 204) return null as T;
  
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const auth = {
  signup: (data: Record<string, any>) => 
    apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data: Record<string, any>) => 
    apiRequest<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
};

export const users = {
  getMe: () => apiRequest<any>("/users/me"),
  updateMe: (data: Record<string, any>) => 
    apiRequest<any>("/users/me", { method: "PUT", body: JSON.stringify(data) }),
  getProfile: (id: string) => apiRequest<any>(`/users/${id}`),
};

export const rooms = {
  create: (data: { roomType: "coffee" | "library" | "park" | "gallery" | "beach" }) => 
    apiRequest<any>("/rooms", { method: "POST", body: JSON.stringify(data) }),
  get: (id: string) => apiRequest<any>(`/rooms/${id}`),
  join: (id: string) => apiRequest<{ message: string }>(`/rooms/${id}/join`, { method: "POST" }),
  leave: (id: string) => apiRequest<{ message: string }>(`/rooms/${id}/leave`, { method: "POST" }),
  getMembers: (id: string) => apiRequest<{ members: any[] }>(`/rooms/${id}/members`),
};

export const chat = {
  getMessages: (roomId: string, page = 1, limit = 50) =>
    apiRequest<{ messages: any[] }>(`/rooms/${roomId}/messages?page=${page}&limit=${limit}`),
};

export const music = {
  getSongs: () => apiRequest<{ songs: any[] }>("/songs"),
  getRoomState: (roomId: string) => apiRequest<any>(`/rooms/${roomId}/music`),
  play: (roomId: string, songId: string) =>
    apiRequest(`/rooms/${roomId}/music/play`, { method: "POST", body: JSON.stringify({ songId }) }),
  pause: (roomId: string) => 
    apiRequest(`/rooms/${roomId}/music/pause`, { method: "POST" }),
};

export const feedback = {
  submit: (data: { roomId: string, enjoyedDate: boolean, secondDateChoice: "yes" | "maybe" | "no" }) => 
    apiRequest<any>("/feedback", { method: "POST", body: JSON.stringify(data) }),
  getMyFeedback: (roomId: string) => apiRequest<any>(`/feedback/${roomId}`),
  getOutcome: (roomId: string) => apiRequest<any>(`/outcomes/${roomId}`),
};

export const invitations = {
  create: (data: { receiverId: string, environmentType: string }) => 
    apiRequest<any>("/invitations", { method: "POST", body: JSON.stringify(data) }),
  getPending: () => apiRequest<{ invitations: any[] }>("/invitations"),
  accept: (id: string) => apiRequest<any>(`/invitations/${id}/accept`, { method: "POST" }),
  reject: (id: string) => apiRequest(`/invitations/${id}/reject`, { method: "POST" }),
};

export const analytics = {
  recordEvent: (data: { eventName: string, metadata?: Record<string, any> }) => 
    apiRequest("/analytics/events", { method: "POST", body: JSON.stringify(data) }),
};

export const system = {
  health: async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_HEALTH_URL || "https://virtual-date-api.onrender.com/health");
    return res.json();
  },
  ping: () => apiRequest<{ message: string }>("/ping")
};