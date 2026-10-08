import axios from "axios";
import {
  AUTH_EXPIRED_EVENT,
  clearStoredSession,
  loginUrlForCurrentPage,
} from "@/lib/session";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ?? "https://productpulse-be.vercel.app",
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
