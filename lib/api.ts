import { toast } from "sonner";
import type {
  ApiChatMessage,
  ApiDiscoverResponse,
  ApiInvitation,
  ApiInvitationsResponse,
  ApiMatchOutcome,
  ApiRoom,
  ApiRoomMember,
  ApiUser,
  EnvironmentType,
  SecondDateChoice,
} from "@/lib/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://virtual-date-api.onrender.com/api/v1";

let isRedirecting = false;
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

/**
 * Core API request wrapper
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = null;
  if (typeof window !== "undefined") {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        token = JSON.parse(authStorage).state.token;
      }
    } catch (e) {
      console.error("Failed to parse auth token", e);
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    let errorMessage = `API error: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {}
    
    if (res.status === 401 && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/login")) {
      const authStorageStr = typeof window !== "undefined" ? localStorage.getItem("auth-storage") : null;
      if (authStorageStr) {
        const authData = JSON.parse(authStorageStr).state;
        const refreshToken = authData.refreshToken;

        if (refreshToken) {
          if (isRefreshing) {
            try {
              const newToken = await new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              });
              const newOptions = { ...options };
              newOptions.headers = { ...newOptions.headers, "Authorization": `Bearer ${newToken}` };
              return apiRequest<T>(endpoint, newOptions);
            } catch (err) {
              const error = new Error(errorMessage) as any;
              error.status = 401;
              throw error;
            }
          }

          isRefreshing = true;

          try {
            const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: refreshToken })
            });

            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              const newToken = refreshData.token;
              const newRefreshToken = refreshData.refresh_token || refreshData.refreshToken;

              authData.token = newToken;
              if (newRefreshToken) authData.refreshToken = newRefreshToken;
              
              const parsedStorage = JSON.parse(authStorageStr);
              parsedStorage.state = authData;
              localStorage.setItem("auth-storage", JSON.stringify(parsedStorage));

              processQueue(null, newToken);

              const newOptions = { ...options };
              newOptions.headers = { ...newOptions.headers, "Authorization": `Bearer ${newToken}` };
              return apiRequest<T>(endpoint, newOptions);
            } else {
              processQueue(new Error("Refresh failed"), null);
            }
          } catch (e) {
            processQueue(e, null);
          } finally {
            isRefreshing = false;
          }
        }
      }

      if (typeof window !== "undefined") {
        import('@/store/auth-store').then(({ useAuthStore }) => {
          useAuthStore.getState().setIsSessionExpired(true);
        });
      }
    }

    const error = new Error(errorMessage) as any;
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null as T;

  const text = await res.text();
  return text ? JSON.parse(text) : (null as T);
}

export const auth = {
  signup: (data: Record<string, any>) => 
    apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data: Record<string, any>) => 
    apiRequest<{ token: string, refresh_token: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  verifyEmail: (data: { token: string }) =>
    apiRequest("/auth/verify-email", { method: "POST", body: JSON.stringify(data) }),
  forgotPassword: (data: { email: string }) =>
    apiRequest("/auth/forgot-password", { method: "POST", body: JSON.stringify(data) }),
  resetPassword: (data: { token: string, new_password: string }) =>
    apiRequest("/auth/reset-password", { method: "POST", body: JSON.stringify(data) }),
  refresh: (data: { refresh_token: string }) =>
    apiRequest<{ token: string, refresh_token: string }>("/auth/refresh", { method: "POST", body: JSON.stringify(data) }),
  logout: (data: { refresh_token: string }) =>
    apiRequest("/auth/logout", { method: "POST", body: JSON.stringify(data) }),
  resendVerification: (data: { email: string }) =>
    apiRequest("/auth/resend-verification", { method: "POST", body: JSON.stringify(data) }),
  changePassword: (data: { old_password: string, new_password: string }) =>
    apiRequest("/auth/change-password", { method: "POST", body: JSON.stringify(data) }),
  getSessions: () =>
    apiRequest<any[]>("/auth/sessions"),
  revokeSession: (data: { session_id: string }) =>
    apiRequest("/auth/sessions/revoke", { method: "POST", body: JSON.stringify(data) }),
};

export const users = {
  getMe: () => apiRequest<ApiUser>("/users/me"),
  updateMe: (data: Partial<Pick<ApiUser, "name" | "bio" | "avatar">>) =>
    apiRequest<ApiUser>("/users/me", { method: "PUT", body: JSON.stringify(data) }),
  getProfile: (id: string) => apiRequest<ApiUser>(`/users/${id}`),
  getDiscover: async () => {
    const data = await apiRequest<ApiDiscoverResponse | ApiUser[]>("/users/discover");
    if (Array.isArray(data)) {
      return { users: data };
    }
    return { users: data?.users ?? [] };
  },
  getMatches: () => apiRequest<any>("/matches"),
};

export const rooms = {
  create: (data: { roomType: EnvironmentType }) =>
    apiRequest<ApiRoom>("/rooms", { method: "POST", body: JSON.stringify(data) }),
  get: (id: string) => apiRequest<ApiRoom>(`/rooms/${id}`),
  join: (id: string) => apiRequest<{ message: string }>(`/rooms/${id}/join`, { method: "POST" }),
  leave: (id: string) => apiRequest<{ message: string }>(`/rooms/${id}/leave`, { method: "POST" }),
  getMembers: (id: string) => apiRequest<{ members: ApiRoomMember[] }>(`/rooms/${id}/members`),
  list: () => apiRequest<any>("/rooms"),
};

export const chat = {
  getMessages: (roomId: string, page = 1, limit = 50) =>
    apiRequest<{ messages: ApiChatMessage[] }>(`/rooms/${roomId}/messages?page=${page}&limit=${limit}`),
  getConversations: () => apiRequest<any>("/conversations"),
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
  submit: (data: { roomId: string; enjoyedDate: boolean; secondDateChoice: SecondDateChoice }) =>
    apiRequest("/feedback", { method: "POST", body: JSON.stringify(data) }),
  getMyFeedback: (roomId: string) => apiRequest(`/feedback/${roomId}`),
  getOutcome: (roomId: string) => apiRequest<ApiMatchOutcome>(`/outcomes/${roomId}`),
};

export const invitations = {
  create: (data: { receiverId: string; environmentType: EnvironmentType }) =>
    apiRequest<ApiInvitation>("/invitations", { method: "POST", body: JSON.stringify(data) }),
  getPending: () => apiRequest<ApiInvitationsResponse>("/invitations"),
  accept: (id: string) => apiRequest<ApiInvitation>(`/invitations/${id}/accept`, { method: "POST" }),
  reject: (id: string) => apiRequest(`/invitations/${id}/reject`, { method: "POST" }),
  getHistory: () => apiRequest<any>("/invitations/history"),
};

export const analytics = {
  recordEvent: (data: { eventName: string, metadata?: Record<string, any> }) => 
    apiRequest("/analytics/events", { method: "POST", body: JSON.stringify(data) }),
};

export const notifications = {
  get: () => apiRequest<any[]>("/notifications"),
};

export const system = {
  health: async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_HEALTH_URL || "https://virtual-date-api.onrender.com/health");
    return res.json();
  },
  ping: () => apiRequest<{ message: string }>("/ping")
};