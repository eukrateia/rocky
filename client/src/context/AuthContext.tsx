import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAccessToken } from "../services/api";
import type { User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post("/auth/refresh")
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      })
      .catch(() => {
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(email, password) {
      const res = await api.post("/auth/login", { email, password });
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    },
    async register(name, email, password) {
      await api.post("/auth/register", { name, email, password });
      const res = await api.post("/auth/login", { email, password });
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    },
    async logout() {
      await api.post("/auth/logout");
      setAccessToken(null);
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
