// src/auth/AuthProvider.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import api from "../api/client";
import { AuthContextType, UserProfile } from "./types";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /* ──────────────────────────────────────────────────────────────
   *  1.  Bootstrap tokens from localStorage (if they exist)
   * ────────────────────────────────────────────────────────────── */
  const storedAccess  = localStorage.getItem("access_token");
  const storedRefresh = localStorage.getItem("refresh_token");

  const [accessToken,  setAccessToken]  = useState<string | null>(storedAccess);
  const [refreshToken, setRefreshToken] = useState<string | null>(storedRefresh);

  /** lightweight data from the JWT only (id / exp / etc.) */
  const [user, setUser] = useState<JwtPayload | null>(
    storedAccess ? jwtDecode(storedAccess) : null
  );

  /** full profile from `/auth/me/` (username, email, role) */
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem("user_profile");
    return cached ? (JSON.parse(cached) as UserProfile) : null;
  });

  /* ──────────────────────────────────────────────────────────────
   *  2.  Helper to load the profile given a valid access token
   * ────────────────────────────────────────────────────────────── */
  const fetchProfile = useCallback(async (token: string) => {
    const { data } = await api.get<UserProfile>("auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(data);
    localStorage.setItem("user_profile", JSON.stringify(data));
  }, []);

  /* ──────────────────────────────────────────────────────────────
   *  3.  Login
   * ────────────────────────────────────────────────────────────── */
  const login = async (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    setAccessToken(access);
    setRefreshToken(refresh);

    setUser(jwtDecode(access));
    await fetchProfile(access);
  };

  /* ──────────────────────────────────────────────────────────────
   *  4.  Logout
   * ────────────────────────────────────────────────────────────── */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setProfile(null);
  };

  /* ──────────────────────────────────────────────────────────────
   *  5.  Initial profile hydrate
   * ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (accessToken && !profile) {
      fetchProfile(accessToken).catch(logout);
    }
  }, [accessToken, profile, fetchProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ──────────────────────────────────────────────────────────────
   *  6.  Silent-refresh every 4 minutes
   * ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!refreshToken) return;

    const id = setInterval(async () => {
      try {
        const { data } = await api.post("token/refresh/", {
          refresh: refreshToken,
        });
        await login(data.access, refreshToken);          // refresh + profile
      } catch {
        logout();
      }
    }, 240_000); // 4 min

    return () => clearInterval(id);
  }, [refreshToken]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ──────────────────────────────────────────────────────────────
   *  7.  Debug log: keep an eye on auth state
   * ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("🔐 Auth state", { accessToken, profile });
  }, [accessToken, profile]);

  /* ──────────────────────────────────────────────────────────────
   *  8.  Provide context
   * ────────────────────────────────────────────────────────────── */
  const ctx: AuthContextType = {
    accessToken,
    refreshToken,
    user,     // decoded JWT
    profile,  // /auth/me/ payload
    login,
    logout,
  };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};
