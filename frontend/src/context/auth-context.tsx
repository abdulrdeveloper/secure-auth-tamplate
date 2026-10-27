import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiRequest, SESSION_EXPIRED_EVENT } from "../lib/api";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ user: AuthUser }>("/auth/me")
      .then((response) => setUser(response.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const clearUser = () => setUser(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, clearUser);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, clearUser);
  }, []);

  async function logout() {
    await apiRequest("/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
