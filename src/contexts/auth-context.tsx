"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "@/types/auth";
import {
  AUTH_EXPIRED_EVENT,
  clearStoredSession,
  isSessionTokenValid,
} from "@/lib/session";

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

function readStoredUser(): User | null {
  const token = localStorage.getItem("token");
  const value = localStorage.getItem("user");
  if (!isSessionTokenValid(token) || !value) {
    clearStoredSession();
    return null;
  }

  try {
    const user = JSON.parse(value) as Partial<User>;
    if (
      typeof user.id === "number" &&
      typeof user.name === "string" &&
      typeof user.email === "string" &&
      typeof user.role === "string"
    ) {
      return user as User;
    }
  } catch {
    // Invalid local state is handled by clearing the session below.
  }

  clearStoredSession();
  return null;
}

export function AuthProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      setUser(readStoredUser());
      setLoading(false);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user" || event.key === "token") loadUser();
    };

    const handleExpiredSession = () => setUser(null);

    loadUser();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);
    };
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, isAdmin: user?.role === "ADMIN" }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
