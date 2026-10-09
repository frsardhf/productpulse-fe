import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
}

export const AUTH_EXPIRED_EVENT = "relicase:auth-expired";

export const protectedPaths = [
  "/admin",
  "/cart",
  "/checkout",
  "/order",
  "/profile",
];

export function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isSessionTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payload = jwtDecode<JwtPayload>(token);
    return typeof payload.exp === "number" && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function safeReturnUrl(value: string | null, fallback = "/products") {
  return value?.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export function loginUrlForCurrentPage(): string {
  if (typeof window === "undefined") return "/login";
  const returnUrl = `${window.location.pathname}${window.location.search}`;
  return `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
}
