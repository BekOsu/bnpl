// src/auth/RoleRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

interface RoleRouteProps {
  children: ReactNode;
  allowedRole: "merchant" | "customer";
}

export const RoleRoute = ({ children, allowedRole }: RoleRouteProps) => {
  const { accessToken, profile } = useAuth();

  console.log("🔐 RoleRoute check", { accessToken, role: profile?.role });

  if (!accessToken) return <Navigate to="/login" />;
  if (!profile)      return null;                  // still loading /me/
  if (profile.role !== allowedRole) return <Navigate to="/login" />;

  return <>{children}</>;
};
