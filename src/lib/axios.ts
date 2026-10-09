import axios from "axios";
import {
  AUTH_EXPIRED_EVENT,
  clearStoredSession,
  loginUrlForCurrentPage,
} from "@/lib/session";

function apiBaseUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(configuredUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must be a valid URL");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must use HTTP or HTTPS");
  }
  if (parsedUrl.username || parsedUrl.password) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must not contain credentials");
  }

  return parsedUrl.toString().replace(/\/$/, "");
}

const api = axios.create({
  baseURL: apiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !String(error.config?.url ?? "").includes("/auth/login")
    ) {
      clearStoredSession();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      if (window.location.pathname !== "/login") {
        window.location.assign(loginUrlForCurrentPage());
      }
    }

    return Promise.reject(error);
  },
);

export default api;
