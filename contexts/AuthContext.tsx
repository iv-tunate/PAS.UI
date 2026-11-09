"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, ApiError, clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/lib/api";

/** Only admins ever sign in. Visitors have no accounts. */
export type User = {
  id: string;
  full_name: string;
  email: string;
  role: "admin";
};

type AuthContextValue = {
  user: User | null;
  /** True until we know whether a saved session is still good. */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // A normal visitor has no token, so this finishes without a single request.
  const restore = useCallback(async () => {
    if (!getAccessToken() && !getRefreshToken()) {
      setLoading(false);
      return;
    }
    try {
      const me = await api.get<{ id: string; full_name: string; email: string; role: string }>("/me", true);
      if (me.role === "admin") setUser({ id: me.id, full_name: me.full_name, email: me.email, role: "admin" });
      else clearTokens();
    } catch {
      clearTokens();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restore();
  }, [restore]);

  useEffect(() => {
    const handleLogout = () => setUser(null);
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  async function login(email: string, password: string) {
    const data = await api.post<{ user: User; access_token: string; refresh_token: string }>("/auth/login", {
      email: email.trim(),
      password,
    });
    if (data.user.role !== "admin") throw new ApiError(403, "forbidden", "This sign-in is for admins only.");
    setTokens(data.access_token, data.refresh_token);
    setUser(data.user);
  }

  async function logout() {
    const refresh = getRefreshToken();
    clearTokens();
    setUser(null);
    if (refresh) await api.post("/auth/logout", { refresh_token: refresh }).catch(() => {});
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiError };
